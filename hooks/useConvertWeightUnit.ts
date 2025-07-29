import { WeightUnit } from "@/enums/weight-unit";
import useUserPreferences from "./useUserPreferences";
import { useEffect, useState } from "react";

const KG_TO_LBS = 2.20462;

export function useConvertWeightUnit() {
  const [getUserPreferences] = useUserPreferences();
  const [preferredWeightUnit, setPreferredWeightUnit] = useState<WeightUnit>(WeightUnit.KG);

  useEffect(() => {
    const { weightUnit } = getUserPreferences();
    setPreferredWeightUnit(weightUnit);
  }, []);

  const convertToUnit = (weight: number, toUnit: WeightUnit): number => {
    if (toUnit === WeightUnit.LBS) {
      return weight * KG_TO_LBS;
    }
    return weight / KG_TO_LBS;
  }

  const convertToPreferredUnit = (weight: number, fromUnit: WeightUnit): number => {
    if (fromUnit === preferredWeightUnit) {
      return weight;
    }
    return fromUnit === WeightUnit.KG ? weight * KG_TO_LBS : weight / KG_TO_LBS;
  };

  return { convertToUnit, convertToPreferredUnit };
}