import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, expect, it } from "vitest";
import { PolicyAcceptanceGate } from "./PolicyAcceptanceGate";
import { POLICY_ACCEPTANCE_KEY, createPolicyAcceptance } from "@/lib/legal-policies";

beforeEach(() => localStorage.clear());
afterEach(cleanup);

it("keeps the service unmounted until explicit acceptance", () => {
  render(<PolicyAcceptanceGate><div>Listener service</div></PolicyAcceptanceGate>);
  expect(screen.queryByText("Listener service")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Accept and continue" })).toBeDisabled();
  fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.click(screen.getByRole("button", { name: "Accept and continue" }));
  expect(screen.getByText("Listener service")).toBeInTheDocument();
  expect(localStorage.getItem(POLICY_ACCEPTANCE_KEY)).not.toBeNull();
});

it("restores current acceptance without requiring an account", () => {
  localStorage.setItem(POLICY_ACCEPTANCE_KEY, createPolicyAcceptance());
  render(<PolicyAcceptanceGate><div>Listener service</div></PolicyAcceptanceGate>);
  expect(screen.getByText("Listener service")).toBeInTheDocument();
  expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
});