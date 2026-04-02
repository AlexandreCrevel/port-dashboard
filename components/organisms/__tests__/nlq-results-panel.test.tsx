import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NlqResultsPanel } from "../nlq-results-panel";
import type { NlqResponse } from "@/types";

const mockSetHighlightedMmsis = vi.fn();

vi.mock("@/stores/use-map-store", () => ({
  useMapStore: (
    selector: (state: {
      setHighlightedMmsis: typeof mockSetHighlightedMmsis;
    }) => unknown,
  ) => selector({ setHighlightedMmsis: mockSetHighlightedMmsis }),
}));

const MOCK_RESPONSE: NlqResponse = {
  sql: "SELECT name, mmsi FROM vessels WHERE type = 'Tanker'",
  results: [
    { name: "Atlantic Star", mmsi: "123456789" },
    { name: "Pacific Wave", mmsi: "987654321" },
  ],
  explanation: "Found 2 tanker vessels currently in the port area.",
};

describe("NlqResultsPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading skeleton when isLoading is true", () => {
    render(<NlqResultsPanel data={undefined} isLoading={true} error={null} />);
    expect(screen.getByText("Querying port data…")).toBeInTheDocument();
  });

  it("renders error message when error is provided", () => {
    render(
      <NlqResultsPanel
        data={undefined}
        isLoading={false}
        error={new Error("Invalid query")}
      />,
    );
    expect(screen.getByText(/Invalid query/)).toBeInTheDocument();
  });

  it("renders nothing when no data, no loading, no error", () => {
    const { container } = render(
      <NlqResultsPanel data={undefined} isLoading={false} error={null} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders explanation text", () => {
    render(
      <NlqResultsPanel data={MOCK_RESPONSE} isLoading={false} error={null} />,
    );
    expect(
      screen.getByText("Found 2 tanker vessels currently in the port area."),
    ).toBeInTheDocument();
  });

  it("renders results table with column headers", () => {
    render(
      <NlqResultsPanel data={MOCK_RESPONSE} isLoading={false} error={null} />,
    );
    expect(screen.getByText("name")).toBeInTheDocument();
    expect(screen.getByText("mmsi")).toBeInTheDocument();
    expect(screen.getByText("Atlantic Star")).toBeInTheDocument();
    expect(screen.getByText("Pacific Wave")).toBeInTheDocument();
  });

  it("renders collapsible SQL block", async () => {
    render(
      <NlqResultsPanel data={MOCK_RESPONSE} isLoading={false} error={null} />,
    );
    const toggle = screen.getByRole("button", { name: /sql/i });
    await userEvent.click(toggle);
    expect(
      screen.getByText(/SELECT name, mmsi FROM vessels/),
    ).toBeInTheDocument();
  });

  it("highlights vessels on map when results contain mmsi", () => {
    render(
      <NlqResultsPanel data={MOCK_RESPONSE} isLoading={false} error={null} />,
    );
    expect(mockSetHighlightedMmsis).toHaveBeenCalledWith([
      "123456789",
      "987654321",
    ]);
  });

  it("clears highlighted vessels when data becomes undefined", () => {
    const { rerender } = render(
      <NlqResultsPanel data={MOCK_RESPONSE} isLoading={false} error={null} />,
    );
    rerender(
      <NlqResultsPanel data={undefined} isLoading={false} error={null} />,
    );
    expect(mockSetHighlightedMmsis).toHaveBeenLastCalledWith([]);
  });

  it("shows result count", () => {
    render(
      <NlqResultsPanel data={MOCK_RESPONSE} isLoading={false} error={null} />,
    );
    expect(screen.getByText(/2 results/i)).toBeInTheDocument();
  });
});
