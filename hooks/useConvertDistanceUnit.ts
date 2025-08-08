import { DistanceUnit } from "@/enums/distance-unit";
import { useEffect, useState } from "react";
import useUserPreferences from "./useUserPreferences";

const KM_TO_MI = 0.621371;

export function useConvertDistanceUnit() {
  const [getUserPreferences] = useUserPreferences();
  const [preferredDistanceUnit, setPreferredDistanceUnit] = useState<DistanceUnit>(DistanceUnit.KM);
  
  useEffect(() => {
    const { distanceUnit } = getUserPreferences();
    setPreferredDistanceUnit(distanceUnit);
  }, []);

  const convertToDistanceUnit = (distance: number, toUnit: DistanceUnit): number => {
    if (toUnit === DistanceUnit.MI) {
      return distance * KM_TO_MI;
    }
    return distance / KM_TO_MI;
  }

  const convertToPreferredDistanceUnit = (distance: number, fromUnit: DistanceUnit): number => {
    if (fromUnit === preferredDistanceUnit) {
      return distance;
    }
    return fromUnit === DistanceUnit.KM ? distance * KM_TO_MI : distance / KM_TO_MI;
  };

  return { convertToDistanceUnit, convertToPreferredDistanceUnit };
}