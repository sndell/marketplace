import { Listings, getListings } from "@/features/listing";

export const revalidate = 30;

export default async function Home() {
  const listings = await getListings();

  return listings ? (
    <div className="p-3 mx-auto mt-18 max-w-7xl">
      <Listings listings={listings} />
    </div>
  ) : (
    <div className="p-3 mx-auto max-w-7xl">No listings found</div>
  );
}
