import { useMemo } from "react";
import {
  Box, Divider, FormControl, InputLabel, MenuItem, Select,
  TextField, Typography, ToggleButton, ToggleButtonGroup,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { alpha, useTheme } from "@mui/material/styles";

import SurfaceCard from "../components/SurfaceCard";
import LocalPizzaOutlinedIcon from "@mui/icons-material/LocalPizzaOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export type PizzaCardValue = { price: string; qty: number; diameter: string; };

type Props = {
  name: string;
  isBest: boolean;
  value: PizzaCardValue;
  onChange: (patch: Partial<PizzaCardValue>) => void;
  onRemove: () => void;
  sizeOptions?: number[];
};

const sanitize = (s: string) => {
  const t = s.replace(",", ".").replace(/[^0-9.]/g, "");
  const parts = t.split(".");
  return parts.length <= 2 ? t : `${parts[0]}.${parts.slice(1).join("")}`;
};
const toNum = (v: string | number) => {
  const n = typeof v === "number" ? v : parseFloat(v);
  return Number.isFinite(n) ? n : NaN;
};

export default function PizzaCalc({
  name, isBest, value, onChange, onRemove, sizeOptions = [25, 30, 35, 40],
}: Props) {
  const theme = useTheme();

  const priceN = toNum(value.price);
  const diamN  = toNum(value.diameter);
  const areaOne = useMemo(() => (Number.isFinite(diamN) ? Math.PI * Math.pow(diamN / 2, 2) : NaN), [diamN]);
  const areaAll = useMemo(() => (Number.isFinite(areaOne) ? areaOne * value.qty : NaN), [areaOne, value.qty]);
  const pricePerCm2 = useMemo(() => (
    Number.isFinite(priceN) && Number.isFinite(areaOne) && areaOne > 0 ? priceN / areaOne : NaN
  ), [priceN, areaOne]);
  const cm2For100 = useMemo(() => (
    Number.isFinite(priceN) && Number.isFinite(areaOne) && priceN > 0 ? (100 / priceN) * areaOne : NaN
  ), [priceN, areaOne]);

  const bestBg = alpha(theme.palette.secondary.main, 0.10);

  return (
    <SurfaceCard
      title={name}
      subtitle={isBest ? "Лучший выбор" : undefined}
      leftAction={isBest ? <CheckCircleIcon fontSize="small" color="primary" /> : <LocalPizzaOutlinedIcon fontSize="small" color="disabled" />}
      rightAction={<DeleteOutlineIcon onClick={onRemove} />}

      radiusPx={24}
      contentPaddingPx={16}
      // всё оформление отдаем в компонент
      colors={{ surface: isBest ? bestBg : undefined }}
    >
      {/* === Ряд "Цена | Штук" — компонент сам применит grid и ширину qty */}
      <Box data-sc-row="price-qty">
        <TextField
          label="Цена одной пиццы"
          value={value.price}
          placeholder="₽"
          inputMode="decimal"
          onChange={(e) => onChange({ price: sanitize(e.target.value) })}
        />

        <FormControl data-sc-qty>
          <InputLabel id="qty-label">Штук</InputLabel>
          <Select<number>
            labelId="qty-label"
            label="Штук"
            value={value.qty}
            onChange={(e: SelectChangeEvent<number>) => onChange({ qty: Number(e.target.value) })}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
              <MenuItem key={v} value={v}>{v}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Диаметр */}
      <Box sx={{ mt: 1.5 }}>
        <TextField
          fullWidth
          label="Диаметр"
          value={value.diameter}
          placeholder="см"
          inputMode="decimal"
          onChange={(e) => onChange({ diameter: sanitize(e.target.value) })}
        />
      </Box>

      {/* Чипы — компонент сам сделает горизонтальный скролл и размеры */}
      <Box data-sc-chips sx={{ mt: 1.25 }}>
        <ToggleButtonGroup
          exclusive
          value={Number.isFinite(diamN) ? diamN : null}
          onChange={(_, v: number | null) => v !== null && onChange({ diameter: String(v) })}
        >
          {sizeOptions.map((s) => (
            <ToggleButton key={s} value={s} aria-label={`${s} см`}>
              {s} см
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <Divider sx={{ my: 1.5 }} />

      {/* Итоги */}
      <Box>
        <Stat label="Площадь одной:" value={Number.isFinite(areaOne) ? `${areaOne.toFixed(2)} см²` : "—"} />
        <Stat label="Площадь всего:" value={Number.isFinite(areaAll) ? `${areaAll.toFixed(2)} см²` : "—"} />
        <Stat label="₽ за 1 см²"     value={Number.isFinite(pricePerCm2) ? `${pricePerCm2.toFixed(2)} ₽` : "—"} />
        <Stat label="см² за 100₽"    value={Number.isFinite(cm2For100) ? `${cm2For100.toFixed(2)} см²` : "—"} />
      </Box>
    </SurfaceCard>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: "flex", gap: "8px", alignItems: "baseline", py: "4px" }}>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>{label}</Typography>
      <Typography variant="body2" fontWeight={700}>{value}</Typography>
    </Box>
  );
}