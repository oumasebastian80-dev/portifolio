function LogoShape({ className, style }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="1" y="1" width="46" height="46" rx="13" />
      <path d="M35 12H17a7 7 0 0 0-7 7v3a7 7 0 0 0 7 7h14v4H10v7h21a7 7 0 0 0 7-7v-4a7 7 0 0 0-7-7H17v-3h18z" />
    </svg>
  );
}

export function Mark() {
  return <LogoShape className="mark" />;
}

export default function Logo3D({ size = 'default' }) {
  const layers = Array.from({ length: 14 }, (_, index) => {
    const depth = index + 1;
    return (
      <LogoShape
        key={depth}
        style={{
          '--depth': depth,
          '--l': depth / 14,
          transform: 'translateZ(calc(var(--gap) * var(--depth)))',
        }}
      />
    );
  });

  return (
    <div className={`logo3d${size === 'lg' ? ' logo3d-lg' : ''}`} aria-hidden="true">
      <div className="logo3d-stage">
        {layers}
        <LogoShape style={{ '--l': 1 }} />
      </div>
      <span className="ring" />
      <span className="ring r2" />
    </div>
  );
}
