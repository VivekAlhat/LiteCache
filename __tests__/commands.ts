import { sub } from "date-fns";
import { echo, get, remove } from "../src/commands";

describe("echo", () => {
  test("echo returns arguments", () => {
    const data = ["hello", "world"];
    const actual = echo(data);
    expect(actual).toContain("hello");
  });

  test("echo throws error", () => {
    const data: any[] = [];
    expect(() => echo(data)).toThrowError(
      /expected at least 1 argument, received 0/
    );
  });
});

describe("set", () => {
  test("stores data in map", () => {
    const db = new Map<string, string>();
    db.set("Key", "Value");
    expect(db.has("Key")).toEqual(true);
  });
});

describe("get", () => {
  test("returns value by key", () => {
    const db = new Map<string, string>();
    db.set("Key", "Value");
    expect(db.get("Key")).toMatch("Value");
  });

  test("retuns nil if key has expired", () => {
    const db = new Map<string, string>();
    db.set("Key", "Value");

    const expiry = new Map<string, Date>();
    const expiredDate = sub(new Date(), { days: 1 });
    expiry.set("Key", expiredDate);

    const actual = get(db, expiry, "Key");
    expect(actual).toMatch(/Nil/);
  });
});

describe("delete", () => {
  test("deletes given key from store", () => {
    const db = new Map<string, string>();
    db.set("Key", "Value");
    const actual = remove(db, "Key");
    expect(db.has("Key")).toBe(false);
  });
});
