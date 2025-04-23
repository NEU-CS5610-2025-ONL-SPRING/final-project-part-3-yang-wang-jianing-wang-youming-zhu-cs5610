import React from "react";
import { render, screen } from "@testing-library/react";

test("dummy test runs", () => {
    render(<div>Hello test</div>);
    expect(screen.getByText("Hello test")).toBeInTheDocument();
});
