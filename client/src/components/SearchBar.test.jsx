import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "./home_search_bar";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";

// Component to observe navigation result
function LocationDisplay() {
    const location = useLocation();
    return <div data-testid="location-display">{location.pathname + location.search}</div>;
}

test("navigates to /search?place=Boston on search submit", async () => {
    render(
        <MemoryRouter initialEntries={["/"]}>
            <Routes>
                <Route path="/" element={<><SearchBar /><LocationDisplay /></>} />
                <Route path="/search" element={<LocationDisplay />} />
            </Routes>
        </MemoryRouter>
    );

    // Simulate typing and submitting
    const input = screen.getByPlaceholderText(/search locations/i);
    const button = screen.getByRole("button", { name: /search/i });

    await userEvent.type(input, "Boston");
    await userEvent.click(button);

    const result = await screen.findByTestId("location-display");
    expect(result).toHaveTextContent("/search?place=Boston");
});
