import { useMemo, useState } from "react";
import { Box, Button, Container, Stack } from "@mui/material";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import PizzaCalc, { type PizzaCardValue } from "./pages/PizzaCalc";

type Item = { id: string; name: string; value: PizzaCardValue };

// единственное авто-значение по умолчанию — qty = 1
const initValue: PizzaCardValue = { price: "", qty: 1, diameter: "" };

/** ширины */
const CARD_MIN_WIDTH = 328;  // min ширина карточки
const CARD_SCROLL_W = 360;  // ширина плитки в горизонтальной ленте (>= sm)
const CARD_FULL_MAX = 600;  // max ширина карточки на xs

/** один «шаг» = 16 px */
const GAP = 2; // theme.spacing(2) = 16px

export default function App() {
  const [items, setItems] = useState<Item[]>([
    { id: rid(), name: "Вариант 1", value: initValue },
    { id: rid(), name: "Вариант 2", value: initValue },
  ]);

  // цена за см²
  const perCm2 = useMemo(() => {
    return items.map(({ value }) => {
      const price = parseFloat(String(value.price));
      const diam = parseFloat(String(value.diameter));
      if (!Number.isFinite(price) || !Number.isFinite(diam) || diam <= 0) return NaN;
      const areaOne = Math.PI * Math.pow(diam / 2, 2);
      return price / areaOne;
    });
  }, [items]);

  // лучший вариант
  const bestIndex = useMemo(() => {
    let idx = -1, best = Infinity;
    perCm2.forEach((v, i) => { if (Number.isFinite(v) && v < best) { best = v; idx = i; } });
    return idx;
  }, [perCm2]);

  const addItem = () => setItems((xs) => [...xs, { id: rid(), name: `Вариант ${xs.length + 1}`, value: initValue }]);
  const removeItem = (id: string) =>
    setItems((xs) => {
      if (xs.length <= 1) return xs; // не позволяем удалить последнюю карточку
      const next = xs.filter((x) => x.id !== id);
      return next.map((x, i) => ({ ...x, name: `Вариант ${i + 1}` }));
    });
  const patchItem = (id: string, patch: Partial<PizzaCardValue>) =>
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, value: { ...x.value, ...patch } } : x)));

  return (
    <Box sx={{ minHeight: "100svh", bgcolor: "background.default", py: GAP }}>
      {/* полноширинный контейнер; гаттеры вернём локально */}
      <Container maxWidth={false} disableGutters>
        {/* расстояние между лентой и кнопкой = 16px */}
        <Stack spacing={GAP}>
          {/* === ЛЕНТА КАРТОЧЕК === */}
          <Box
            sx={(t) => ({
              display: "flex",
              flexDirection: "column",
              rowGap: t.spacing(GAP),  // вертикальные интервалы между карточками на xs = 16px
              px: GAP,                 // по 16px слева/справа

              [t.breakpoints.up("sm")]: {
                flexDirection: "row",
                flexWrap: "nowrap",
                overflowX: "auto",
                overflowY: "visible",
                columnGap: t.spacing(GAP), // горизонтальные интервалы между карточками = 16px
                px: GAP,                   // 16px слева/справа
                pt: 1,
                pb: 2,
                mb: "-8px",

                // скрыть полосу прокрутки, скролл оставить
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": { display: "none", height: 0 },
                WebkitOverflowScrolling: "touch",
                overscrollBehaviorX: "contain",
              },
            })}
          >
            {items.map((it, i) => (
              // обёртка управляет шириной плитки
              <Box
                key={it.id}
                sx={(t) => ({
                  // xs: тянемся, но в диапазоне [328..600]
                  width: "100%",
                  minWidth: `${CARD_MIN_WIDTH}px`,
                  maxWidth: `${CARD_FULL_MAX}px`,

                  // sm+: фикс-плитка 360
                  [t.breakpoints.up("sm")]: {
                    flex: "0 0 auto",
                    width: `${CARD_SCROLL_W}px`,
                    minWidth: `${CARD_SCROLL_W}px`,
                    maxWidth: `${CARD_SCROLL_W}px`,
                  },
                })}
              >
                <PizzaCalc
                  name={it.name}
                  isBest={i === bestIndex}
                  value={it.value}
                  onChange={(p) => patchItem(it.id, p)}
                  onRemove={() => { if (items.length > 1) removeItem(it.id); }}
                />
              </Box>
            ))}
          </Box>

          {/* === КНОПКА СНИЗУ === */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: { xs: "center", sm: "flex-start" },
              px: { xs: GAP, sm: GAP },  // по 16px слева/справа
            }}
          >
            <Button
              onClick={addItem}
              variant="contained"
              startIcon={<AddCircleOutline />}

              // ← инлайн-style выигрывает у любых CSS с !important
              style={{ borderRadius: 12 }}

              // а sx оставим на случай, если style потом убёшь
              sx={(t) => ({
                borderRadius: "12px !important",
                height: 44,
                textTransform: "none",
                width: "100%",
                maxWidth: "600px",
                [t.breakpoints.up("sm")]: {
                  width: "360px",
                  minWidth: "360px",
                  maxWidth: "360px",
                },
              })}
            >
              Добавить вариант
            </Button>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

function rid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}