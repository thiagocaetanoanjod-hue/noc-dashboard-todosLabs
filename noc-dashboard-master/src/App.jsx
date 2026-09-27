// src/App.jsx
import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Link,
  useLocation,
} from "react-router-dom";
import "./App.css";
import { LinksComunicacao } from "./components/LinksComunicacao";
import { FrotaCategoria } from "./components/FrotaCategoria";
import { StatusCard } from "./components/StatusCard";
import { TelemetryChart } from "./components/TelemetryChart";
import { FleetTable } from "./components/FleetTable";
import { useFleetMonitor } from "./hooks/useFleetMonitor";
const categoriasVeiculos = [
  "Ônibus",
  "Caminhão",
  "Moto",
  "Carro",
  "Caminhonete",
  "Van",
  "SUV",
  "Esportivo",
  "Trator",
  "Ambulância",
];
const rotasDisponiveis = ["/", ...categoriasVeiculos.map((c) => `/frota/${c}`)];
// Componente Wrapper para controlar o Timer de Roteamento Dinâmico
function DashboardRouter() {
  // 1. Estados originais e novos (API)
  const [dados, setDados] = useState({ infraestrutura: [], frota: [], noc: {} });
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const { linksStatus: statusLinks, toggleLink, isCategoryOnline } = useFleetMonitor();
  const navigate = useNavigate();
  const location = useLocation();
  const [tempoRestante, setTempoRestante] = useState(5);

  useEffect(() => {
    let ativo = true;
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const carregarDados = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/dados`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (!ativo) return;
        setDados(data);
        setErro("");
      } catch (error) {
        console.error("Falha ao comunicar com o servidor de banco de dados:", error);
        if (ativo) setErro("Não foi possível atualizar os dados do NOC.");
      } finally {
        if (ativo) setCarregando(false);
      }
    };

    carregarDados();
    const intervalo = setInterval(carregarDados, 30000);
    return () => {
      ativo = false;
      clearInterval(intervalo);
    };
  }, []);

  useEffect(() => {
    if (!dados.frota.length) return;
    const traceId = Math.random().toString(16).slice(2);
    console.log(`[OTel] TraceID: ${traceId} - Atualizando telemetria da frota...`);
  }, [dados.frota]);

  // 3. Mantido: Roteamento Temporizado
  useEffect(() => {
    if (tempoRestante > 0) {
      const timer = setTimeout(() => setTempoRestante(tempoRestante - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      const indiceAtual = rotasDisponiveis.indexOf(
        decodeURIComponent(location.pathname),
      );
      const proximoIndice = (indiceAtual + 1) % rotasDisponiveis.length;
      navigate(rotasDisponiveis[proximoIndice]);
      setTimeout(() => setTempoRestante(5), 0);
    }
  }, [tempoRestante, location.pathname, navigate]);

  // 4. NOVO: Tela de Loading (deve vir após os React Hooks)
  if (carregando) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 text-info bg-black">
        <div
          className="spinner-border"
          style={{ width: "4rem", height: "4rem" }}
        ></div>
      </div>
    );
  }

  const veiculosOffline = dados.frota.filter((veiculo) => !isCategoryOnline(veiculo.tipo)).length;
  const linksOnline = Object.values(statusLinks).filter(Boolean).length;

  // 5. Mantido: Renderização do Layout com a Navbar original e dados dinâmicos
  return (
    <div>
      {erro && <div className="alert alert-warning rounded-0 mb-0 text-center">{erro}</div>}
      <nav className="navbar navbar-dark bg-black bg-opacity-75 shadow-lg border-bottom border-info sticky-top">
        <div className="container-fluid flex-column align-items-start px-3 py-2">
          <div className="d-flex w-100 justify-content-between align-items-center mb-3">
            <span className="navbar-brand fw-bold text-info m-0 d-flex align-items-center">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${dados.noc.latitude},${dados.noc.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Abrir Base NOC (SENAI Vila Leopoldina)"
                className="spinning-globe"
              ></a>
              NOC COMMAND CENTER
            </span>
            <span className="badge bg-transparent border border-info text-info px-3 py-2">
              AUTO-SWAP: 00:0{tempoRestante}
            </span>
          </div>
          <div className="nav-scroll w-100 gap-2">
            <Link
              to="/"
              onClick={() => setTempoRestante(5)}
              className={`btn btn-sm text-nowrap px-4 py-2 ${location.pathname === "/" ? "btn-info text-dark fw-bold shadow" : "btn-outline-info text-white"}`}
            >
              📡 Links Comunicação
            </Link>
            {categoriasVeiculos.map((cat) => {
              const rotaAtiva =
                decodeURIComponent(location.pathname) === `/frota/${cat}`;
              let iconeBotao = "🚚";
              if (cat === "Moto") iconeBotao = "🏍";
              else if (cat === "Carro" || cat === "SUV" || cat === "Esportivo")
                iconeBotao = "🚗";
              else if (cat === "Ônibus" || cat === "Van") iconeBotao = "🚌";
              else if (cat === "Ambulância") iconeBotao = "🚑";
              else if (cat === "Trator") iconeBotao = "🚜";
              return (
                <Link
                  key={cat}
                  to={`/frota/${cat}`}
                  onClick={() => setTempoRestante(5)}
                  className={`btn btn-sm text-nowrap px-3 py-2 ${rotaAtiva ? "btn-light text-dark fw-bold shadow" : "btn-outline-light text-white"}`}
                >
                  {iconeBotao} {cat}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <main>
        <Routes>
          {/* Atualizado para usar 'dados.infraestrutura' e 'dados.frota' vindos da API */}
          <Route
            path="/"
            element={
              <>
                <div className="container-fluid px-4 mt-4"><div className="row g-3 mb-4">
                  <div className="col-12 col-md-4"><StatusCard label="Uptime dos links" value={`${linksOnline}/5`} subtext="Canais operacionais" icon="◉" variant={linksOnline === 5 ? "success" : "warning"} /></div>
                  <div className="col-12 col-md-4"><StatusCard label="Veículos monitorados" value={dados.frota.length} subtext="Telemetria recebida do SQLite" icon="▣" variant="success" /></div>
                  <div className="col-12 col-md-4"><StatusCard label="Alertas ativos" value={veiculosOffline} subtext="Veículos afetados por dependências" icon="⚠" variant={veiculosOffline ? "danger" : "success"} /></div>
                </div><TelemetryChart fleet={dados.frota} /><FleetTable fleet={dados.frota} isCategoryOnline={isCategoryOnline} /></div>
                <LinksComunicacao dados={dados.infraestrutura} statusLinks={statusLinks} toggleLink={toggleLink} />
              </>
            }
          />
          <Route
            path="/frota/:categoria"
            element={
              <FrotaCategoria frota={dados.frota} statusLinks={statusLinks} isCategoryOnline={isCategoryOnline} />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <DashboardRouter />
    </BrowserRouter>
  );
}

export default App;
