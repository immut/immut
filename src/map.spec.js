const { IMap } = require("./immut.js");

test("IMap constructor should create object", () => {
  expect(IMap({"a": 1}).a).toBe(1);
  expect(Object.isFrozen(IMap({}))).toBe(true);
});

test("IMap#map() should return new object", () => {
  const original = IMap({"a": 1});
  const actual = original.map((key, value) => [ value, key ]);
  expect(actual[1]).toBe("a");
  expect(original.a).toBe(1);
  expect(original[1]).toBe(undefined);
});

test("IMap#keys() should return keys", () => {
  expect(
    IMap({
      "key1": 1,
      "key2": 2,
      1: 3
    }).keys().sort()
  ).toEqual(["1", "key1", "key2"]);
});

test("IMap#values() should return values", () => {
  expect(
    IMap({
      "k1": "Value 1",
      "k2": 123,
      "k3": 56.7,
      "k4": Infinity
    }).values().sort()
  ).toEqual([123, 56.7, Infinity, "Value 1"]);
});

test("IMap#remove() removes property", () => {
  expect(
    IMap({ k1: 1, k2: 2 }).remove("k1")
  ).toEqual(IMap({ k2: 2 }));
});

test("IMap#inverted() returns inverted map", () => {
  const original = IMap({ "key1": "value1" });
  const actual = original.inverted();
  expect(original).toEqual({ "key1": "value1" });
  expect(actual).toEqual({ "value1": "key1" });
});

test("IMap#pick() returns only picked keys", () => {
  expect(IMap({
    k1: 1,
    k2: 2,
    k3: 3,
    k4: 4,
  }).pick(["k2", "k3"])).toEqual({ k2: 2, k3: 3 });
});

test("IMap#set() should set value", () => {
  const original = IMap({ a: 1, b: 2 });
  expect(original.set("a", 3)).toEqual({ a: 3, b: 2 });
  expect(original.set("c", 3)).toEqual({ a: 1, b: 2, c: 3 });
});
