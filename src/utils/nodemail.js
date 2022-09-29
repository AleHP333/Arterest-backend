const nodemailer = require('nodemailer');
require('dotenv').config();


let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: "arterest002@gmail.com", // generated ethereal user
        pass: "rrdnsnzdcxigcxsf", // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendEmail = async (email, subject, textHTML) => {
    try {
        let info = await transporter.sendMail({
            from: "arterest002@gmail.com", // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            html: textHTML, // html body
        });
        return info
    } catch (error) {
        return error
    }
}
module.exports = {nodemailer, sendEmail}