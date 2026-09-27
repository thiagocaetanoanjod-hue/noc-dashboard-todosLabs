import React, { useState, useEffect, useRef } from 'react';

const INITIAL_LOGS = [
  { method: "GET", path: "/api/frota/status?region=SP", status: 200, resTime: "12ms" },
  { method: "POST", path: "/api/telemetry/bulk-ingest", status: 200, resTime: "45ms" },
  { method: "GET", path: "/api/links/vsat-d2/health", status: 200, resTime: "582ms" },
  { method: "PUT", path: "/api/frota/v-99412/geofence", status: 200, resTime: "18ms" }
];

export function LogTerminal() {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const terminalEndRef = useRef(null);

  // Efeito para simular a chegada contínua de novos logs
  useEffect(() => {
    const methods = ["GET", "GET", "POST", "POST", "PUT", "DELETE"];
    const paths = [
      "/api/telemetry/sensor-batch",
      "/api/connectivity/bgp-peers",
      "/api/frota/analytics/speed-cluster",
      "/api/carrier/lte/signal-level"
    ];

    const interval = setInterval(() => {
      const method = methods[Math.floor(Math.random() * methods.length)];
      const path = paths[Math.floor(Math.random() * paths.length)];
      const resTime = Math.floor(Math.random() * 45) + 3 + "ms";
      const timeStamp = new Date().toISOString().substring(11, 23);

      const newLog = { timeStamp, method, path, status: 200, resTime };

      setLogs((prev) => [...prev.slice(-49), newLog]); // Mantém no máximo 50 logs
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  // Scroll automático para a última linha
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="log-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
          <span className="font-mono" style={{ fontSize: '0.75rem', color: '#cbd5e1', marginLeft: '0.25rem' }}>
            api-gateway-service: telemetry.stream.ts
          </span>
        </div>
        <button 
          onClick={() => setLogs([])}
          style={{ background: 'none', border: '1px solid #334155', color: '#94a3b8', fontSize: '0.65rem', borderRadius: '4px', padding: '0.15rem 0.4rem', cursor: 'pointer' }}
        >
          Limpar
        </button>
      </div>

      <div className="log-terminal font-mono" style={{ height: '280px', overflowY: 'auto' }}>
        {logs.map((log, index) => {
          const methodClass = log.method === "GET" ? "log-method-get"
            : log.method === "POST" ? "log-method-post"
            : log.method === "PUT" ? "log-method-put"
            : "log-method-del";

          return (
            <div key={index} className="log-entry" style={{ marginBottom: '0.35rem', display: 'flex', gap: '0.5rem', fontSize: '0.75rem' }}>
              <span style={{ color: '#64748b' }}>[{log.timeStamp || "LIVE"}]</span>
              <span className={methodClass}>{log.method}</span>
              <span style={{ color: '#e2e8f0' }}>{log.path}</span>
              <span className="log-status-200">HTTP/1.1 {log.status}</span>
              <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>({log.resTime})</span>
            </div>
          );
        })}
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}