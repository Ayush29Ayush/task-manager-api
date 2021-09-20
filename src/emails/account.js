const sgMail = require('@sendgrid/mail')

// const sendgridAPIKey = ''

// sgMail.setApiKey(sendgridAPIKey)
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

//! Goal: Pull JWT secter and database URL into env vars
//1. Create two new env vars: JWT_SECRET and MONGODB_URL
//2. Setup values for each in the developement env files
//3. Swap out three hrdcoded values
//4. Test your work. Create new user and get their profile.

// sgMail.send({
//     // to: 'ayushsenapati123@gmail.com',
//     to: 'ayush.senapati2019@vitstudent.ac.in',
//     from: 'ayushsenapati123@gmail.com',
//     subject: 'This is a trial mail from my task app',
//     text: 'I hope this one actually gets to you.'
// })

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'ayushsenapati123@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
        // html: ''

    }).then(() => {
        console.log('Welcome Email sent')
    }).catch((error) => {
        console.error(error)
    })
      
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'ayushsenapati123@gmail.com',
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}. I hope to see you back sometime soon.`
    }).then(() => {
        console.log('Cancelation Email sent')
    }).catch((error) => {
        console.error(error)
    })
}

//! Goal: Send email to user on cancellation
//1. Setup a new function for sending an email on cancellation
//   - email and name as args
//2. Include their name in the email and ask why they cancelled
//3. call it just after the account is removed
//4. Run the request and check your inbox

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}