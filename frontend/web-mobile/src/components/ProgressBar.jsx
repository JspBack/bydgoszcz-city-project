export function ProgressBar({ label, current, total, percentage, color }) {
  return (
    <div className="progress-wrapper">
      <div className="progress-label">
        {label}: {current}/{total}
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: '${percentage}%',
            backgroundColor: color
          }}
        ></div>
      </div>
    </div>
  );
}