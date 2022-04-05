import * as generateRandomString from "../../../src/utils/generateRandomString";
describe("generateRandomString.generateRandomString", () => {
  test("should return string of length 10", () => {
    let result: any = generateRandomString.generateRandomString(10);
    expect(result.length === 10).toBeTruthy();
  });

  test("should return string of length 16", () => {
    let result: any = generateRandomString.generateRandomString(16);
    expect(result.length === 16).toBeTruthy();
  });

  test("should return string of length 64", () => {
    let result: any = generateRandomString.generateRandomString(64);
    expect(result.length === 64).toBeTruthy();
  });

  test("should return string of length 0", () => {
    let result: any = generateRandomString.generateRandomString(0);
    expect(result.length === 0).toBeTruthy();
  });

  test("should return string of length 32", () => {
    let result: any = generateRandomString.generateRandomString(32);
    expect(result.length === 32).toBeTruthy();
  });

  test("should return empty string", () => {
    let result: any = generateRandomString.generateRandomString(Infinity);
    expect(result.length === 0).toBeTruthy();
  });

  test("shpuld return alphanumeric characters only", () => {
    let result: any = generateRandomString.generateRandomString(32);
    expect(result).toMatch(/^[a-zA-Z0-9]+$/);
  });
});
