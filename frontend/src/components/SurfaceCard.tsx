import type { ReactNode } from "react";

type Props = {
  title?: ReactNode;
  subtitle?: ReactNode;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
  children: ReactNode;
  surfaceColor?: string;
};

export default function SurfaceCard({
  title,
  subtitle,
  leftAction,
  rightAction,
  children,
  surfaceColor,
}: Props) {
  return (
    <div style={{
      borderRadius: 12,
      overflow: "hidden",
      border: "1px solid var(--stroke-1)",
      boxShadow: "var(--shadow-card)",
    }}>
      {/* Header */}
      <div style={{
        background: "var(--bg-1)",
        borderBottom: "1px solid var(--stroke-1)",
        height: 64,
        padding: "0 12px",
        display: "grid",
        gridTemplateColumns: "32px 1fr 32px",
        alignItems: "center",
      }}>
        <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
          {leftAction}
        </div>

        <div style={{ textAlign: "center", overflow: "hidden" }}>
          <div style={{
            fontWeight: 700,
            fontSize: 16,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: "var(--fg-1)",
            fontFamily: "inherit",
          }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: 12, color: "var(--fg-brand)", lineHeight: 1, marginTop: 2, fontFamily: "inherit" }}>
              {subtitle}
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
          {rightAction}
        </div>
      </div>

      {/* Content */}
      <div style={{
        padding: 16,
        background: surfaceColor ?? "var(--bg-2)",
      }}>
        {children}
      </div>
    </div>
  );
}
