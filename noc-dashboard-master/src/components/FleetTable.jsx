export function FleetTable({ fleet, isCategoryOnline }) {
  return (
    <div className="card glass-card mb-4"><div className="card-body"><h5 className="text-info">Resumo da frota</h5><div className="table-responsive"><table className="table table-dark table-sm align-middle mb-0"><thead><tr><th>ID</th><th>Categoria</th><th>Velocidade</th><th>Status</th></tr></thead><tbody>
      {fleet.slice(0, 10).map((vehicle) => { const online = isCategoryOnline(vehicle.tipo); return <tr key={vehicle.id}><td>{vehicle.id}</td><td>{vehicle.tipo}</td><td>{online ? `${vehicle.vel} km/h` : "0 km/h"}</td><td><span className={`badge ${online ? "bg-success" : "bg-danger"}`}>{online ? "ONLINE" : "OFFLINE"}</span></td></tr>; })}
    </tbody></table></div></div></div>
  );
}