import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "../../pages/Home";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

// Mock the country service functions
vi.mock("../../services/countryService", () => ({
  getAllCountries: vi.fn(() =>
    Promise.resolve([
      {
        name: { common: "Sri Lanka" },
        region: "Asia",
        cca3: "LKA",
        languages: { sin: "Sinhala" },
      },
      {
        name: { common: "France" },
        region: "Europe",
        cca3: "FRA",
        languages: { fra: "French" },
      },
    ])
  ),
  searchCountriesByName: vi.fn((query) =>
    Promise.resolve([
      {
        name: { common: "Sri Lanka" },
        region: "Asia",
        cca3: "LKA",
        languages: { sin: "Sinhala" },
      },
    ])
  ),
  filterCountriesByRegion: vi.fn(), // Not used in this test
}));

describe("Search feature", () => {
  it("filters countries by name when user types in the search input", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Wait for initial countries to load
    await screen.findByText("Sri Lanka");
    await screen.findByText("France");

    // Type "Sri" into the search bar
    const searchInput = screen.getByPlaceholderText("Search by name");
    fireEvent.change(searchInput, { target: { value: "Sri" } });

    // Wait for updated results
    await waitFor(() => {
      expect(screen.getByText("Sri Lanka")).toBeInTheDocument();
      expect(screen.queryByText("France")).not.toBeInTheDocument();
    });
  });
});
