import { Listings, getListings } from '@/features/listing';

export const revaidate = 30;

export default async function Home() {
  const listings = await getListings();

  return listings ? (
    <div className="max-w-7xl mx-auto p-3">
      <Listings listings={listings} />
    </div>
  ) : (
    <div className="max-w-7xl mx-auto p-3">No listings found</div>
  );
}
