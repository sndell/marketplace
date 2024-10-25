import Image from 'next/image';
import Link from 'next/link';
import { getPriceString } from '@/util/getPriceString';
import { getSubcategoryLabelByValue, getMunicipalityLabelByValue } from '../util/getLabelByValue';

type Props = {
  listings: Listings;
};

export const Listings = ({ listings }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-3 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {listings.map((listing, index) => (
        <Link href={`/listing/${listing.id}`} key={index}>
          <div className="relative w-full overflow-hidden aspect-square rounded-xl group">
            <Image
              src={listing.images[0].url}
              height={200}
              width={200}
              alt="listing image"
              className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-125"
            />
            <div className="absolute inset-0 flex items-end p-3 rounded-xl bg-gradient-to-t from-black/95 to-20%">
              <span className="font-medium drop-shadow-xl text-secondary texts [text-shadow:_-2px_2px_2px_rgba(0,0,0,.6)]">
                {getPriceString(listing.price)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 pt-1 text-sm font-light text-primaryLight">
            {getMunicipalityLabelByValue(listing.municipality)}
            <span className="text-[0.5rem]">•</span>
            {getSubcategoryLabelByValue(listing.subcategory)}
          </div>
          <div className="text-sm font-medium line-clamp-2 overflow-ellipsis">{listing.title}</div>
        </Link>
      ))}
    </div>
  );
};
