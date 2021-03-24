import _ from 'lodash';
import database from './data/database.json';
import NotArrayException from './exceptions/NotArrayException.js';
import Product from './Product.js';

const FIFTY_PERCENT_OFF = 0.5;

// Toggle flag of isDebug enable/disable debug message
const isDebug = process.env.MODEL === 'debug';

/**
 * Ascending sort products
 *
 * @param {Product[]} p: products
 * @result {Product[]} sorted products
 */
const _ascendingProducts = (p = []) => {
  return p.sort((x, y) => parseInt(x.id) - parseInt(y.id));
};

/**
 * Find the same product of the first pair
 *
 * @param {string[]} products: product list
 * @result {number[]} A pair of the indexes of the same products
 */
const _findFirstPairOfSameProduct = (products = []) => {
  if (!_.isArray(products)) {
    throw new NotArrayException('products');
  } else {
    let sameProductsIdx = [];
    products = _ascendingProducts(products);
    for (let i = 1; i < products.length; i++) {
      if (products[i].id === products[i - 1].id) {
        sameProductsIdx = [i - 1, i];
      }
    }
    return sameProductsIdx;
  }
};

/**
 * 50% off the second item of the same product.
 *
 * @param {Product[]} products: product list
 * @result {object[]} Modified discountPrice of products
 */
const _discountOfSameProduct = (products = []) => {
  if (!_.isArray(products)) {
    throw new NotArrayException('products');
  } else {
    let newProducts = products;
    let sameProductIdx = _findFirstPairOfSameProduct(products);

    if (sameProductIdx.length > 0) {
      // First item is origin price, second item is 50% off.
      const price0 = newProducts[sameProductIdx[0]].orgPrice;
      const price1 =
        newProducts[sameProductIdx[1]].orgPrice * FIFTY_PERCENT_OFF;

      newProducts[sameProductIdx[0]].discountPrice = price0;
      newProducts[sameProductIdx[1]].discountPrice = price1;
    }
    return newProducts;
  }
};

/**
 * NTD5 off for each item over 3 items.
 *
 * @param {Product[]} products: product list
 * @result {object[]} Modified discountPrice of products
 */
const _discountOnPurchase3ItemsOrMore = (products = []) => {
  let newProducts = products;
  if (!_.isArray(products)) {
    throw new NotArrayException('products');
  } else if (products.length >= 3) {
    let sameProductIdx = _findFirstPairOfSameProduct(products);

    if (sameProductIdx.length > 0 && products.length <= 4) {
      // Used the same product discount, less than 3 items in product list.
      return newProducts;
    }
    for (let i = 0; i < newProducts.length; i++) {
      if (!(i === sameProductIdx[0] || i === sameProductIdx[1])) {
        newProducts[i].discountPrice = newProducts[i].orgPrice - 5;
      }
    }
  }
  return newProducts;
};

/**
 * Sum of discount price.
 *
 * @param {Product[]} products: product list
 * @result {number} sum of discount price
 */
const _sumDiscountedPrice = (products = []) => {
  if (!_.isArray(products)) {
    throw new NotArrayException('products');
  } else {
    let sum = 0;
    for (let p of products) {
      sum = sum + p.discountPrice;
    }
    return sum;
  }
};

/**
 * checkout
 *
 * @param {string[]} productIDs: list of the id of the product
 * @result {number} sum price
 */
export const checkout = (productIDs = []) => {
  if (!_.isArray(productIDs)) {
    throw new NotArrayException('productIDs');
  } else {
    let products = [];
    for (let id of productIDs) {
      products = [...products, new Product(id, database.products[id].price)];
    }

    products = _discountOfSameProduct(products);
    products = _discountOnPurchase3ItemsOrMore(products);

    if (isDebug) {
      console.log(`[Debug] product list:`);
      console.table(products);
    }

    return _sumDiscountedPrice(products);
  }
};
