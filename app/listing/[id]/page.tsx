import { MessageButton } from "@/features/chat";
import { ListingImages, getListingById } from "@/features/listing";
import { getMunicipalityLabelByValue, getRegionLabelByValue } from "@/features/listing/util/getLabelByValue";
import { getPriceString } from "@/util/getPriceString";
import Image from "next/image";

export const dynamic = "force-static";
export const revalidate = false;

export default async function Listing({ params }: { params: { id: string } }) {
  const listing = await getListingById(params.id);

  if (!listing) {
    return <div className="text-center">Listing not found</div>;
  }

  return (
    <main className="grid min-[816px]:grid-cols-[55%_auto] gap-3 p-3 mx-auto max-w-7xl">
      <ListingImages images={listing.images} />
      <section className="space-y-4">
        <h1 className="text-3xl break-all hitespace-pre-wrap">{listing.title}</h1>

        {/* Price Section */}
        <div>
          <div>Pris</div>
          <div className="text-2xl font-bold">{getPriceString(listing.price)}</div>
        </div>

        {/* Message Button */}
        <MessageButton listingId={listing.id} />

        <div className="w-full h-[1px] bg-secondaryDark" />

        {/* Description */}
        <div className="whitespace-pre-wrap text-primaryLight break-all">{listing.description}</div>

        {/* Location */}
        <span className="flex items-center gap-1 pt-1 text-accent">
          <span className="icon-[solar--point-on-map-linear] text-xl" />
          {getRegionLabelByValue(listing.region)}, {getMunicipalityLabelByValue(listing.municipality)}
        </span>

        <div className="w-full h-[1px] bg-secondaryDark" />

        {/* Creator Profile */}
        <div className="flex gap-2">
          <Image src={listing.creator.photoURL} width={54} height={56} alt="Profile photo" className="rounded-full" />
          <div className="flex flex-col justify-center">
            <div className="flex gap-2">
              <span>{listing.creator.displayName}</span>
            </div>
            <span className="text-sm text-primaryLight">Medlem sedan {listing.creator.memberSince}</span>
          </div>
        </div>
      </section>
    </main>
  );
}
