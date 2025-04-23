import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Sidebar from "./Sidebar";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";

// Utility to show current path for testing navigation
function LocationDisplay() {
    const location = useLocation();
    return <div data-testid="location-display">{location.pathname}</div>;
}

test("shows Login button when not logged in and navigates to /login", async () => {
    render(
        <MemoryRouter initialEntries={["/"]}>
            <Routes>
                <Route path="/" element={<><Sidebar isLoggedIn={false} /><LocationDisplay /></>} />
                <Route path="/login" element={<LocationDisplay />} />
            </Routes>
        </MemoryRouter>
    );

    const loginButton = screen.getByRole("button", { name: /login/i });
    expect(loginButton).toBeInTheDocument();

    await userEvent.click(loginButton);
    expect(screen.getByTestId("location-display")).toHaveTextContent("/login");
});

test("shows Add Post and Logout when logged in", () => {
    const mockLogout = jest.fn();

    render(
        <MemoryRouter>
            <Sidebar isLoggedIn={true} onLogout={mockLogout} />
        </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: /add post/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
});
