import { useState } from 'react';

const INITIAL_LINKS = [
  { id: 1, name: "Link VSAT (Hub Principal)", online: true, latency: 580, baseLatency: 580 },
  { id: 2, name: "Link VSAT (BGAN Backup)", online: false, latency: 0, baseLatency: 850 },
  { id: 3, name: "Roteamento OSPF", online: true, latency: 2, baseLatency: 2 },
  { id: 4, name: "Sessão BGP", online: true, latency: 12, baseLatency: 12 },
  { id: 5, name: "Link LTE-Móvel", online: true, latency: 45, baseLatency: 45 }
];

const INITIAL_CATEGORIES = [
  { id: "onibus", name: "Ônibus", count: 10000, linkId: 4, baseSpeed: 52 },
  { id: "caminhao", name: "Caminhão", count: 10000, linkId: 2, baseSpeed: 64 },
  { id: "moto", name: "Moto", count: 10000, linkId: 5, baseSpeed: 72 },
  { id: "carro", name: "Carro", count: 10000, linkId: 1, baseSpeed: 68 },
  { id: "caminhonete", name: "Caminhonete", count: 10000, linkId: 1, baseSpeed: 70 },
  { id: "van", name: "Van", count: 10000, linkId: 3, baseSpeed: 58 },
  { id: "suv", name: "SUV", count: 10000, linkId: 1, baseSpeed: 65 },
  { id: "esportivo", name: "Esportivo", count: 10000, linkId: 1, baseSpeed: 88 },
  { id: "trator", name: "Trator", count: 10000, linkId: 3, baseSpeed: 24 },
  { id: "ambulancia", name: "Ambulância", count: 10000, linkId: 3, baseSpeed: 78 }
];

export function useFleetMonitor() {
  const [links, setLinks] = useState(INITIAL_LINKS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);

  // Função para alternar um link individual
  const toggleLink = (linkId) => {
    setLinks(prevLinks =>
      prevLinks.map(link =>
        link.id === linkId ? { ...link, online: !link.online, latency: !link.online ? link.baseLatency : 0 } : link
      )
    );
  };

  // Função para simular derrubar um link específico
  const dropLink = (linkId) => {
    setLinks(prevLinks =>
      prevLinks.map(link =>
        link.id === linkId ? { ...link, online: false, latency: 0 } : link
      )
    );
  };

  // Restaurar todos
  const restoreAll = () => {
    setLinks(prevLinks =>
      prevLinks.map(link => ({ ...link, online: true, latency: link.baseLatency }))
    );
  };

  // Alternar links ímpares/pares
  const toggleAlternated = () => {
    setLinks(prevLinks =>
      prevLinks.map((link, idx) =>
        idx % 2 === 1 ? { ...link, online: !link.online, latency: !link.online ? link.baseLatency : 0 } : link
      )
    );
  };

  return {
    links,
    categories,
    toggleLink,
    dropLink,
    restoreAll,
    toggleAlternated
  };
}