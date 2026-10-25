import { test, expect } from "bun:test";
import { deadlineInput, parseDeadline, remainingTime } from "./deadline";

test("admin deadline uses India time regardless of browser timezone", () => {
  expect(parseDeadline("2026-10-26T23:59")).toBe("2026-10-26T18:29:00.000Z");
  expect(deadlineInput("2026-10-26T18:29:00.000Z")).toBe("2026-10-26T23:59");
});
test("countdown follows the saved deadline, not a fixed closing date", () => {
  const now = Date.parse("2026-10-25T18:29:00Z");
  expect(remainingTime("2026-10-26T18:29:00Z", now).days).toBe(1);
  expect(remainingTime("2026-10-27T18:29:00Z", now).days).toBe(2);
});