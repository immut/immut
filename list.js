class BaseList extends Array {
  concat(...argsN) {
    let args = argsN.shift();

    if (args === undefined) {
      return this;
    }

    if (args.length === 0) {
      return this.concat(...argsN);
    }

    return IList([ ...this, ...args ]).concat(...argsN);
  }

  shift() {
    return this[0];
  }

  unshift(...args) {
    return [ ...args, ...this ];
  }

  reverse() {
    if (this.length <= 1) {
      return this;
    }
    let result = [ ...this ].reverse();
    return result;
  }

  push(...args) {
    return [ ...this, ...args ];
  }

  splice(start, deleteCount, ...items) {
    let result = [ ...this ];
    Array.prototype.splice.apply(result, [ start, deleteCount, ...items ]);
    return IList(result);
  }

  take(n) {
    if (n <= 0) return IList.empty;
    if (n >= this.length) return this;
    return this.slice(0, n);
  }

  drop(n) {
    if (n <= 0) return this;
    if (n >= this.length) return IList.empty;
    return this.slice(n);
  }

  takeWhile(fn) {
    let i = 0;
    for (i = 0; i < this.length; i++) {
      if (!fn(this[i])) {
        break;
      }
    }
    return this.take(i);
  }

  dropWhile(fn) {
    let i = 0;
    for (i = 0; i < this.length; i++) {
      if (!fn(this[i])) {
        break;
      }
    }
    return this.drop(i);
  }

  find(fn) {
    for (let i = 0; i < this.length; i++)
      if (fn(this[i]))
        return this[i];
  }

  every(fn) {
    let result = [];
    for (let i = 0; i < this.length; i++)
      if (fn(this[i]))
        result.push(this[i]);
    return IList(result);
  }

  fill(value, start, end) {
    let result = [ ...this ];
    return IList(result.fill(value, start, end));
  }

  setIn(path, value) {
    let index = path.shift();
    if (path.length === 0) {
      let result = [ ...this ];
      result[index] = value;
      return IList(result);
    } else {
      return this[index].setIn(path, value);
    }
  }

  updateIn(path, valueFn, defaultValue) {
    let index = path.shift();
    if (path.length === 0) {
      let result = [ ...this ];
      result[index] = valueFn(result[index] || defaultValue);
      return IList(result);
    } else if (this[index] && this[index].updateIn) {
      return this.setIn([index], this[index].updateIn(path, valueFn, defaultValue));
    } else {
      return this;
    }
  }

  getIn(path, defaultValue) {
    const p = path.shift();
    if (path.length === 0) {
      const value = this[p];
      if (value === undefined) {
        return defaultValue;
      }
      return value;
    } else if (this[p] && this[p].getIn) {
      return this[p].getIn(path, defaultValue);
    } else {
      return defaultValue;
    }
  }
}

const IList = function(values) {
  let result;
  if (values === null || values === undefined || !values.length) {
    return IList.empty;
  } else if (values.length === 1) {
    result = new BaseList();
    result[0] = values[0];
  } else {
    result = new BaseList(...values);
  }
  Object.freeze(result);
  return result;
}

IList.of = (...args) => IList(args);
IList.empty = new BaseList();

module.exports = IList;
