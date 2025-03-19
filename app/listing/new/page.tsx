import { NotLoggedInMessage } from "@/features/auth";
import { ListingForm } from "@/features/listing";
import { validateRequest } from "@/lib/auth";

export default async function New() {
  const { user } = await validateRequest();
  if (!user) return <NotLoggedInMessage />;
  return <ListingForm />;
}
