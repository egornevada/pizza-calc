import { createTheme } from "@mui/material/styles";

// централизованные радиусы, чтобы было удобно менять в одном месте
const R_BUTTON = 12;  // кнопки (не pill)
const R_CARD   = 12;  // карточки/контейнеры
const R_INPUT  = 12;  // поля ввода (Outlined)
const R_CHIP   = 16;  // чипы/ToggleButton

export const theme = createTheme({
  // базовый радиус по умолчанию (наследуют многие компоненты)
  shape: { borderRadius: R_BUTTON },

  palette: {
    mode: "light",
    primary:   { main: "#6750A4" },
    secondary: { main: "#2E7D32" }, // «Лучший выбор»
    background:{ default: "#F3F4F6", paper: "#FFFFFF" },
  },

 typography: {
    fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
  },

  components: {
    // Кнопки — гарантируем «не пилюлю»
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: R_BUTTON },
      },
    },

    // Карточки (в т.ч. Paper с variant="elevation")
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: `${R_CARD}px !important` },
      },
    },
    MuiPaper: {
      defaultProps: { square: true },
      styleOverrides: {
        root: { borderRadius: `${R_CARD}px !important` },
      },
    },

    // Поля ввода (Outlined)
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: R_INPUT },
      },
    },

    // Чипы/переключатели размеров
    MuiChip: {
      styleOverrides: { root: { borderRadius: R_CHIP } },
    },
    MuiToggleButton: {
      styleOverrides: { root: { borderRadius: R_CHIP } },
    },

    MuiCssBaseline: {
      styleOverrides: {
        ".MuiPaper-root.MuiCard-root": {
          borderRadius: `${R_CARD}px !important`,
        },
        ".MuiPaper-root.MuiCard-root.MuiPaper-rounded": {
          borderRadius: `${R_CARD}px !important`,
        },
      },
    },
}
});