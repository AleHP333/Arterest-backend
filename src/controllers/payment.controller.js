const Transaction = require('../models/Transaction');
const User = require('../models/user');
const Product = require('../models/product');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const axios = require('axios');
const mongoose = require('mongoose');

const {sendEmail} = require('../utils/nodemail')
const {Confirmation} = require('../templates/Confirmation')
const {orderConfirmation} = require('../templates/orderConfirmation')


const {PAYPAL_API,PAYPAL_API_CLIENT,PAYPAL_API_SECRET,} = require("../config");

const createOrder = async (req, res, next) => {
  try {
    const { cartItem } = req.body;
    const { id } = req.params;

    let itemsPaypal = [];
    for (let item of cartItem) {
      let itemObj = {
        id: item._id,
        name: item.title,
        description: item.title,
        sku: item.stock.toString(),
        unit_amount: {
          currency_code: 'USD',
          value: item.price.toString(),
        },
        tax: {
          currency_code: 'USD',
          value: '0',
        },
        quantity: item.quantity.toString(),
        category: 'PHYSICAL_GOODS',
      };
      itemsPaypal.push(itemObj);
    }
    let total_value = 0;
    for (let itemV of cartItem) {
      total_value = total_value + itemV.price * itemV.quantity; 
    }
//Orden de compra que recibe Paypal

    const order = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: id,
          description: 'Arterest payment order',
          custom_id: 'CUST-Arterest',
          soft_descriptor: 'Arterest',
          amount: {
            currency_code: 'USD',
            value: total_value.toString(),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: total_value.toString(),
              },
            },
          },
          items: itemsPaypal,
        },
      ],
      application_context: {
        brand_name: "Arterest",
        landing_page: "LOGIN",
        user_action: "PAY_NOW",
        return_url: 'https://arterest-back.herokuapp.com/capture-order',
        cancel_url: 'https://arterest.vercel.app/home',
      },
    };


    // format the body
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");

    // Generate an access token
    const {
      data: { access_token },
    } = await axios.post(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      params,
      {
        headers: {
          Content_Type: "application/x-www-form-urlencoded",
        },
        auth: {
          username: PAYPAL_API_CLIENT,
          password: PAYPAL_API_SECRET,
        },
      }
    );

    console.log(access_token, "sera esto");

    // make a request
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      order,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    console.log(response.data, "i");
      //--guardar en user la orden compra
      let products = [];
      cartItem.map((el) =>
        products.push({
          publicationId: el._id,
          quantity: el.quantity,
        }) 
      );
      
    let user = await User.findByIdAndUpdate(id, {
      purchase_order: {
        products: products,
        link: response.data.links[1].href,
      },
    });
    console.log(products, "abelardo")

    res.json(response.data.links[1].href);
  
     //-- devuelvo el link de pago
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const captureOrder = async (req, res, next) => {
  const { token } = req.query;

  try {
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
      {},
      {
        auth: {
          username: PAYPAL_API_CLIENT,
          password: PAYPAL_API_SECRET,
        },
      }
    );

    const buyer_id = response.data.purchase_units[0].reference_id;
    console.log(response.data.purchase_units[0].reference_id, "aca")

    const buyer = await User.findOne({ _id: buyer_id });// ataca too bien
    const publications = buyer.purchase_order.products.map((e) => e);
    const pubs = [];

    for (let i = 0; i < publications.length; i++) {
      pubs.push(await Product.findById(publications[i].publicationId));
    }
console.log(pubs, "y esto") //ata aca parece que tamb
    const purchase_units = pubs.map((e, i) => {
      return {
        
        quantity: publications[i].quantity,
        status: 'fulfilled',
        product: pubs[i]._id,
        total_money: e.price * publications[i].quantity,
      
      };
    });

    for (let i = 0; i < purchase_units.length; i++) {
      const newTransaction = await Transaction.create({
        transaction: purchase_units[i],
        buyer: buyer._id,
      });
      console.log(purchase_units, "ahora ete")
      await User.findByIdAndUpdate(
        { _id: buyer._id },
        {
          $push: {
            buyHistory: [newTransaction._id],
          },
        },
        { new: true }
      );

      const publi = await Product.findOne({
        _id: purchase_units[i].product,
      });
      publi.stock-=purchase_units[i].quantity;
      publi.save();
    }
    await User.updateOne(
      { _id: buyer_id },
      {
        purchase_order: {
          products: [],
          link: '',
        },
      }
    );

    
    const template = orderConfirmation({
      products: pubs.map((e, i) => {return {price: e.price, title: e.title, quantity: publications[i].quantity, img: e.img, origin: e.origin}}),
      //address : buyer.country
    })

    sendEmail(buyer.email, 'Succesfully buy', template)
    

    
    await res.redirect("https://arterest.vercel.app/transaction");
    await res.status(200).json({ status: 'success', data: 'success' });
  } catch (error) {
    console.log(error);
    next(new AppError(error));
  }
};

const cancelPayment = catchAsync(async (req, res, next) => {
  let { id } = req.params;

  const transaction = await Transaction.findById(id);

  if (!transaction) {
    return next(new AppError('There is no transaction with that id', 404));
  }

  const trans = await Transaction.findByIdAndUpdate(
    id,
    { transaction: { ...transaction.transaction, status: 'rejected' } },
    { new: true }
  );

  const publication = await Product.findById(
    transaction.transaction.publication
  );

  if (!publication) {
    return next(new AppError('there is no publication with that id', 404));
  }
 
  const pub = await Product.findByIdAndUpdate(
    transaction.transaction.publication,
    {
      stock: {
        ...publication.stock,
        stock:
          publication.stock + transaction.transaction.quantity,
      },
    },
    { new: true }
  );
  // const template = purchase_canceled(id)
  // const user = await User.findOne({_id: seller.user })
  // sendEmail(user.email, 'Venta cancelada por el comprador', template)
   res.status(200).json({
    status: 'success',
    data: {
      transaction: trans,
    },
  });
});

const toFulfilled = catchAsync(async (req, res, next) => {
  let { id } = req.params;

  let transaction = await Transaction.findById(id);

  if (!transaction) {
    return next(new AppError('There are no transaction with that id', 404));
  }

  const trans = await Transaction.findByIdAndUpdate(
    id,
    { transaction: { ...transaction.transaction, status: 'fulfilled' } },
    { new: true }
  );

  const publication = await Product.findById(///ver
    transaction.transaction.product
  );


  if (!publication) {
    return next(new AppError('there is no publication with that id', 404));
  }


  
  const user_buyer = await User.findOne({_id: transaction.buyer})

  const template_confirmation = Confirmation()
  
  sendEmail(user_buyer.email, 'Compra confirmada!', template_confirmation)

  res.status(200).json({
    status: 'success',
    data: {
      transaction: trans,
    },
  });
});




module.exports = {cancelPayment, captureOrder, createOrder, toFulfilled, sendEmail}
