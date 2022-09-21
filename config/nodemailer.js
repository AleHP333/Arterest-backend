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
const sendVerification = async (email, code) => {

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
    
    const message = {
        from: GOOGLE_USER,
        to: email,
        subject: "Verify your account. (Don't reply)",
        html: `<b>Thanks for register.Please confirm your arterest account:</b>
                <a href="http://localhost:3001/verifyEmail/${code}">Click here to verify</a>` 
    }

    await transporter.sendMail(message, (error, response) => {
        if(error){
            console.log(error);
        } else {
            console.log("check email");
        }
    })
}

module.exports = sendVerification