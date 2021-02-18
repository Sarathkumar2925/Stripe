const Cors = require('cors')
const express = require('express');
const { default: Stripe } = require('stripe');
const { v4: uuidv4 } = require('uuid')
const stripe = require('stripe')('sk_test_51ILKtMDb4LWym7o4D6DkbLooJuITlSNqyIUVfLC17c8eoP7UXopjiKgQOv5RtyoM2dXoPpzS6AkTf2ZkWIIpp1uF00slTHnI1u')

const app = express()

// Middleware

app.use(Cors())
app.use(express.json())

// Routes

app.get('/', (req, res) => {
    res.send('SERVER IS WORKING')
})

app.post('/payment', (req, res) => {
    const {product, token} = req.body;
    console.log('PRODUCT', typeof product);
    console.log('TOKEN', token);
    const idempontencyKey = uuidv4(); 

    return stripe.customers.create({
        email: token.email,
        source: token.id
    }).then(customer => {
        stripe.charges.create({
            amount: product.price,
            currency: 'INR',
            customer: customer.id,
            receipt_email: token.email,
            description: `purchase of ${product.name}`
        },{idempontencyKey})
    }).then(result => res.status(200).json(result))
    .catch(err  => console.log(err));
})

// Listen

app.listen(5000, () => {
    console.log('Server is running at PORT:5000');
})