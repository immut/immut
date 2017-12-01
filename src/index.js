const IMap = require("./map.js");
const IList = require("./list.js");

function fromJS(value) {
  if (typeof value === "object") {
    return IMap(value).mapValues(fromJS);
  } else if (typeof value === "array" || value instanceof BaseList) {
    return IList(value).map(fromJS);
  } else {
    return value;
  }
}

module.exports = {
  IMap, IList, fromJS
};
