function DashboardCard({ title, value, icon }) {
  return (
    <div className="stat-card">
      {icon && <div style={{ fontSize: "2rem", marginBottom: "8px" }}>{icon}</div>}
      <div className="stat-value">{value}</div>
      <div className="stat-label">{title}</div>
    </div>
  );
}

export default DashboardCard;
