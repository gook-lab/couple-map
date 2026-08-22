export interface Place {
  id: string;
  coupleId: string;
  kakaoPlaceId: string;
  name: string;
  address: string;
  category: string;
  lat: number;
  lng: number;
  region: string;
  status: "wanted" | "visited";
  memo: string;
  rating: number;
  photos: string[];
  visitedAt: Date[];
  savedAt: Date;
  tags: string[];
}

export interface KakaoPlace {
  id: string;
  place_name: string;
  category_group_name: string;
  category_name: string;
  address_name: string;
  road_address_name: string;
  phone: string;
  place_url: string;
  x: string;
  y: string;
  distance?: string;
}
