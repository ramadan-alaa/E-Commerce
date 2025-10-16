import { it, expect, describe } from "vitest";
import { formatPrice } from "./prices";

describe("Format price", () => {
  it("formats 1999 cents as $19.99", () => {
    expect(formatPrice(1999)).toBe("$19.99");
  });

  it("displays 2 decimal", () => {
    expect(formatPrice(1090)).toBe("$10.90");
    expect(formatPrice(109)).toBe("$1.09");
  });
});
