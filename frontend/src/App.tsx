import { useMemo, useState } from "react";
import { Button } from "folder-ds";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import PizzaCalc, { type PizzaCardValue } from "./pages/PizzaCalc";

type Item = { id: string; name: string; value: PizzaCardValue };

const initValue: PizzaCardValue = { price: "", qty: 1, diameter: "" };

export default function App() {
  const [items, setItems] = useState<Item[]>([
    { id: rid(), name: "Вариант 1", value: initValue },
    { id: rid(), name: "Вариант 2", value: initValue },
  ]);

  const perCm2 = useMemo(() => {
    return items.map(({ value }) => {
      const price = parseFloat(String(value.price));
      const diam = parseFloat(String(value.diameter));
      if (!Number.isFinite(price) || !Number.isFinite(diam) || diam <= 0) return NaN;
      const areaOne = Math.PI * Math.pow(diam / 2, 2);
      return price / areaOne;
    });
  }, [items]);

  const bestIndex = useMemo(() => {
    let idx = -1, best = Infinity;
    perCm2.forEach((v, i) => { if (Number.isFinite(v) && v < best) { best = v; idx = i; } });
    return idx;
  }, [perCm2]);

  const addItem = () => setItems((xs) => [...xs, { id: rid(), name: `Вариант ${xs.length + 1}`, value: initValue }]);
  const removeItem = (id: string) =>
    setItems((xs) => {
      if (xs.length <= 1) return xs;
      const next = xs.filter((x) => x.id !== id);
      return next.map((x, i) => ({ ...x, name: `Вариант ${i + 1}` }));
    });
  const patchItem = (id: string, patch: Partial<PizzaCardValue>) =>
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, value: { ...x.value, ...patch } } : x)));

  return (
    <div className="app-root">
      <div className="app-stack">
        <div className="card-strip">
          {items.map((it, i) => (
            <div key={it.id} className="card-wrap">
              <PizzaCalc
                name={it.name}
                isBest={i === bestIndex}
                value={it.value}
                onChange={(p) => patchItem(it.id, p)}
                onRemove={() => { if (items.length > 1) removeItem(it.id); }}
              />
            </div>
          ))}
        </div>

        <div className="add-btn-wrap">
          <Button
            onClick={addItem}
            priority="primary"
            leftIcon={<AddCircleOutline />}
            style={{ width: "100%" }}
          >
            Добавить вариант
          </Button>
        </div>
      </div>
    </div>
  );
}

function rid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
