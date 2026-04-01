import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Providers } from "@/components/providers";

vi.mock("@tanstack/react-query-devtools", () => ({
  ReactQueryDevtools: () => null,
}));

describe("Providers", () => {
  it("renders children", () => {
    render(
      <Providers>
        <span data-testid="child">hello</span>
      </Providers>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});
