const equals = require('shallow-equals');

class BaseMap {

  merge(opts) {
    let isUnequal = false;
    for (let key of Object.keys(opts)) {
      if (this.__props[key] !== opts[key]) {
        isUnequal = true;
        break;
      }
    }

    if (!isUnequal) return this;

    return IMap({ ...this.__props, ...opts });
  }

  set(key, value) {
    if (this.__props[key] === value) {
      return this;
    }

    return IMap({
      ...this.__props,
      [key]: value
    });
  }

  map(mapFn) {
    let result = {};
    for (let entry of Object.entries(this.__props)) {
      let [ key, value ] = entry;
      let [ newKey, newValue ] = mapFn(key, value);
      result[newKey] = newValue;
    }

    if (equals(result, this.__props)) {
      return this;
    }

    return IMap(result);
  }

  setIn(path, value) {
    const p = path.shift();
    if (path.length === 0) {
      return this.set(p, value);
    } else {
      return this.set(p, this[p].setIn(path, value));
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
    }
  }

  updateIn(path, valueFn, defaultValue) {
    const p = path.shift();
    if (path.length === 0) {
      return this.set(p, valueFn(this[p] || defaultValue));
    } else {
      return this.set(p, this[p].updateIn(path, valueFn, defaultValue));
    }
  }

  keys() {
    return Object.keys(this);
  }

  values() {
    return Object.values(this);
  }

  mapValues(mapFn) {
    return this.map((key, value) => [ key, mapFn(value) ]);
  }

  mapKeys(mapFn) {
    return this.map((key, value) => [ mapFn(key), value ]);
  }

  inverted(mapFn) {
    return this.map((key, value) => [ value, key ]);
  }

  toObject() {
    return ({ ...this });
  }

  remove(key) {
    if (this.__props.hasOwnProperty(key)) {
      const result = { ...this.__props };
      delete result[key];
      return IMap(result);
    }

    return this;
  }

  filter(filterFn) {
    let result;
    let tainted = false;
    for (let [ key, value] of Object.entries(this.__props)) {
      if (!filterFn(key, value)) {
        if (!tainted) {
          result = { ...this.__props };
        }
        tainted = true;
        delete result[key];
      }
    }
    if (!tainted) return this;
    return IMap(result);
  }

  pick(keys) {
    const result = {};
    for (let key of keys) {
      result[key] = this.__props[key];
    }

    if (equals(result, this.__props)) {
      return this;
    }

    return IMap(result);
  }
}

const IMap = function(opts) {
  let result = new BaseMap();

  Object.defineProperty(result, "__props", {
    value: opts,
    enumerable: false,
    configurable: false
  });

  Object.freeze(result.__props);

  for (let entry of Object.entries(opts)) {
    let [ key, value ] = entry;
    Object.defineProperty(result, key, {
      get: () => value,
      set: (_) => { throw new Error("Cannot set '" + key + "': value is readonly, use .set()") },
      configurable: false,
      enumerable: true
    });
  }

  Object.freeze(result);
  return result;
}

module.exports = IMap;
