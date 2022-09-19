const nodemailer = require("nodemailer");
const {GOOGLE_USER, GOOGLE_MAIL_KEY} = process.env

//EMAIL QUE SE ENVIARÁ AL USUARIO:
//(email será el del usuario, y code será la uniqueString);
//------------
//MESSAGE:
//Mensage que le llegará al usuario.
//------------
//TRANSPORTER:
//Funcion encargada de enviar la data al email del usuario de parte del servidor con el email del proyecto
const sendVerification = async (email, code) => {
    const message = {
        from: "arterest002@gmail",
        to: email,
        subject: "Verify your account. (Don't reply)",
        html: `<b>Thanks for register.Please confirm your arterest account:</b>
                <a href="http://localhost:3001/signInToken/${code}">Click here to verify</a>` 
    }
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: GOOGLE_USER,
            pass: GOOGLE_MAIL_KEY 
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    await transporter.sendMail(message, (error, response) => {
        if(error){
            console.log(error);
        } else {
            console.log("check email");
        }
    })
}

module.exports = sendVerification