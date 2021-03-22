import { checkout } from '../controller.js';

describe('Checkout', () => {
  describe('When there are 3 items or more in the productIDs', () => {
    describe('If there are the same products', () => {
      const productIDs = ['001', '002', '003', '004', '001'];
      // Reference data src/database.json
      const price = 45 + 50 + 55 + 60 + 45 * 0.5 - 5 * 3;

      it('Should be NTD5 off same product!!!', () => {
        expect(checkout(productIDs)).toBe(price);
      });
    });
  });
});

describe('Checkout', () => {
  describe('When there are 3 items or more in the productIDs', () => {
    describe('If there are not the same products', () => {
      const productIDs = ['001', '002', '003', '004', '005'];
      // Reference data src/database.json
      const price = 45 + 50 + 55 + 60 + 35 - 5 * 5;

      it('Should be NTD5 off for each item', () => {
        expect(checkout(productIDs)).toBe(price);
      });
    });
  });
});

describe('Checkout', () => {
  describe('When less than 3 items in productIDs', () => {
    describe('If there are the same products', () => {
      const productIDs = ['002', '002'];
      // Reference data src/database.json
      const price = 50 + 25;

      it('Only used discount same products', () => {
        expect(checkout(productIDs)).toBe(price);
      });
    });
  });
});

describe('Checkout', () => {
  describe('When less than 3 items', () => {
    describe('If there are not the same products', () => {
      const p1 = [];
      const p2 = ['005'];
      const p3 = ['001', '002'];
      // Reference data src/database.json
      const price2 = 35;
      const price3 = 45 + 50;

      it('Should be used original price', () => {
        expect(checkout(p1)).toBe(0);
        expect(checkout(p2)).toBe(price2);
        expect(checkout(p3)).toBe(price3);
      });
    });
  });
});

describe('Checkout', () => {
  describe('When param type is not an Array', () => {
    it('Should be throw error message', () => {
      expect(() => {
        checkout('Hello world');
      }).toThrow(TypeError);

      expect(() => {
        checkout(true);
      }).toThrow(TypeError);

      expect(() => {
        checkout(0);
      }).toThrow(TypeError);

      expect(() => {
        checkout({ a: 'a', b: 'b' });
      }).toThrow(TypeError);
    });
  });
});
