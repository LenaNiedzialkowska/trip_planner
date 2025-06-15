// __tests__/dateUtils.test.ts
import { calculateNumberOfNights } from "../pages/trips/dateUtils.ts";

describe("calculateNumberOfNights", () => {
  it("returns correct number of nights between two dates", () => {
    const start = new Date("2024-06-01");
    const end = new Date("2024-06-05");
    expect(calculateNumberOfNights(start, end)).toBe(4);
  });

  it("returns 0 when end date is the same as start date", () => {
    const start = new Date("2024-06-01");
    const end = new Date("2024-06-01");
    expect(calculateNumberOfNights(start, end)).toBe(0);
  });

  it("returns 0 when end date is before start date", () => {
    const start = new Date("2024-06-05");
    const end = new Date("2024-06-01");
    expect(calculateNumberOfNights(start, end)).toBe(0);
  });
});
