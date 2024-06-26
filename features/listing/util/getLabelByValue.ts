import { regions, municipalities } from '../data/categoriesAndLocations';

export const getRegionLabelByValue = (value: string) => regions.find((region) => region.value === value)?.label;
export const getMunicipalityLabelByValue = (value: string) =>
  municipalities.find((municipality) => municipality.value === value)?.label;
