const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const otpGenerator = require('otp-generator')
const User = require('../models/userModel')
const HttpError = require('../models/errorModel')





let nodeConfig = {
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,// change the mail
      pass: process.env.PASS
    }
}
  

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
    theme: "default",
    product : {
        name: "Mailgen",
        link: 'https://mailgen.js/'
    }
})


const sendInvitationEmail = async (userEmail, name , password ,course) => {

    var email = {
        body : {
            name: name,
            intro : 'Welcome to Storky App , You are invited to a course',
            table : {
                data : [
                    {
                        Data : "Your Password : ",
                        Value: password,
                        Comment: 'Use the same gmail and this password to Login'
                    }
                ]
            },
            outro: `You Can start to study ${course} course now.`// add the course here to render the name
        }
    }

    var emailBody = MailGenerator.generate(email);

    let message = {
        from : process.env.EMAIL,
        to: userEmail,
        subject : "Storky App Course Invite",
        html : emailBody
    }

    transporter.sendMail(message)
    
    return

}

// const sendBuyingEmail = async ( owner,userEmail, name  ,courseName , price) => {
//     // get owner data and send its e-mail to send the buying to him
//     var email = {
//         body : {
//             name: owner,
//             intro : `Welcome to Storky App , ${name} bought a course `,
//             table : {
//                 data : [
//                     {
//                         Data : `Student Email : "`,
//                         Value: userEmail,
//                         Comment: `Please Make sure to add him to your Course`
//                     }
//                 ]
//             },
//             outro: `${name} just bought a course ${courseName} , you have ${price}$ added in your bank account.`
//         }
//     }

// }




module.exports = sendInvitationEmail
