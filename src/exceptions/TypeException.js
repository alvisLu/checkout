export default class TypeException extends TypeError {
  constructor(message = '') {
    super(message);
    this.message = message;
  }
}
