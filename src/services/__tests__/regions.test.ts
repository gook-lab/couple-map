import { describe, it, expect } from "vitest";
import { REGION_NAME_MAP, getKoreanName, getVisitCount } from "@/lib/regions";

describe("regions", () => {
  it("should map Seoul to 서울특별시", () => {
    expect(getKoreanName("Seoul")).toBe("서울특별시");
  });

  it("should map Jeju to 제주특별자치도", () => {
    expect(getKoreanName("Jeju")).toBe("제주특별자치도");
  });

  it("should return engName if not found", () => {
    expect(getKoreanName("Unknown")).toBe("Unknown");
  });

  it("should count visits by korean name", () => {
    const counts = { "서울특별시": 5, "부산광역시": 3 };
    expect(getVisitCount("Seoul", counts)).toBe(5);
    expect(getVisitCount("Busan", counts)).toBe(3);
    expect(getVisitCount("Daegu", counts)).toBe(0);
  });

  it("should have 16 region mappings", () => {
    expect(Object.keys(REGION_NAME_MAP).length).toBe(16);
  });
});
