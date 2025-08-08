import { vars } from "nativewind";

export const themeColoursExperimental = {
  light: {
    "--color-primary": "#E2E0FF",
    "--color-card": "#e5e7ed",
    "--color-tertiary": "#ccced3",
    "--color-txt-primary": "#1c1d1f",
    "--color-txt-secondary": "#5f6368",
    "--color-txt-tertiary": "#6f7378",
    "--color-highlight": "#2a53b5",
    "--color-highlight-subtle": "#0000ff",
    "--color-navbar": "#FFFFFF",
  },
  dark: {
    "--color-primary": "#100F1E",
    "--color-card": "#212036",
    "--color-tertiary": "#313047",
    "--color-txt-primary": "#FFFFFF",
    "--color-txt-secondary": "#AAAAAA",
    "--color-txt-tertiary": "#555555",
    "--color-highlight": "#2a53b5",
    "--color-highlight-subtle": "#0000ff",
    "--color-navbar": "#000000",
  }
};

export const themeColours = {
  light: {
    "--color-primary": "#FAFAFA",
    "--color-card": "#e5e7ed",
    "--color-tertiary": "#ccced3",
    "--color-txt-primary": "#1c1d1f",
    "--color-txt-secondary": "#5f6368",
    "--color-txt-tertiary": "#6f7378",
    "--color-highlight": "#2a53b5",
    "--color-highlight-subtle": "#0000ff",
    "--color-navbar": "#FFFFFF",
  },
  dark: {
    "--color-primary": "#0C0C0C",
    "--color-card": "#181818",
    "--color-tertiary": "#282828",
    "--color-txt-primary": "#FFFFFF",
    "--color-txt-secondary": "#AAAAAA",
    "--color-txt-tertiary": "#555555",
    "--color-highlight": "#2a53b5",
    "--color-highlight-subtle": "#0000ff",
    "--color-navbar": "#000000",
  },
};

export const themes = {
  light: vars(themeColoursExperimental.light),
  dark: vars(themeColoursExperimental.dark),
};
