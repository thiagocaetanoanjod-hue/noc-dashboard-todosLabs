import React from 'react';

export function TelemetryChart({ categories, links }) {
  const maxVal = 10000;
  const height = 195;
  const width = 550;
  const padding = { top: 15, right: 15, bottom: 42, left: 45 };

  return (
    <div className="telemetry-chart-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase' }}>
          Distribuição de Veículos por Categoria
        </span>
        <span className="font-mono" style={{ fontSize: '0.75rem', color: '#10b981' }}>
          CAPACIDADE 100K
        </span>
      </div>

      <div style={{ height: '200px', width: '100%', position: 'relative' }}>
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
          <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="#334155" />
          <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} stroke="#334155" />
          
          {categories.map((cat, i) => {
            const link = links.find(l => l.id === cat.linkId);
            const isUp = link && link.online;
            const currentCount = isUp ? cat.count : 0;

            const barWidth = Math.max(12, (width - padding.left - padding.right) / categories.length - 8);
            const x = padding.left + i * ((width - padding.left - padding.right) / categories.length) + 4;
            const barHeight = (currentCount / maxVal) * (height - padding.top - padding.bottom);
            const y = height - padding.bottom - barHeight;
            const barColor = isUp ? (i % 2 === 0 ? "#2563eb" : "#06b6d4") : "#ef4444";

            return (
              <g key={cat.id}>
                <rect 
                  x={x} 
                  y={y} 
                  width={barWidth} 
                  height={barHeight} 
                  rx="3" 
                  fill={barColor} 
                  opacity={isUp ? 0.9 : 0.4} 
                />
                <text x={x + barWidth / 2} y={y - 4} fill={isUp ? '#cbd5e1' : '#f87171'} fontSize="8" textAnchor="middle" className="font-mono">
                  {isUp ? '10k' : '0k'}
                </text>
                <text 
                  x={x + barWidth / 2} 
                  y={height - padding.bottom + 14} 
                  fill="#94a3b8" 
                  fontSize="8.5" 
                  textAnchor="end" 
                  transform={`rotate(-35, ${x + barWidth / 2}, ${height - padding.bottom + 14})`}
                >
                  {cat.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}