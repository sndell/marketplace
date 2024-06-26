type Listings = {
  id: string;
  title: string;
  price: number;
  region: string;
  municipality: string;
  images: {
    url: string;
  }[];
}[];
