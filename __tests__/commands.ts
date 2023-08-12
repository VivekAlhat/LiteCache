import { echo } from "../src/commands";

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
