const variantClasses = { success: "border-success text-success", warning: "border-warning text-warning", danger: "border-danger text-danger" };

export function StatusCard({ label, value, subtext, icon, variant = "success" }) {
  return (
    <div className={`card glass-card h-100 border ${variantClasses[variant]}`}>
      <div className="card-body"><div className="d-flex justify-content-between align-items-start"><span className="small text-uppercase text-secondary">{label}</span><span className="fs-4" aria-hidden="true">{icon}</span></div><div className="display-6 fw-bold text-white mt-2">{value}</div><small className="text-secondary">{subtext}</small></div>
    </div>
  );
}