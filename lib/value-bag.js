
class ValueBag {

  constructor(isEqual) {
    this._isEqual = isEqual;
    this._values = [];
  }

  add(value) {
    const isEqual = this._isEqual.bind(this, value);
    if (!this._values.some(isEqual)) {
      this._values = [...this._values, value];
    }
    return this;
  }

  values() {
    return this._values[Symbol.iterator]();
  }

  get size() {
    return this._values.length;
  }

}

module.exports = ValueBag;
