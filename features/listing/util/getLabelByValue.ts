import { regions, municipalities, subcategories, mainCategories } from '../data/categoriesAndLocations';

export const getRegionLabelByValue = (value: string) => {
  return regions.find((region) => region.value === value)?.label;
};

export const getMunicipalityLabelByValue = (value: string) => {
  return municipalities.find((municipality) => municipality.value === value)?.label;
};

export const getMainCategoryLabelByValue = (value: string) => {
  return mainCategories.find((category) => category.value === value)?.label;
};

export const getSubcategoryLabelByValue = (value: string) => {
  return subcategories.find((category) => category.value === value)?.label;
};
