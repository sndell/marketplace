type Listings = {
  id: string;
  title: string;
  price: number;
  region: string;
  municipality: string;
  subcategory: string;
  images: {
    url: string;
  }[];
}[];

type Listing = {
  id: string;
  title: string;
  price: number;
  region: string;
  municipality: string;
  mainCategory: string;
  subcategory: string;
  createdAt: Date;
  description: string;
  images: {
    url: string;
  }[];
  creator: {
    displayName: string;
    photoURL: string;
    memberSince: string;
  };
};
