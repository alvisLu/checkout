import _ from 'lodash';
import errorMsg from './errorMsg.js';

/**
 * Find the first pari of the same product.
 *
 * @param {string[]} products: product list
 * @result {number[]} A pair of the index of the same products
 */
const _findFirstPariOfSameProduct = (products = []) => {
  if (!_.isArray(products)) {
    throw new Error(errorMsg.isNotArray);
  } else {
    let sameProductsIdx = [];
    for (let i = 0; i < products.length; i++) {
      for (let j = 1; j < products.length; j++) {
        if (products[i].id === products[j].id) {
          sameProductsIdx = [i, j];
          break;
        }
      }
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
export const sameProductDiscount = (products = []) => {
  if (!_.isArray(products)) {
    throw new Error(errorMsg.isNotArray);
  } else {
    let newProducts = products;
    let sameProductIdx = _findFirstPariOfSameProduct(products);

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
export const discountOnPurchase3ItemOrMore = (products = []) => {
  let newProducts = products;
  if (!_.isArray(products)) {
    throw new Error(errorMsg.isNotArray);
  } else if (products.length >= 3) {
    let sameProductIdx = _findFirstPariOfSameProduct(products);

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
 * @param {string[]} products
 * @result {number} sum discountPrice of ths product list
 */
export const sumDiscountedPrice = (products = []) => {
  if (!_.isArray(products)) {
    throw new Error(errorMsg.isNotArray);
  } else {
    let sum = 0;
    for (let p of products) {
      sum = sum + p.discountPrice;
    }
    return sum;
  }
};
