import { describe, expect, it } from "vitest";
import { scheduleWeek, scheduleApiForDay, entriesStartingOnDay } from "./schedule-week";

describe("daily schedule week", () => {
  it("shows exactly seven days starting today across month boundaries", () => {
    const days = scheduleWeek(new Date(2026, 9, 29, 18, 30));
    expect(days.map((day) => [day.getMonth() + 1, day.getDate()])).toEqual([
      [10, 29], [10, 30], [10, 31], [11, 1], [11, 2], [11, 3], [11, 4],
    ]);
  });
});

describe("scheduleApiForDay", () => {
  it("appends now twelve hours before the day's midnight to an existing query string", () => {
    const url = scheduleApiForDay("https://live.typicalnerds.co.uk/api/station/swarm/schedule?rows=48", new Date(2026, 9, 23));
    expect(url).toBe("https://live.typicalnerds.co.uk/api/station/swarm/schedule?rows=48&now=2026-10-22T12:00:00");
  });

  it("uses a question mark when the base URL has no query string", () => {
    const url = scheduleApiForDay("https://example.com/api/schedule", new Date(2026, 0, 2));
    expect(url).toBe("https://example.com/api/schedule?now=2026-01-01T12:00:00");
  });
});

describe("entriesStartingOnDay", () => {
  it("keeps only entries starting on the requested local day", () => {
    const rows = [
      { start: "2026-10-23T19:00:00Z" },
      { start: "2026-10-24T01:00:00Z" },
      { start: "2026-10-22T23:00:00Z" },
    ];
    const kept = entriesStartingOnDay(rows, new Date(2026, 9, 23));
    expect(kept.map((r) => r.start)).toEqual(["2026-10-23T19:00:00Z"]);
  });
});
