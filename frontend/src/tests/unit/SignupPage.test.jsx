import { render, screen } from "@testing-library/react";
import SignupPage from "../../pages/SignupPage";
import { BrowserRouter } from "react-router-dom";

describe("SignupPage", () => {
  it("renders signup form", () => {
    render(
      <BrowserRouter>
        <SignupPage />
      </BrowserRouter>
    );
    expect(screen.getByRole("heading", { name: "Sign Up" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });
});
