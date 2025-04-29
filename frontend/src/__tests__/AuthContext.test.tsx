import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { vi } from "vitest";

// Mock login and logout for demonstration
const mockLogin = vi.fn(async () => {
    return { name: "Test User", email: "test@example.com" };
  });
  const mockLogout = vi.fn();
  
  vi.mock("../contexts/AuthContext", async (importOriginal)  => {
    const actual = (await importOriginal()) as Record<string, any>;
    return {
      ...actual,
      useAuth: () => ({
        isAuthenticated: false,
        user: null,
        login: mockLogin,
        logout: mockLogout,
      }),
    };
  });

function TestComponent() {
  const { isAuthenticated, user, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="auth">{isAuthenticated ? "yes" : "no"}</span>
      <span data-testid="user">{user ? user.name : "none"}</span>
      <button onClick={() => login("test@example.com", "password")}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe("AuthProvider provides authentication context", async () => {
    it("should simulate login and logout", async () => {
  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );

  expect(screen.getByTestId("auth").textContent).toBe("no");
  expect(screen.getByTestId("user").textContent).toBe("none");

     // Simulate login
     await act(async () => {
        fireEvent.click(screen.getByText("Login"));
      });
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password");
  
      // Simulate logout
      act(() => {
        fireEvent.click(screen.getByText("Logout"));
      });
      expect(mockLogout).toHaveBeenCalled();
    })
});