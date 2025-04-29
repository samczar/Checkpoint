// import React from "react";
import '@testing-library/jest-dom';
import { render } from "@testing-library/react";
import { Button } from "../components/ui/button";

test("Button renders with children", () => {
  const { getByText } = render(<Button>Click me</Button>);
  expect(getByText("Click me")).toBeInTheDocument();
});

test("Button supports variant prop", () => {
  const { getByText } = render(<Button variant="destructive">Delete</Button>);
  expect(getByText("Delete")).toBeInTheDocument();
});