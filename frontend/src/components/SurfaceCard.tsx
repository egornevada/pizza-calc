import type { ReactNode } from "react";
import {
  AppBar, Toolbar, IconButton, Typography, Card, CardContent, Box,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import type { SxProps } from "@mui/system";
import type { Theme } from "@mui/material/styles";

/** Локально настраиваемая карточка */
type Props = {
  title?: ReactNode;
  subtitle?: ReactNode;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
  children: ReactNode;
  sx?: SxProps<Theme>;
  contentSx?: SxProps<Theme>;

  // === TUNE (px)
  radiusPx?: number;          // скругление карточки (24)
  contentPaddingPx?: number;  // отступы внутри (16)
  minWidthPx?: number;        // min-width карточки (328)

  // шапка
  headerHeightPx?: number;    // высота шапки (40)
  headerGuttersPx?: number;   // горизонтальные поля шапки (8)
  headerIconBoxPx?: number;   // ширина слотов под иконки (32)
  headerIconPadPx?: number;   // паддинг IconButton (6)

  // сетка/размеры формы
  qtyWidthXsPx?: number;      // ширина Select «Штук» на xs (96)
  qtyWidthSmPx?: number;      // ширина Select «Штук» на >=sm (140)
  priceQtyGapPx?: number;     // зазор между «цена» и «штук» (12)

  // чипы
  chipsPx?: number;           // горизонтальный паддинг (12)
  chipsPyPx?: number;         // вертикальный паддинг (6)
  chipsRadiusPx?: number;     // скругление (16)
  chipsFontPx?: number;       // шрифт (14)

  colors?: {
    appBarBg?: string;
    appBarFg?: string;
    divider?: string;
    surface?: string;
  };
};

export default function SurfaceCard({
  title,
  subtitle,
  leftAction,
  rightAction,
  children,
  sx,
  contentSx,

  // defaults
  radiusPx = 12,
  contentPaddingPx = 12,
  minWidthPx = 328,

  headerHeightPx = 64,
  headerGuttersPx = 12,
  headerIconBoxPx = 32,
  headerIconPadPx = 6,

  qtyWidthXsPx = 96,
  qtyWidthSmPx = 140,
  priceQtyGapPx = 12,

  chipsPx = 12,
  chipsPyPx = 4,
  chipsRadiusPx = 12,
  chipsFontPx = 14,

  colors,
}: Props) {
  // локальная мини-тема для полей
  const localTheme = createTheme({
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: { borderRadius: Math.max(8, Math.round(radiusPx / 2)) },
        },
      },
      MuiToggleButton: {
        styleOverrides: { root: { borderRadius: 999 } },
      },
    },
  });

  return (
    <ThemeProvider theme={localTheme}>
      <Card
        elevation={2}
        style={{ borderRadius: radiusPx }}
        sx={{
          borderRadius: `${radiusPx}px !important`,
          "&.MuiPaper-rounded": { borderRadius: `12px !important` },
          "& .MuiAppBar-root": {
            borderTopLeftRadius: `${radiusPx}px`,
            borderTopRightRadius: `${radiusPx}px`,
            overflow: "hidden",
          },
          minWidth: `${minWidthPx}px`,
          overflow: "hidden",
          border: (t) => `1px solid ${colors?.divider ?? t.palette.divider}`,
          ...sx,
        }}
      >
        {/* Шапка: плотные отступы и фикс-слоты под иконки */}
        <AppBar
          position="static"
          elevation={0}
          color="transparent"
          sx={(t) => ({
            bgcolor: colors?.appBarBg ?? t.palette.background.paper,
            color:   colors?.appBarFg ?? t.palette.text.primary,
            borderBottom: `1px solid ${colors?.divider ?? t.palette.divider}`,
          })}
        >
          <Toolbar
            variant="dense"
            disableGutters
            sx={{
              minHeight: `${headerHeightPx}px`,
              height: `${headerHeightPx}px`,
              px: `${headerGuttersPx}px`,
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: `${headerIconBoxPx}px 1fr ${headerIconBoxPx}px`,
                width: "100%",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                <IconButton edge="start" size="small" color="inherit" sx={{ p: `${headerIconPadPx}px` }}>
                  {leftAction}
                </IconButton>
              </Box>

              <Box sx={{ textAlign: "center", overflow: "hidden" }}>
                <Typography noWrap sx={{ fontWeight: 700, lineHeight: 1 }}>
                  {title}
                </Typography>
                {subtitle && (
                  <Typography
                    component="div"
                    variant="caption"
                    color="primary.main"         // ← подпись теперь в PRIMARY
                    sx={{ lineHeight: 1 }}
                  >
                    {subtitle}
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <IconButton edge="end" size="small" color="inherit" sx={{ p: `${headerIconPadPx}px` }}>
                  {rightAction}
                </IconButton>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Внутренние стили карточки */}
        <CardContent
          sx={[
            (t: Theme) => ({
              p: `${contentPaddingPx}px`,
              bgcolor: colors?.surface ?? t.palette.background.default,

              // === Ряд "Цена | Штук"
              '& [data-sc-row="price-qty"]': {
                display: "grid",
                gridTemplateColumns: `1fr ${qtyWidthXsPx}px`,
                columnGap: `${priceQtyGapPx}px`,
                alignItems: "start",
                [t.breakpoints.up("sm")]: { gridTemplateColumns: `1fr ${qtyWidthSmPx}px` },
              },

              // === Фикс. ширина Select "Штук"
              "& [data-sc-qty]": {
                width: `${qtyWidthXsPx}px`,
                minWidth: `${qtyWidthXsPx}px`,
                maxWidth: `${qtyWidthXsPx}px`,
                [t.breakpoints.up("sm")]: {
                  width: `${qtyWidthSmPx}px`,
                  minWidth: `${qtyWidthSmPx}px`,
                  maxWidth: `${qtyWidthSmPx}px`,
                },
              },

              // === Чипы — горизонтальный скролл без видимой полосы
              "& [data-sc-chips]": {
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
                whiteSpace: "nowrap",
                paddingBottom: "4px",
                scrollbarWidth: "none" as any,
                msOverflowStyle: "none" as any,
              },
              "& [data-sc-chips]::-webkit-scrollbar": { display: "none" },

              // === ЧИНИМ правила MUI у grouped-кнопок (не даём съедать левую дугу)
              '& [data-sc-chips] .MuiToggleButtonGroup-grouped': {
                margin: '0 !important',
                border: `1px solid ${t.palette.divider} !important`,
                borderRadius: `${chipsRadiusPx}px !important`,
              },
              '& [data-sc-chips] .MuiToggleButtonGroup-grouped:not(:first-of-type)': {
                marginLeft: '8px !important',                    // ← зазор 8px между чипами
                borderLeft: `1px solid ${t.palette.divider} !important`,
                borderRadius: `${chipsRadiusPx}px !important`,
              },

              // === Размеры чипов
              '& [data-sc-chips] .MuiToggleButton-root': {
                paddingLeft: `${chipsPx}px`,
                paddingRight: `${chipsPx}px`,
                paddingTop: `${chipsPyPx}px`,
                paddingBottom: `${chipsPyPx}px`,
                borderRadius: `${chipsRadiusPx}px`,
                fontSize: `${chipsFontPx}px`,
                whiteSpace: 'nowrap',
              },
            }),
            contentSx as any,
          ]}
        >
          {children}
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}