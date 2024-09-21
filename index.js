const express = require('express');
const cors = require('cors');
// const { resolve } = require('path');

const app = express();
app.use(cors());
const port = 3000;

app.use(express.static('static'));

// server side values
let taxRate = 5;
let discountPercentage = 10;
let loyaltyRate = 2; //(2 points per 1$)

// to calculate total price of the items in the cart
function totalPrice(newItemPrice, cartTotal) {
  return newItemPrice + cartTotal;
}

app.get('/cart-total', (req, res) => {
  let newItemPrice = parseFloat(req.query.newItemPrice);
  let cartTotal = parseFloat(req.query.cartTotal);
  res.send(totalPrice(newItemPrice, cartTotal).toString());
});

// apply discount based on membership status
function discount(isMember, cartTotal) {
  if (isMember) {
    return cartTotal - (discountPercentage * cartTotal) / 100;
  } else {
    return cartTotal;
  }
}

app.get('/membership-discount', (req, res) => {
  let isMember = req.query.isMember === 'true';
  let cartTotal = parseFloat(req.query.cartTotal);
  res.send(discount(isMember, cartTotal).toString());
});

// calculating tax on total cart
function totalCart(cartTotal) {
  let amountAfterTax = cartTotal * (taxRate / 100);
  return amountAfterTax;
}

app.get('/calculate-tax', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  res.send(totalCart(cartTotal).toString());
});

// delivery time based on shipping method
function totalTime(distance, shippingMethod) {
  if (shippingMethod == 'standard') {
    return distance / 50;
  } else if (shippingMethod == 'express') {
    return distance / 100;
  }
}

app.get('/estimate-delivery', (req, res) => {
  let distance = parseFloat(req.query.distance);
  let shippingMethod = req.query.shippingMethod;
  res.send(totalTime(distance, shippingMethod).toString());
});

// shipping cost based on weight and distance

function totalCost(distance, weight) {
  return weight * distance * 0.1;
}

app.get('/shipping-cost', (req, res) => {
  let distance = parseFloat(req.query.distance);
  let weight = parseFloat(req.query.weight);
  res.send(totalCost(distance, weight).toString());
});

// loyalty points earned from a purchase
function totalPoints(purchaseAmount) {
  return purchaseAmount * 2;
}

app.get('/loyalty-points', (req, res) => {
  let purchaseAmount = parseFloat(req.query.purchaseAmount);
  res.send(totalPoints(purchaseAmount).toString());
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
