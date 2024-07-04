type Listings = {
  id: string;
  title: string;
  price: number;
  region: string;
  municipality: string;
  subcategories: string;
  images: {
    url: string;
  }[];
}[];
