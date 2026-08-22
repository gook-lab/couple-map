export const REGION_NAME_MAP: Record<string, string> = {
  Seoul: "서울특별시",
  Busan: "부산광역시",
  Daegu: "대구광역시",
  Incheon: "인천광역시",
  Gwangju: "광주광역시",
  Daejeon: "대전광역시",
  Ulsan: "울산광역시",
  "Gyeonggi-do": "경기도",
  "Gangwon-do": "강원특별자치도",
  "Chungcheongbuk-do": "충청북도",
  "Chungcheongnam-do": "충청남도",
  "Jeollabuk-do": "전북특별자치도",
  "Jeollanam-do": "전라남도",
  "Gyeongsangbuk-do": "경상북도",
  "Gyeongsangnam-do": "경상남도",
  Jeju: "제주특별자치도",
};

export function getKoreanName(engName: string): string {
  return REGION_NAME_MAP[engName] || engName;
}

export function getVisitCount(
  regionEngName: string,
  regionCounts: Record<string, number>
): number {
  const korName = REGION_NAME_MAP[regionEngName];
  return regionCounts[korName] || regionCounts[regionEngName] || 0;
}
