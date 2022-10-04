const nodemailer = require("nodemailer");
const { google } = require("googleapis")
const {GOOGLE_USER, GOOGLE_MAIL_KEY, GOOGLE_CLIENTID, GOOGLE_CLIENTSECRET, GOOGLE_REFRESHTOKEN} = process.env

const OAuth2 = google.auth.OAuth2;

//EMAIL QUE SE ENVIARÁ AL USUARIO:
//(email será el del usuario, y code será la uniqueString);
//------------
//MESSAGE:
//Mensage que le llegará al usuario.
//------------
//TRANSPORTER:
//Funcion encargada de enviar la data al email del usuario de parte del servidor con el email del proyecto
const sendContact = async (email, code, index) => {

    const myOAuth2Client = new OAuth2( //creating the settings with 3 params
        GOOGLE_CLIENTID,
        GOOGLE_CLIENTSECRET,
        "https://developers.google.com/oauthplayground"
    );

    myOAuth2Client.setCredentials({
        refresh_token: GOOGLE_REFRESHTOKEN,
    });

    const accessToken = myOAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
        service: "gmail",
        
        auth: {
            user: "arterest002@gmail.com",
            type: "OAuth2",
            clientId: GOOGLE_CLIENTID,
            clientSecret: GOOGLE_CLIENTSECRET,
            refreshToken: GOOGLE_REFRESHTOKEN,
            accessToken: accessToken,
        },
        tls: {
            rejectUnauthorized: false, //para que el antivirus no bloquee
        },
    });
    
    const message = [
    {
        from: GOOGLE_USER,
        to: "arterest002@gmail.com",
        subject: `CONTACT US - ${(email.subject).toUpperCase()} - ${email.name}`,
        html: `<h1>THEME: ${email.subject}</h1>
                <h2>From: ${email.name} - ${email.email}</h2>
                <h3>Message: ${email.message}</h3>`              
    }
    ]
    await transporter.sendMail(message[index], (error, response) => {
        if(error){
            console.log(error);
        } else {
            console.log("check email");
        }
    })
}

module.exports = sendContact