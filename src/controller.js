import _ from 'lodash';
import database from './data/database.json';
import NotArrayException from './exceptions/NotArrayException.js';
import Product from './Product.js';

// Toggle flag of isDebug enable/disable debug message
const isDebug = process.env.MODEL === 'debug';

/**
 * Find the first pair of the same product.
 *
 * @param {string[]} products: product list
 * @result {number[]} A pair of the index of the same products
 */
const _findFirstPairOfSameProduct = (products = []) => {
  if (!_.isArray(products)) {
    throw new NotArrayException('products');
  } else {
    let sameProductsIdx = [];
    for (let i = 0; i < products.length; i++) {
      for (let j = 1; j < products.length; j++) {
        if (j !== i && products[i].id === products[j].id) {
          sameProductsIdx = [i, j];
          break;
        }
      }
      // Find the first pair.
      if (sameProductsIdx.length > 1) {
        break;
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
    let newProducts = _.cloneDeep(products);
    let sameProductIdx = _findFirstPairOfSameProduct(products);

    if (sameProductIdx.length > 0) {
      for (let i = 0; i < sameProductIdx.length; i++) {
        const idx = sameProductIdx[i];
        const orgPrice = newProducts[idx].orgPrice;
        // First item is origin price, second item is 50% off.
        newProducts[idx].discountPrice = i === 0 ? orgPrice : orgPrice * 0.5;
      }
    }
    return newProducts;
  }
};

/**
 * NTD5 off for each item over 3 item.
 *
 * @param {Product[]} products: product list
 * @result {object[]} Modified discountPrice of products
 */
const _discountOnPurchase3ItemOrMore = (products = []) => {
  let newProducts = _.cloneDeep(products);
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
 * @result {number} sum discountPrice of ths product list
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
    products = _discountOnPurchase3ItemOrMore(products);

    if (isDebug) {
      console.log(`[Debug] product list:`);
      console.table(products);
    }

    return _sumDiscountedPrice(products);
  }
};
