import { useState } from "react";
import { Text, View } from "react-native";
import WheelPicker from "../WheelPicker";


const MINUTE_OPTIONS = [...Array(11).keys()].map(x => String(x).padStart(2, '0'));
const SECOND_OPTIONS = [...Array(60).keys()].map(x => String(x).padStart(2, '0'));

export type EditableTimerProps = {
  initialTimeInSeconds?: number;
  onTimeChanged?: (totalSeconds: number) => void;
};

export function EditableTimer({ initialTimeInSeconds, onTimeChanged }: EditableTimerProps) {
  const [minutes, setMinutes] = useState<string>(MINUTE_OPTIONS[0]);
  const [seconds, setSeconds] = useState<string>(SECOND_OPTIONS[0]);

  const handleMinutesChanged = (newMinutesString: string) => {
    const totalSeconds = parseInt(newMinutesString) * 60 + parseInt(seconds);
    setMinutes(newMinutesString);

    if (onTimeChanged) {
      onTimeChanged(totalSeconds);
    }
  }

  const handleSecondsChanged = (newSecondsString: string) => {
    const totalSeconds = parseInt(minutes) * 60 + parseInt(newSecondsString);
    setSeconds(newSecondsString);

    if (onTimeChanged) {
      onTimeChanged(totalSeconds);
    }
  }

  const getStartAtIndexMinutes = () => {
    if (initialTimeInSeconds === undefined) {
      return undefined;
    }

    const initialMinutesIndex = Math.floor(initialTimeInSeconds / 60);
    return initialMinutesIndex;
  }

  const getStartAtIndexSeconds = () => {
    
    if (initialTimeInSeconds === undefined) {
      return undefined;
    }
    
    const initialSecondsIndex = initialTimeInSeconds % 60;
    return initialSecondsIndex;
  }

  return (
    <View className="flex-row justify-center items-center gap-2">
      <WheelPicker data={MINUTE_OPTIONS} startAtIndex={getStartAtIndexMinutes()} onItemSelected={handleMinutesChanged} rowHeight={48} rowsVisible={3} />
      <Text className="text-txt-primary font-semibold text-4xl">:</Text>
      <WheelPicker data={SECOND_OPTIONS} startAtIndex={getStartAtIndexSeconds()} onItemSelected={handleSecondsChanged} rowHeight={48} rowsVisible={3} />
    </View>
  );
}
