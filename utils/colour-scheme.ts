import { vars } from "nativewind";

export const themeColours = {
  light: {
    "--color-primary": "#FAFAFA",
    "--color-card": "#D7D9E1",
    "--color-tertiary": "#B8BBBF",
    "--color-txt-primary": "#000000",
    "--color-txt-secondary": "#232323",
    "--color-txt-tertiary": "#2F2F2F",
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
  light: vars(themeColours.light),
  dark: vars(themeColours.dark),
};
