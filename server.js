/*
Case Study: Secure JavaScript Contact Form
*******************************************
This file (server.js) represents the backend layer of a full-stack contact form project.

It demonstrates how a Node.js + Express server handles:
- HTTP server creation
- API routing
- static file serving (frontend portfolio)
- form submission handling
- email delivery via SMTP (Nodemailer - later step)

This is a learning-focused implementation designed for students and recruiters
to understand real-world backend structure in a simplified way.

Link: https://expressjs.com/en/

I tried to clearly explain all the steps below.
However, for more details and learning examples, refer to my GitHub repositories about Express:
- https://github.com/anmarjarjees/express-basics
- https://github.com/anmarjarjees/des-node-express-demo
- https://github.com/anmarjarjees/express-node-website
*/

/*
NOTE:
*****
Node.js supports CommonJS by default (require => module.exports).
This project uses ES Modules (import => export syntax), so we must ensure:

    "type": "module"

is added in the "package.json" file.

This enables modern JavaScript module syntax in Node.js.
*/

// STEP#1: IMPORTS

/*
Express is a minimal and flexible Node.js web framework for:
- Creating HTTP servers
- Defining API routes
- Handling requests/responses
- Serving static files
*/
// Express framework:
import express from 'express';

/*
Nodemailer:
***********
Is a Node.js library for sending emails from a server.
It is commonly used in backend applications for:
- Contact forms
- Password reset emails
- Notifications
- System alerts

Supported email providers:
- SMTP servers (recommended)
- Gmail
- Outlook / Microsoft 365
- cPanel email accounts
- Other SMTP-compatible services

Link: https://nodemailer.com/about/
*/
// Nodemailer (SMTP email sending library)
import nodemailer from 'nodemailer';

/*
Nodemailer Transporter:
************************
A transporter is the core component in Nodemailer.

It is responsible for:
- Connecting to an SMTP server
- Authenticating the email account
- Sending the email message

We will configure the transporter using environment variables
so that sensitive credentials are not stored in source code.

Link: https://nodemailer.com/smtp/

Steps:
******
1) Prepare an email account (usually from cPanel hosting)
2) Collect SMTP credentials:
    - SMTP Host => Example: mail.DomainName.com
    - SMTP Port => either 465 or 587
    - Email address => Example: info@DomainName.com
    - Email password

    EXAMPLE:
    mail.DomainName.com
    465
    contact@DomainName.com OR info@DomainName.com

3) Store credentials securely using environment variables:
    - .env file (project root level)
    - accessed via process.env
    - Installing the "dotenv": npm install dotenv

4) Create transporter using:
   nodemailer.createTransport()

Security Tips:
**************
- NEVER hardcode email credentials in source code
- Always use environment variables (.env file)
- Environment variables are conventionally written in UPPERCASE
    > Example: USER_PASSWORD

Process Explanation:
    Visitor 
        => Contact Form (Frontend)
            => Fetch API (JavaScript)
                => Express API (/api/contact)
                    => Server-side Validation 
                        => Nodemailer 
                            => SMTP Server (email provider: info@mydomainname.com) 
                                => Email Delivered

CPanel EMAIL TIP:
To find SMTP settings ("Mail Client Manual Settings") in cPanel:
- Go to Email Accounts
- Click "Connect Devices" (this button should be beside each email)
- Copy Mail Client Manual Settings

NOTES:
1) This application ONLY sends emails:
    > ONLY needs: "Send Email"
        >> Only transmitting outgoing messages
    > NOT reading emails
    > NOT downloading emails

2) SMTP vs IMAP vs POP3::
    > SMTP => Send email (used here) => Simple Mail Transfer Protocol (SMTP)
        - Send email
    
    > IMAP => Read email => Internet Message Access Protocol (IMAP)
        - Read emails while keeping them on the server
    
    > POP3 => Download email => Download emails from server (Older Protocol/Less common)
        - - Downloads emails locally (older approach)

3) We can access the env variables using the node process object "process":
   > process.env.VARIABLE_NAME
*/

/*
express-rate-limit:
*******************
This middleware protects backend routes from abuse, spam, and automated bot requests.

Common use cases:
- Prevent contact form spam
- Limit repeated submissions from the same IP
- Reduce bot traffic
- Protect email sending endpoints (important for Nodemailer-based systems)

Link: https://www.npmjs.com/package/express-rate-limit
*/

// Rate limiting middleware (security layer)
import rateLimit from 'express-rate-limit';

/*
dotenv:
*******
dotenv is used to load environment variables from a .env file into process.env.

This is essential for:
- Keeping sensitive data out of source code
- Managing configuration per environment (dev, production)

Example variables stored in .env:
- SMTP_HOST
- SMTP_USER
- SMTP_PASS
- PORT

Link: https://www.npmjs.com/package/dotenv
*/
// dotenv (loads environment variables from .env file)
import dotenv from 'dotenv';

// Load environment variables into process.env
dotenv.config();

// STEP#2: APP SETUP
/*
Initializing the main Express app object.

The "app" object is used to:
- Define routes (GET, POST, and others...)
- Register middleware
- Handle requests and responses
*/
// Create Express application instance
const app = express();

/*
PORT Configuration:
*******************
The application listens on a port for incoming HTTP requests.
- In production: use environment variable will be: process.env.PORT
- In local development: will be: 3000

if production
    then process.env.PORT
else if local
    then 3000
*/

// Using environment variable in production, fallback to 3000 locally
const PORT = process.env.PORT || 3000;

/*
The built-in Express middleware : express.json()
-  Parses incoming JSON requests.
- It allows us to access request body data via: req.body

Example data sent from the contact form:
{
  "name": "Alex Chow",
  "email": "alex@alexchow.com"
}

Without this middleware, req.body would be undefined.
Link: https://expressjs.com/en/api.html#express.json
*/
app.use(express.json());

/*
Static File Hosting:
This middleware serves static files from the "public" directory.

Example:
http://localhost:3000/index.html
http://localhost:3000/style.css
http://localhost:3000/logo.png

In Action:
- Browser requests a file
- Express checks /public folder
- File is returned if it exists

Important Architecture Rule:
- public/ => frontend (HTML, CSS, JS)
- server.js => backend logic (server-side <==> NOT publicly exposed)
*/
app.use(express.static('public'));
/*
NOTE:
If "index.html" exists inside /public,
Express automatically serves it as the default homepage:
    URL: http://localhost:3000/

This is default Express static behavior
*/

/*
STEP#3: HEALTH CHECK ROUTE:
***************************
A health check route is a simple backend endpoint => verify the server is running correctly

Commonly used in:
- Cloud deployments (AWS & Azure)
- Container systems (Docker & Kubernetes)
- Monitoring tools and uptime checks
- Development debugging

Notice that this endpoint is optional and does NOT affect core application logic

Link: https://expressjs.com/en/5x/api/response.html
Link: https://expressjs.com/en/advanced/healthcheck-graceful-shutdown/
Link: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
*/

// http://localhost:3000/health
app.get('/health', (req, res) => {
    /*
    HTTP Response:

    res.status(200)
    - Sets HTTP status code to 200 (OK)
    - Indicates the request was successful

    res.json()
    - Sends a JSON response to the client
    - Standard format for REST APIs
    */
    res.status(200).json({
        status: 'OK',
        message: 'Server is running'
    });
});

/*
ROOT ROUTE (OPTIONAL TEST ENDPOINT)
***********************************
It's a simple endpoint used to verify backend connectivity from a browser.

Example:
    GET /


IMPORTANT NOTE:
***************
If we use: app.use(express.static('public'))
Then:
    - Express automatically serves /public/index.html as the homepage (/)
    - Defining app.get('/') will OVERRIDE static file serving

That is why this route is commented out to avoid conflicts.
*/

/*
app.get('/', (req, res) => {
    res.send('Contact Form Backend is running');
});
*/

/*
Contact Form API Endpoint:
**************************
This endpoint handles incoming contact form submissions from the frontend.

It uses a POST request to receive user data securely from the browser.

It is the first step in the full request lifecycle:
Frontend Form => API => Server Validation => Email

The process structure:
**********************
Frontend Form (HTML + JS) 
    => POST /api/contact 
        => Express receives data 
            => Validation
                => Processing (Email Sending)
                    => Response returned to browser

At this stage, this endpoint represents the ENTRY POINT of the backend workflow.

Link: https://expressjs.com/en/guide/routing/
Link: https://expressjs.com/en/api/
*/


/*
Rate Limiter Middleware:
************************
    - It protects the contact form from abuse, spam, and automated bots
    - It limits how frequently a single IP address can submit the form

Rules:
- Maximum requests: 3 submissions
- Time window: 15 minutes
- Applied per IP address

Example:

Visitor IP: 123.45.67.89

Request#1 => Is allowed
Request#2 => Is allowed
Request#3 => Is allowed
Request#4 => Is blocked (Too many requests from the same IP => HTTP 429)

The HTTP status code 429, is a standard response
defined by the official HTTP protocol for rate limiting

Link: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/429
Link: https://www.rfc-editor.org/info/rfc6585/#section-4

After 15 minutes:
Counter resets automatically.

IMPORTANT NOTE:
***************
This limiter must be defined BEFORE the POST route:
    app.post('/api/contact', ...)

Otherwise, it will not protect the endpoint correct
*/

// Rate limiter configuration for contact form protection
const contactFormLimiter = rateLimit({

    /*
        Time Window => Defines the time period for request counting (in milliseconds):

        15 minutes = 15 × 60 × 1000 = 900,000 milliseconds
    */
    windowMs: 15 * 60 * 1000,

    // Maximum requests/numbers of allowed submissions per IP within the time window:
    max: 3, // 3 requests allowed (4th request blocked)

    /*
    Custom Block Response:
        > Returned when user exceeds the request limit
        > Sent as JSON response (recommended for APIs)
    */
    // Custom response when limit is exceeded (Returned as JSON):
    message: {
        success: false,
        message: 'Too many contact form submissions. Please try again later.'
    },

    // standardHeaders:
    // Enables modern rate limiting headers (recommended)
    // These headers help clients understand rate limit status (remaining requests or reset time)
    standardHeaders: true,

    // legacyHeaders:
    // Disables older X-RateLimit-* headers
    // These are outdated and not needed in modern APIs
    legacyHeaders: false

    // Link: https://www.npmjs.com/package/express-rate-limit
    // Link: https://github.com/express-rate-limit/express-rate-limit
    // Link: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers
});

/*
Nodemailer Transporter:
***********************
- The transporter is the core object in Nodemailer
- It's responsible for:
    > connecting to the SMTP server and sending emails
    > authenticating email credentials
    > sending outgoing emails

    >> Transporter = The bridge between Node.js application and email server (SMTP)

IMPORTANT CONCEPTS:
- SMTP = sending emails
- IMAP/POP3:
    = reading emails
    = NOT used in this project (send-only app)

 We use environment variables (.env file) to avoid exposing sensitive credentials:
- SMTP username
- SMTP password
- SMTP host/port

Link: https://nodemailer.com/smtp/
Link: https://nodemailer.com/message/
Link: https://nodemailer.com/smtp/#1-single-connection
*/

// STEP#5: NODEMAILER TRANSPORTER (SMTP CONFIGURATION)
const transporter = nodemailer.createTransport({
    /*
    SMTP HOST => Defines the email server that we want to connect to
    Example:  mail.mydomain.com
    */
    host: process.env.SMTP_HOST, // mail.mydomain.com

    /*
    SMTP PORT => Environment variables are always strings by default.

    Nodemailer expects a numeric value, so we convert it using: Number()

    If .env is missing or wrong => NaN => Adding the optional value || 465
    */
    port: Number(process.env.SMTP_PORT) || 465, // 465

    /*
    SECURE CONNECTION NOTE:
    ***********************
    secure = true means SSL/TLS is used.

    Common Used Rule:
    - Port 465 => uses SSL (secure connection enabled)
    - Port 587 => uses STARTTLS (secure = false, then upgraded to secure connection)

    Link: https://nodemailer.com/smtp/
    Link: https://developer.mozilla.org/en-US/docs/Glossary/TLS

    We dynamically set it based on environment configuration.
    */
    // secure: true, // IMPORTANT: true because 465 = SSL (cPanel hosting commonly defaults to 465 SSL)
    // Problem: true => assumes port 465 only => hard-coded (SMTP mismatch risk)
    secure: process.env.SMTP_PORT === '465',

    /*
    AUTHENTICATION:
    - Credentials used to log into the SMTP server
    - These values are stored in .env for security reasons
    */
    auth: {
        user: process.env.SMTP_USER, // info@mydomain.com
        pass: process.env.SMTP_PASSWORD // email password from hosting cPanel
    }
});

// STEP#6: SMTP Connection Check:
/*
This block checks whether SMTP environment variables exist
before attempting to connect to the email server.

If .env is missing:
    - host: process.env.SMTP_HOST = undefined
    - user: process.env.SMTP_USER = undefined
    - password: process.env.SMTP_PASSWORD = undefined
    - no immediate crash but email just silently fails later
*/
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    /*
        transporter.verify() => Testing the SMTP connection before sending emails.
        
        Check:
        - Server connection
        - Authentication validity
        - SMTP configuration correctness
    */
    transporter.verify((error) => {
        if (error) {
            console.error('SMTP connection error:', error.message);
        } else {
            console.log('SMTP is ready to send emails');
        }
    });
} else {
    console.warn('SMTP env variables missing or not configured properly');
}

/*
TEST EMAIL ROUTE (Nodemailer) For Development ONLY:
***************************************************
This endpoint is used as a debugging tool 
to test if SMTP + Nodemailer configuration is working correctly
before connecting it to the real contact form.

To confirm:
- SMTP configuration is correct
- Nodemailer is working properly
- Email delivery is functional

IMPORTANT NOTES:
****************
    > This route should NOT be exposed in production.
    > It is strictly for development/testing purposes.

Workflow:
> Browser / Postman
    > GET /test-email-dev-mode-only
        > Server sends email using SMTP:
            >> If success: return JSON success response
            >> If error: return JSON error response
*/

// TEST EMAIL ROUTE (DEBUG TOOL ONLY)
app.get('/test-email-dev-mode-only', async (req, res) => {
    try {
        /*
        sendMail(): 
            - Main Nodemailer function for sending emails
            - Returns info object with delivery result

        async/await:
            - Waits for SMTP server response
            - Ensures email is fully processed before continuing

        Link: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
        */
        const info = await transporter.sendMail({
            /*
            "from" => Sender identity from the email input field
            Value Format: "Display Name <email>" => Using JS Template Literal
            */
            from: `"Portfolio Test" <${process.env.SMTP_USER}>`,

            /*
            "to" => Recipient email address
            In this test case:  We send email to ourselves to confirm SMTP works
            */
            to: process.env.SMTP_USER,

            /*
            "subject" => Email title shown in inbox (input field)
            */
            subject: "SMTP Test - Nodemailer Working",

            /*
            "text" => Plain text email body
            (Later we can upgrade to HTML templates)
            */
            text: "If you received this email, your SMTP configuration is working correctly."
        });

        /*
        SUCCESS RESPONSE:
        *****************
        If email is sent successfully, 
        we return JSON response to confirm:
        */
        res.status(200).json({
            success: true,
            message: "Email sent successfully",

            /*
            "info" => Contains SMTP response details (metadata) which is useful for debugging
            - messageId
            - accepted recipients
            - sever response
            */
            info
        });

    } catch (error) {

        /*
        ERROR HANDLING:
        ***************
        If anything fails:
        - Wrong SMTP credentials
        - Invalid port / host
        - Network issues
        - Email provider rejection
        */
        console.error(error);

        /*
        ERROR RESPONSE:
        ***************
        Send failure response back to client
        so frontend can handle it properly.
        */
        res.status(500).json({
            success: false,
            message: "Email failed",

            /*
            error.message => Human-readable error description
                > Safe for debugging, not full stack trace
            */
            error: error.message
        });
    }
});

/*
- app.get() => Express official docs
- sendMail() => Nodemailer official docs
- async/await => JavaScript language (MDN)
*/

// STEP #7: CONTACT FORM API (VALIDATION + EMAIL SENDING)
// Frontend => fetch() => /api/contact => validation => SMTP email => response
/*
To Review:
**********
- The original standard code => app.post('/api/contact', async (req, res) => { ... }
But after creating the "rateLimit", we need to attach it:
- The changed code => app.post('/api/contact', contactFormLimiter, async (req, res) => { ... }

Express executes middleware as shown below:
    >> Visitor
        >> contactFormLimiter
            >> Validation
                >> Nodemailer
                    >> JSON Response
*/
app.post('/api/contact', contactFormLimiter, async (req, res) => {
    try {
        /*
        Extract data from request body.
        
        NOTE:
        This works because we already enabled:
        app.use(express.json());
        */
        // Testing: Debug log (development only)
        // console.log(req.body); // removed => it logs user data!

        const { name, email, subject, message } = req.body || {};
        /*
        If req.body is:
            - undefined
            - or not JSON (bad request / bot / malformed request)
        Then JavaScript throws:
            TypeError: Cannot destructure property 'name' of 'req.body' 
            because it is undefined
        */

        /*
            Server-Side Validation:
            ***********************
            Never trust data received from the client.
    
            Even if the browser performs validation using the HTML attributes,
            we must make the server validate all incoming data again.
    
            Required fields:
            - name
            - email
            - message
    
            We must ensure required fields are not empty before processing.

            Remember that:
                >> Client-side validation => improves user experience
                >> Server-side validation => protects the application
         */

        // Input Sanitization (basic cleanup) => Clean input to avoid accidental spaces:
        const cleanName = typeof name === 'string' ? name.trim() : '';

        /*
        Email Format Validation: Using regular expression performs a basic email format check
        Link:
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions
        */
        const cleanEmail =
            typeof email === 'string'
                ? email.replace(/\r|\n/g, '').trim() // prevent header injection attacks (remove newlines from email)
                : '';
        /*
        The javaScript "/\r|\n/g" removes:
        \r = Carriage Return
        \n = New Line
        To prevent email header injection attacks.

        Link: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
        */

        const cleanSubject = typeof subject === 'string' ? subject.trim() : '';
        const cleanMessage = typeof message === 'string' ? message.trim() : '';

        // Basic validation (minimal required check):
        if (!cleanName || !cleanEmail || !cleanMessage) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and message are required!'
                /*
                Notice that we used "return res.status(400).json(...)" instead of just "res.status(400).json(...)"
                to stop/terminate the execution immediately, otherwise, the route continues executing.
    
                status code:
                - 200 = Success
                - 400 = Bad Request
    
                Link: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status
                */
            });
        }

        // Email format validation (important):
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        /*
        Email ReEx:
        - This regular expression was obtained from commonly used web development references
        and reviewed for this demonstration project.
        - It's used in this demo project because it is the simplest version,
        and suitable for basic email validation.

        NOTES:
         - This pattern validates the general structure of an email address only
         - It does not verify that the email account actually exist

        Link: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions
        Link: https://regex101.com
        */

        if (!emailRegex.test(cleanEmail)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format!'
            });
        }

        /*
        At this stage we are ONLY verifying input structure.
        No email sending or external services yet.
        */

        // Testing: Debug log (development only):
        console.log('New contact form submission received');
        /*
        console.log('New contact form submission received:', {
            // Avoid logging full user payload in production logs
            // name: cleanName,
            // email: cleanEmail,
            // subject: cleanSubject,
            // message: cleanMessage
        });
        */

        /*
        SEND EMAIL USING NODEMAILER:
        ****************************
        Build the email object that will be passed to:
            > transporter.sendMail()
        
            This object contains:
            - sender information
            - recipient information
            - email subject
            - email body
        */
        const mailOptions = {
            from: `"Portfolio Contact Form" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER,
            subject: cleanSubject || "New Contact Form Message",
            text: `
                You received a new message from your portfolio:

                Name: ${cleanName}
                Email: ${cleanEmail}
                Subject: ${cleanSubject || "No subject"}

                Message:
                ${cleanMessage}
            `
        };

        // Send email with transporter via SMTP:
        await transporter.sendMail(mailOptions);

        // Return success response:
        // HTTP 200 => Request processed successfully
        return res.status(200).json({
            success: true,
            message: "Message sent successfully"
        });
    }
    /*
        Finally => Catch any unexpected runtime errors like:
            - SMTP connection failure
            - Authentication failure
            - Network issues
            - Email provider rejection
    */
    catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to send message",
            error: error.message
        });
    }
});

/*
STEP#8: START SERVER
This starts the HTTP server and listens for incoming requests
*/
app.listen(PORT, () => {
    console.log(`Application URL => http://localhost:${PORT}`);
});

/*
RUNNING THE APPLICATION:
************************
1) Start the server:
    > node server.js

2) Then open:
    > http://localhost:3000

NOTES:
- This demo project does not use Nodemon
- Nodemon is a useful development tool that automatically restarts
  the server when we change our project files
- Please review the links to my Node.js and Express repositories :-)
*/

/*
TIP:
Remember that in the package.json file there is a "scripts" section:

"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1"
}

As we did with Nodemon, we can also add the following script (optional):

"scripts": {
  "start": "node server.js",
  "test": "echo \"Error: no test specified\" && exit 1"
}

Then we can run the application using:

    > npm start

Instead of:

    > node server.js
*/