import { describe, expect, it } from "vitest";
import { scheduleWeek } from "./schedule-week";

describe("daily schedule week", () => {
  it("shows exactly seven days starting today across month boundaries", () => {
    const days = scheduleWeek(new Date(2026, 9, 29, 18, 30));
    expect(days.map((day) => [day.getMonth() + 1, day.getDate()])).toEqual([
      [10, 29], [10, 30], [10, 31], [11, 1], [11, 2], [11, 3], [11, 4],
    ]);
  });
});