import TypeException from './TypeException.js';

export default class NotArrayException extends TypeException {
  constructor(param = '') {
    super(`Param {${param}} is not Array.`);
  }
}
