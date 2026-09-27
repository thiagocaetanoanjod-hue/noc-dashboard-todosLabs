import React from 'react';

export function SimulationBar({ onToggleAlternated, onDropLink, onRestoreAll }) {
  return (
    <div className="sim-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em' }}>
          Controlo de Simulação:
        </span>
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
          Dispare falhas em cascata para demonstração de resiliência
        </span>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button className="btn-sim" onClick={onToggleAlternated}>
          Alternar Links Alternados
        </button>
        <button className="btn-sim btn-sim-danger" onClick={() => onDropLink(3)}>
          Derrubar Core OSPF (Link 3)
        </button>
        <button className="btn-sim btn-sim-danger" onClick={() => onDropLink(1)}>
          Derrubar VSAT D2 (Link 1)
        </button>
        <button className="btn-sim btn-sim-success" onClick={onRestoreAll}>
          Restaurar Todos (100%)
        </button>
      </div>
    </div>
  );
}