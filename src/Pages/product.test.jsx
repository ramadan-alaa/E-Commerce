import { it, expect, describe, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductPage } from "./product";

describe("Product Component", () => {
  it("Desplays product Details Correctly", () => {
    const expectedProduct = {
      id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      image: "images/products/athletic-cotton-socks-6-pairs.jpg",
      name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
      rating: {
        stars: 4.5,
        count: 87,
      },
      priceCents: 1090,
      keywords: ["socks", "sports", "apparel"],
    };

    const fetchCartItems = vi.fn();

    render(
      <ProductPage product={expectedProduct} fetchCartItems={fetchCartItems} />
    );

    expect(
      screen.getByText("Black and Gray Athletic Cotton Socks - 6 Pairs")
    ).toBeInTheDocument();

    expect(screen.getByText("$10.90")).toBeInTheDocument();

    expect(screen.getByText("87")).toBeInTheDocument();

    // expect(screen.getAllByAltText("Product Image")).toHaveLength(1);

    // expect(screen.getByTestId("product-image")).toBeInTheDocument();

    expect(screen.getByTestId("product-image")).toHaveAttribute(
      "src",
      expectedProduct.image
    );
  });
});
