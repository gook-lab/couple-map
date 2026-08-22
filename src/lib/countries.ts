export interface Country {
  id: string;
  flag: string;
  name: string;
  subdivisionLabel: string;
  totalSubdivisions: number;
}

export const COUNTRIES: Country[] = [
  { id: "korea", flag: "🇰🇷", name: "한국", subdivisionLabel: "시도", totalSubdivisions: 17 },
  { id: "japan", flag: "🇯🇵", name: "일본", subdivisionLabel: "도도부현", totalSubdivisions: 47 },
  { id: "taiwan", flag: "🇹🇼", name: "대만", subdivisionLabel: "현시", totalSubdivisions: 22 },
  { id: "thailand", flag: "🇹🇭", name: "태국", subdivisionLabel: "���", totalSubdivisions: 77 },
  { id: "vietnam", flag: "🇻🇳", name: "베트남", subdivisionLabel: "성", totalSubdivisions: 63 },
];

export const KOREA_REGIONS = [
  { id: "seoul", name: "서울", x: 138, y: 50 },
  { id: "busan", name: "부산", x: 290, y: 305 },
  { id: "daegu", name: "대구", x: 250, y: 215 },
  { id: "incheon", name: "인천", x: 90, y: 70 },
  { id: "gwangju", name: "광주", x: 95, y: 250 },
  { id: "daejeon", name: "대전", x: 175, y: 175 },
  { id: "ulsan", name: "울산", x: 305, y: 250 },
  { id: "sejong", name: "세종", x: 155, y: 155 },
  { id: "gyeonggi", name: "경기", x: 145, y: 75 },
  { id: "gangwon", name: "강원", x: 220, y: 30 },
  { id: "chungbuk", name: "충북", x: 200, y: 130 },
  { id: "chungnam", name: "충남", x: 110, y: 145 },
  { id: "jeonbuk", name: "전북", x: 130, y: 215 },
  { id: "jeonnam", name: "전남", x: 110, y: 290 },
  { id: "gyeongbuk", name: "경북", x: 270, y: 165 },
  { id: "gyeongnam", name: "경남", x: 235, y: 290 },
  { id: "jeju", name: "제주", x: 100, y: 380 },
] as const;

export type KoreaRegionId = (typeof KOREA_REGIONS)[number]["id"];
