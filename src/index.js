import database from './database.json';
import Product from './Product.js';
import {
  sameProductDiscount,
  discountOnPurchase3ItemOrMore,
  sumDiscountedPrice,
} from './controller.js';

// Toggle flag of isDebug enable/disable debug message
const isDebug = true;

/**
 * @param {string[]} productIDs
 * @result {number} final price
 */
export const checkout = (productIDs = []) => {
  let products = [];
  for (let p in productIDs) {
    const key = productIDs[p];
    products = [
      ...products,
      new Product(productIDs[p], database.products[key].price),
    ];
  }

  products = sameProductDiscount(products);
  products = discountOnPurchase3ItemOrMore(products);
  if (isDebug) {
    console.log(`[Debug] product list:`);
    console.table(products);
  }
  return sumDiscountedPrice(products);
};

const productIDs = ['003', '002', '003', '004', '001'];
console.log(`Your price is $ ${checkout(productIDs)}`);
