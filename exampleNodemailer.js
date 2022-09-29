const  nodemailer  = require('./src/utils/nodemailer')
const { orderConfirmation } = require('./src/templates/orderConfirmation')


// orderConfirmation devuelva el template HTML con los siguientes datos
const template = orderConfirmation({
    id: '0238ry201t', // id de la orden de compra
    products: [{
        name: 'Gioconda',
        amount: 3,
        price: `$${300}` //precio total de los cuadros
    },{
        name: '4ta dimension',
        amount: 1,
        price: `$${500}`
    }],
    total_price: 800,
   
    estimated_delivery_date: `hoy` // puede agarrar el date de la transaccion y sumarle 'x' cantidad de dias
})



// sendEmail recibe los parametros Email, subject, y template
nodemailer.sendEmail('Buyer email', 'Confirm buy', template)