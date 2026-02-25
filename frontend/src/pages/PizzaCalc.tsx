import { useMemo, useState } from "react";
import { TextField, Button } from "folder-ds";
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
  const [qtyStr, setQtyStr] = useState(String(value.qty));

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

  return (
    <SurfaceCard
      title={name}
      subtitle={isBest ? "Лучший выбор" : undefined}
      leftAction={
        isBest
          ? <CheckCircleIcon fontSize="small" style={{ color: "var(--fg-brand)" }} />
          : <LocalPizzaOutlinedIcon fontSize="small" style={{ color: "var(--fg-disabled)" }} />
      }
      rightAction={
        <button
          onClick={onRemove}
          type="button"
          style={{
            background: "none", border: "none", cursor: "pointer",
            padding: 4, display: "flex", alignItems: "center", color: "var(--fg-2)",
          }}
        >
          <DeleteOutlineIcon fontSize="small" />
        </button>
      }
      surfaceColor={isBest ? "var(--g-green-50)" : undefined}
    >
      {/* Цена | Штук */}
      <div className="price-qty-row">
        <TextField
          label="Цена за 1 шт."
          value={value.price}
          placeholder="₽"
          inputMode="decimal"
          onChange={(v) => onChange({ price: sanitize(v) })}
        />
        <TextField
          label="Штук"
          value={qtyStr}
          inputMode="numeric"
          onChange={(v) => {
            const clean = v.replace(/\D/g, "");
            setQtyStr(clean);
            const n = parseInt(clean);
            if (Number.isFinite(n) && n >= 1 && n <= 10) onChange({ qty: n });
          }}
          onBlur={() => {
            const n = parseInt(qtyStr);
            const clamped = Number.isFinite(n) && n >= 1 ? Math.min(10, n) : value.qty;
            setQtyStr(String(clamped));
            if (clamped !== value.qty) onChange({ qty: clamped });
          }}
        />
      </div>

      {/* Диаметр */}
      <div style={{ marginTop: 12 }}>
        <TextField
          label="Диаметр"
          value={value.diameter}
          placeholder="см"
          inputMode="decimal"
          onChange={(v) => onChange({ diameter: sanitize(v) })}
        />
      </div>

      {/* Чипы */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginTop: 10, scrollbarWidth: "none" }}>
        {sizeOptions.map((s) => (
          <Button
            key={s}
            type="button"
            priority={diamN === s ? "primary" : "inverted"}
            tone="default"
            size="S"
            style={{ flexShrink: 0 }}
            onClick={() => onChange({ diameter: String(s) })}
          >
            {s} см
          </Button>
        ))}
      </div>

      <hr className="divider" />

      {/* Итоги */}
      <div>
        <Stat label="Площадь одной:" value={Number.isFinite(areaOne) ? `${areaOne.toFixed(2)} см²` : "—"} />
        <Stat label="Площадь всего:" value={Number.isFinite(areaAll) ? `${areaAll.toFixed(2)} см²` : "—"} />
        <Stat label="₽ за 1 см²"     value={Number.isFinite(pricePerCm2) ? `${pricePerCm2.toFixed(2)} ₽` : "—"} />
        <Stat label="см² за 100₽"    value={Number.isFinite(cm2For100) ? `${cm2For100.toFixed(2)} см²` : "—"} />
      </div>
    </SurfaceCard>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-row">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  );
}
