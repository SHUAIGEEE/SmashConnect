export default interface Court {
  _id: string;
  name: string;
  address: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  googlePlaceId: string;
  phoneNumber: string;
  openingHours: string[];
  googleMapsUri: string;
  websiteUri: string;
  averageRating: number;
  userRatingsTotal: number;
  createdAt: string;
  updatedAt: string;
}
