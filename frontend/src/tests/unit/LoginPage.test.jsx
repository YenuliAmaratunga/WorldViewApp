import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "../../pages/LoginPage";
import { BrowserRouter } from "react-router-dom";

describe("LoginPage", () => {
  it("renders login form", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    expect(screen.getByRole("heading", { name: "Login to WorldViewApp" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  it("shows password when toggled", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    const toggle = screen.getByText("Show");
    fireEvent.click(toggle);
    expect(screen.getByPlaceholderText("Password").type).toBe("text");
  });
});
