const { IList } = require("./immut.js");

test("1 + 1 = 2", () => expect(1+1).toBe(2));

test("IList constructor", () => {
  expect(IList()).toEqual([]);
  expect(IList([])).toEqual([]);
  expect(IList([1])).toEqual([1]);
  expect(IList([1,2,3])).toEqual([1,2,3]);
});

test("IList.of()", () => {
  expect(IList.of()).toEqual([]);
  expect(IList.of(1)).toEqual([1]);
  expect(IList.of(1,2,3)).toEqual([1,2,3]);
  expect(IList.of(undefined, undefined)).toEqual([undefined, undefined]);
});

test("IList#take", () => {
  const original = IList.of(1,2,3,4,5,6);
  expect(original.take(3)).toEqual([1,2,3]);
  expect(original.take(0)).toEqual([]);
  expect(original.take(-1)).toEqual([]);
  expect(original.take(6)).toEqual(original);
  expect(original.take(7)).toEqual(original);
});

test("IList#drop", () => {
  const original = IList.of(1,2,3,4,5,6);
  expect(original.drop(3)).toEqual([4,5,6]);
  expect(original.drop(0)).toEqual(original);
  expect(original.drop(-1)).toEqual(original);
  expect(original.drop(7)).toEqual([]);
  expect(original.drop(6)).toEqual([]);
});

test("IList#push", () => {
  expect(IList.empty.push("test")).toEqual(["test"]);
  expect(IList.of("a", "b").push("c")).toEqual(["a", "b", "c"]);
});

test("IList#takeWhile", () => {
  const original = IList.of(1,2,3,4);
  expect(original.takeWhile(n => n <= 2)).toEqual([1,2]);
  expect(original.takeWhile(n => false)).toEqual([]);
  expect(original.takeWhile(n => true)).toEqual([1,2,3,4]);
});

test("IList#dropWhile", () => {
  const original = IList.of(1,2,3,4);
  expect(original.dropWhile(n => n <= 2)).toEqual([3,4]);
  expect(original.dropWhile(n => false)).toEqual([1,2,3,4]);
  expect(original.dropWhile(n => true)).toEqual([]);
});

test("IList#reverse", () => {
  expect(IList.of(1,2,3,4).reverse()).toEqual([4,3,2,1]);
  expect(IList.of(1).reverse()).toEqual([1]);
  expect(IList.empty.reverse()).toEqual([]);
});

test("IList#shift()", () => {
  expect(IList.of(1,2,3).shift()).toBe(1);
  expect(IList.empty.shift()).toBe(undefined);
});

test("IList#unshift()", () => {
  expect(IList.of(4,5,6).unshift(1,2,3)).toEqual([1,2,3,4,5,6]);
  expect(IList.of(4,5,6).unshift()).toEqual([4,5,6]);
});

test("IList#splice", () => {
  expect(
    IList.of(1,2,7,8,5,6).splice(2, 2, 3, 4)
  ).toEqual([1,2,3,4,5,6]);

  expect(IList.of(1,2,3,4).splice(2, 0)).toEqual([1,2,3,4]);
  expect(IList.of(1,2,3,4).splice(0, 0)).toEqual([1,2,3,4]);
});

test("IList#concat", () => {
  expect(IList.of(1,2,3).concat([4,5,6])).toEqual([1,2,3,4,5,6]);
  expect(IList.of(1,2,3).concat([4,5,6], [7,8,9])).toEqual([1,2,3,4,5,6,7,8,9]);
  expect(IList.of(1,2,3).concat()).toEqual([1,2,3]);
});

test("IList#every", () => {
  expect(IList.of(1,2,3,4,5,6).every(n => n % 2 == 0)).toEqual([2,4,6]);
  expect(IList.of(1,2,3).every(n => false)).toEqual([]);
  expect(IList.of(1,2,3).every(n => true)).toEqual([1,2,3]);
});
