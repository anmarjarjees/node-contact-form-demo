# NODE Contact Form Demonstration:
This project is designed as a learning and demonstration example of how a secure contact form can be implemented using Node.js and Express.

- It focuses on backend form handling concepts rather than UI/UX design complexity.
- The main goal is to demonstrate secure data flow from frontend to backend and email delivery.

---

# How the Contact Form Works:
1. The user fills out the contact form in the frontend (HTML page inside the public folder).
2. The form data is sent using JavaScript (Fetch API) to the backend server (`server.js`).
3. The Express server receives the request and processes the data.
4. Input validation is applied on the server to ensure data integrity.
5. Rate limiting is used to prevent spam or repeated abuse requests.
6. Nodemailer sends the email using configured SMTP credentials from the `.env` file.
7. A success or error response is returned back to the frontend.

---

**NOTE:**
If you need any review/refreshment about any of the following topics, please review my repositories below:
- Node Express Quick Demo (For my Digital Ecosystem course):
    - https://github.com/anmarjarjees/des-node-express-demo 
- Express Basics:
    - https://github.com/anmarjarjees/express-basics
- Building Website with Express:
    - https://github.com/anmarjarjees/express-node-website

---

# Project Preparation Steps:
- **npm init**
    - initialize the package.json file with questioning us (interactive setup prompts)

- **npm init -y**
    - initialize the package.json file with the default settings (skip questions)

- **npm install express**
    - Express (Node backend framework used for routing and API handling)

- **npm install dotenv**
    - Environment configuration tool used to load variables from `.env` file

- **npm install express-rate-limit**
    - To control the number of incoming requests and prevent abuse / spam / brute force attempts

- **npm install nodemailer** 
    - Email sending library for Node.js used to send contact form submissions

- Create the following:
    - File for express and server side script: "server.js"
    - The public folder "public"

**NOTE: You can just use "i" instead of "install" :-)**

---

After installing all the required packages, you should have them listed as dependencies in the **"package.json"** file:

```json
  "dependencies": {
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "express-rate-limit": "^8.5.2",
    "nodemailer": "^8.0.10"
  }
```

In this demo, I created a just simple HTML page that contains only a contact us form for the purpose of this tutorial.

# Frontend vs Backend separation:
- Frontend (public)
    - HTML
    - CSS
    - JavaScript (client-side)
    - visible in browser dev tools
- Backend (server-side)
    - server.js
    - Express routes
    - database logic
    - email sending (Nodemailer)
    - authentication
    - environment variables

# Project Structure Overview:
The project folder structure hierarchy:
- project-root/ <= { The project root folder for frontend/backend }
    - public/ <= { Contains all frontend files (HTML, CSS, JavaScript) }
        - index.html
        - style.css
        - script.js
        - images/
- server.js <= { Main backend entry point for Express server }
- package.json <= { Contains project dependencies and scripts }
- .env <= { Stores sensitive configuration like email credentials (not included in repository) }

Express will “serve” our website, so we need to add:
```js
app.use(express.static('public'));
```
This means: 
```bash
http://localhost:3000/
```
serves "public/index.html", so your website is now served by Node.js.

The script.js stays frontend-only and communicates with backend using HTTP requests (fetch API).

The current files/folders:
- The "public" folder contains:
    - index.html
    - style.css
    - script.js
    - images/

Backend lives here:
 -server.js => API + server logic

# Security Considerations:
- Environment variables are used to avoid exposing sensitive credentials in the codebase.
- `.env` file is excluded from version control using `.gitignore`.
- Rate limiting is implemented to reduce abuse and spam attempts.
- Server-side validation ensures that only properly formatted data is processed.

# Backend and Frontend:
Connect the contact form to the backend using fetch()
Turn the contact form into a real full-stack feature:
- HTML Form => JavaScript (fetch) => Express API (/api/contact) => Response back => User sees success/error message

# Deployment Notes:
- This project can run locally using Node.js with `npm start` or `node server.js`.
- When deployed to production, environment variables must be configured on the hosting platform.
- Shared hosting environments (like basic cPanel setups) may not support Node.js applications.

# Install and Configure Nodemailer
At this stage, we are not sending emails yet. We first install the library and verify that the server can load it correctly.

https://nodemailer.com/
```bash
npm install nodemailer
```
so the jason file for example:
```json
{
  "dependencies": {
    "nodemailer": "^8.x.x"
  }
}
```

# Installing the Environmental Variable
Environment variables are used for creating the .env file for saving sensitive secured information.

To learn more about this file, review my repo:

- https://github.com/anmarjarjees/men-starter-kit
```
npm install dotenv
```
# Testing and Running the Server:
You can simply run the command:
```bash
node server
```

**NOTES:**
- Notice that no need to specify the file extension "server.js" as node command is only used to run .js files by default.
- You could use "nodemon" for server auto refresh. To review or to learn more you can visit my repo ["MongoDB Express Node Starter Kit"](https://github.com/anmarjarjees/men-starter-kit)

