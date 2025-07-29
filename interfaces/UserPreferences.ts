export default interface UserPreferences {
    weightUnit: WeightUnit;
    colourScheme: 'light' | 'dark' | 'system';
    defaultRestTimerDurationSeconds: number;
}