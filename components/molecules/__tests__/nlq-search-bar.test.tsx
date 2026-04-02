import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NlqSearchBar } from "../nlq-search-bar";

const SUGGESTED_QUERIES = [
  "Tankers this week",
  "Vessels faster than 15 knots",
  "Largest ships in port",
  "Cargo vessels heading to Antwerp",
];

describe("NlqSearchBar", () => {
  it("renders input and submit button", () => {
    render(<NlqSearchBar onSubmit={vi.fn()} isLoading={false} />);
    expect(
      screen.getByPlaceholderText("Ask a question about port activity…"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("renders all suggested query chips", () => {
    render(<NlqSearchBar onSubmit={vi.fn()} isLoading={false} />);
    for (const query of SUGGESTED_QUERIES) {
      expect(screen.getByRole("button", { name: query })).toBeInTheDocument();
    }
  });

  it("populates input when chip is clicked", async () => {
    render(<NlqSearchBar onSubmit={vi.fn()} isLoading={false} />);
    await userEvent.click(
      screen.getByRole("button", { name: "Tankers this week" }),
    );
    expect(
      screen.getByPlaceholderText("Ask a question about port activity…"),
    ).toHaveValue("Tankers this week");
  });

  it("calls onSubmit with query on form submit", async () => {
    const onSubmit = vi.fn();
    render(<NlqSearchBar onSubmit={onSubmit} isLoading={false} />);
    const input = screen.getByPlaceholderText(
      "Ask a question about port activity…",
    );
    await userEvent.type(input, "show all tankers");
    await userEvent.click(screen.getByRole("button", { name: /search/i }));
    expect(onSubmit).toHaveBeenCalledWith("show all tankers");
  });

  it("calls onSubmit on Enter key press", async () => {
    const onSubmit = vi.fn();
    render(<NlqSearchBar onSubmit={onSubmit} isLoading={false} />);
    const input = screen.getByPlaceholderText(
      "Ask a question about port activity…",
    );
    await userEvent.type(input, "show all tankers{Enter}");
    expect(onSubmit).toHaveBeenCalledWith("show all tankers");
  });

  it("disables submit button when input is empty", () => {
    render(<NlqSearchBar onSubmit={vi.fn()} isLoading={false} />);
    expect(screen.getByRole("button", { name: /search/i })).toBeDisabled();
  });

  it("disables submit button when loading", async () => {
    render(<NlqSearchBar onSubmit={vi.fn()} isLoading={true} />);
    expect(screen.getByRole("button", { name: /search/i })).toBeDisabled();
  });

  it("does not submit empty query", async () => {
    const onSubmit = vi.fn();
    render(<NlqSearchBar onSubmit={onSubmit} isLoading={false} />);
    await userEvent.click(screen.getByRole("button", { name: /search/i }));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
