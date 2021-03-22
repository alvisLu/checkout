import _ from 'lodash';
import { checkout } from './controller.js';

const main = () => {
  const productIDs = ['003', '002', '003', '004', '001'];
  console.log(`Your price is $ ${checkout(productIDs)}`);
};
main();
