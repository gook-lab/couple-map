import { describe, it, expect } from "vitest";
import { COUNTRIES, KOREA_REGIONS } from "@/lib/countries";

describe("countries", () => {
  it("should have 5 countries", () => {
    expect(COUNTRIES).toHaveLength(5);
  });

  it("korea should have 17 regions", () => {
    expect(KOREA_REGIONS).toHaveLength(17);
  });

  it("each region should have id, name, x, y", () => {
    KOREA_REGIONS.forEach((r) => {
      expect(r.id).toBeTruthy();
      expect(r.name).toBeTruthy();
      expect(typeof r.x).toBe("number");
      expect(typeof r.y).toBe("number");
    });
  });

  it("region ids should be unique", () => {
    const ids = KOREA_REGIONS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("regions data", () => {
  it("korea should include seoul, busan, jeju", () => {
    const names = KOREA_REGIONS.map((r) => r.name);
    expect(names).toContain("서울");
    expect(names).toContain("부산");
    expect(names).toContain("제주");
  });
});
