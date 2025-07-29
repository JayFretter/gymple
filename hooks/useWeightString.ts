import { WeightUnit } from "@/enums/weight-unit";
import { useConvertWeightUnit } from "./useConvertWeightUnit";
import useUserPreferences from "./useUserPreferences";
import { useEffect, useState } from "react";

const KG_TO_LBS = 2.20462;

export function useWeightString() {
  const [getUserPreferences] = useUserPreferences();
  const [preferredWeightUnit, setPreferredWeightUnit] = useState<WeightUnit>(WeightUnit.KG);

  useEffect(() => {
    const { weightUnit } = getUserPreferences();
    setPreferredWeightUnit(weightUnit);
  }, []);

  const roundHalf = (num: number) => {
    return Math.round(num * 2) / 2;
  }

  const convertToPreferredUnit = (weight: number, fromUnit: WeightUnit): number => {
    if (fromUnit === preferredWeightUnit) {
      return weight;
    }
    return fromUnit === WeightUnit.KG ? weight * KG_TO_LBS : weight / KG_TO_LBS;
  };

  const formatWeight = (weight: number, unit: WeightUnit): string => {
    const roundedWeight = roundHalf(weight);

    if (unit === WeightUnit.KG) {
      return `${roundedWeight} kg`;
    } else {
      return `${roundedWeight} lbs`;
    }
  }

  const convertToPreferredUnitString = (weight: number, fromUnit: WeightUnit): string => {
    const convertedWeight = convertToPreferredUnit(weight, fromUnit);
    return formatWeight(convertedWeight, preferredWeightUnit);
  };

  return { formatWeight, convertToPreferredUnitString };
}