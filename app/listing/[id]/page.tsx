import { ListingImages, getListingById } from '@/features/listing';
import {
  getMainCategoryLabelByValue,
  getMunicipalityLabelByValue,
  getRegionLabelByValue,
  getSubcategoryLabelByValue,
} from '@/features/listing/util/getLabelByValue';
import { getPriceString } from '@/util/getPriceString';

export const revalidate = false;

export default async function Listing({ params }: { params: { id: string } }) {
  const listing = await getListingById(params.id);

  if (!listing) return <div className="text-center">Listing not found</div>;

  return (
    <div className="grid grid-cols-2 p-3 mx-auto max-w-7xl gap-2">
      <div className="space-y-2">
        <ListingImages images={listing.images} />
        <div className="flex gap-3">
          <span className="text-sm flex items-center gap-1">
            <span className="icon-[solar--map-point-linear]" />
            {getRegionLabelByValue(listing.region)}, {getMunicipalityLabelByValue(listing.municipality)}
          </span>
          <span className="text-sm flex items-center gap-1">
            <span className="icon-[solar--filters-linear]" />
            {getMainCategoryLabelByValue(listing.mainCategory)}, {getSubcategoryLabelByValue(listing.subcategory)}
          </span>
          <span className="text-sm flex items-center gap-1">
            <span className="icon-[solar--clock-circle-linear]" />
            {listing.createdAt.toDateString()}
          </span>
        </div>
      </div>
      {/* <div >{listing.description}</div> */}
      <div className="space-y-2">
        <div className="text-2xl">{listing.title}</div>
        <div className="text-2xl font-bold">{getPriceString(listing.price)}</div>
        <div className="whitespace-pre-wrap">
          <div className="font-bold">Beskrivning</div>
          {listing.description}
        </div>
      </div>
    </div>
  );
}
