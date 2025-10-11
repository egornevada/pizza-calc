import { createTheme } from "@mui/material/styles";

const css = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export function createThemeFromCssVars() {
  const primary    = css("--md-sys-color-primary");
  const secondary  = css("--md-sys-color-secondary");
  const error      = css("--md-sys-color-error");
  const surface    = css("--md-sys-color-surface");
  const background = css("--md-sys-color-background");
  const onSurface  = css("--md-sys-color-on-surface");
  const onSurfaceVar = css("--md-sys-color-on-surface-variant");

  return createTheme({
    shape: { borderRadius: 12 },
    palette: {
      mode: "light",
      primary:   { main: primary    || "#335CA8" },   // берём ИЗ CSS, иначе синий
      secondary: { main: secondary  || "#2E7D32" },
      error:     { main: error      || "#B3261E" },
      background:{ default: background || "#F3F4F6", paper: surface || "#FFFFFF" },
      text: { primary: onSurface || "#1C1B1F", secondary: onSurfaceVar || "#49454F" },
    },
    typography: { button: { textTransform: "none", fontWeight: 600 } },
  });
}