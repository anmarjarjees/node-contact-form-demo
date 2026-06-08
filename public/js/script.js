// Front-End Interaction:
// **********************
/*
Form Validation:
****************
- Frontend validation improves user experience (UX)
- It can be bypassed easily (disabled JS, Postman, bots, etc.)
- Backend validation is always required for security

IMPORTANT NOTES:
- Never expose sensitive data (like SMTP credentials) in frontend JavaScript
- Environment variables must exist ONLY on the server
*/

/*
Form Submission Script:
***********************
    > Listens for the form submit event,
    > Prevents the default browser page reload,
    > Sends form data to the backend API using Fetch API.
*/

// Get the contact form element from the DOM
const contactForm = document.getElementById('contact-form');

// Quick test (debug only):
/*
contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log('Form submitted');
});
*/

// Get the status message element (used to show success/error messages)
const formStatus = document.getElementById('form-status');

// Listen for form submission:
contactForm.addEventListener('submit', (event) => {

    // Prevent default browser behavior (page refresh)
    event.preventDefault();

    // Testing only (can be removed in production):
    console.log('Form submitted');

    /*
    FORM DATA COLLECTION:
    *********************
    We collect values from the input fields 
    and store them inside a JavaScript object before sending to the backend.
    */

    // Create an object containing the form values
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    // Send the form data to the backend API using Fetch API:
    /*
    FETCH API REQUEST:
    ******************
    - Built-in browser API used to make HTTP requests
    - It replaces older methods and techniques like XMLHttpRequest (XHR)

    "fetch()" Workflow Templates:
    *****************************
    BASIC FLOW:
       fetch(url, options)
            => sends request to server
                => receives response
                    => converts response to usable format (JSON here)
    
    IN CODE:
    fetch('/api/contact')
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error(error);
        });

    Link: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
    Link: https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch
    */
    fetch('/api/contact', {
        /*
        HTTP method defines the type of request:
        - GET => read data
        - POST => send new data (used here)
        - PUT => update data
        - DELETE => remove data

        We use POST because we are sending a new contact message.
        */
        method: 'POST',

        // Inform the server that the request body contains JSON data:
        /*
            Headers:
            - define metadata about the request 
            - OR metadata sent with the request

            Content-Type tells the server: "This request body is JSON format"

            This allows Express (express.json middleware)
            to correctly parse req.body.
        */
        headers: {
            // 'Content-Type' => tells the server "we are sending JSON data in the request body"
            'Content-Type': 'application/json'
            // Link: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Type
        },

        /*
            REQUEST BODY: contains the actual data being sent to the server:

            NOTE:
            *****
            > HTTP requests cannot send JavaScript objects directly
            > JavaScript objects must be converted into a "string" format
            > JSON.stringify() converts a JavaScript object into a JSON string

            Example:
                { name : "Alex Chow" }

            becomes:
                '{ "name" : "Alex Chow" }'

            Link: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
        */

        // "JavaScript Object" = JSON.stringify() => "JSON String" = HTTP Request Body => Express receives it as req.body

        // Convert JavaScript object to JSON string:
        body: JSON.stringify(formData)
    })

        /*
        HANDLE SERVER RESPONSE:
        ***********************
        Step#1: Convert response into JSON
        Step#2: Use returned data
        */
        .then(response => response.json())
        .then(data => {
            // Test:
            console.log('Server Response:', data);

            // Display message returned from backend:
            formStatus.textContent = data.message;

            /*
            If submission is successful:
            reset the form fields
            */
            // Clear form fields:
            if (data.success) {
                contactForm.reset();
            }
            // Link: https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reset
        })
        // ERROR HANDLING: Handles network errors or unexpected failures:
        .catch(error => {
            // Test:
            console.error('Error:', error);

            formStatus.textContent =
                'An error occurred while sending the message.';
        });
});

/*
The older/common Promise chaining style (.then()) implementation:

fetch(...)
    .then(...)
    .then(...)
    .catch(...)

To learn more about promises and fetch(), check my repos:
Link: https://github.com/anmarjarjees/javascript-code/blob/main/week11/README.md
Link: https://github.com/anmarjarjees/js-frameworks/blob/main/week02/README.md
*/

// AJ CAPTCHA to be added later :-)
/*
form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const recaptchaResponse = grecaptcha.getResponse();

    if (!recaptchaResponse) {
        alert('The reCAPTCHA to be completed later');
        return;
    }

    const formData = {
        name: form.name.value,
        email: form.email.value,
        subject: form.subject.value,
        message: form.message.value,
        recaptchaToken: recaptchaResponse
    };

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        document.getElementById('result').textContent =
            result.message;

        form.reset();
        grecaptcha.reset();

    } catch (error) {
        document.getElementById('result').textContent =
            'Something went wrong.';
    }
});
*/

// For DateTime => Current Year:
document.getElementById("year").innerText = new Date().getFullYear();