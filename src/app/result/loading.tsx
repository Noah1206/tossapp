export default function ResultLoading() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100dvh',
      background: '#FFFFFF',
    }}>
      {/* Header skeleton */}
      <div style={{ height: 52, borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', padding: '0 20px' }}>
        <div style={{ width: 80, height: 14, background: 'rgba(0,0,0,0.06)', borderRadius: 6 }} />
      </div>

      {/* Content skeleton */}
      <div style={{ flex: 1, padding: '24px 20px' }}>
        {/* Title */}
        <div style={{ width: '85%', height: 20, background: 'rgba(0,0,0,0.06)', borderRadius: 6, marginBottom: 12 }} />
        <div style={{ width: '60%', height: 20, background: 'rgba(0,0,0,0.05)', borderRadius: 6, marginBottom: 28 }} />

        {/* Paragraph lines */}
        {[95, 100, 80, 90].map((w, i) => (
          <div key={i} style={{ width: `${w}%`, height: 14, background: 'rgba(0,0,0,0.04)', borderRadius: 5, marginBottom: 10 }} />
        ))}

        {/* Image placeholder */}
        <div style={{ width: '100%', height: 180, background: 'rgba(0,0,0,0.04)', borderRadius: 12, margin: '20px 0' }} />

        {/* More lines */}
        {[90, 100, 70].map((w, i) => (
          <div key={i} style={{ width: `${w}%`, height: 14, background: 'rgba(0,0,0,0.04)', borderRadius: 5, marginBottom: 10 }} />
        ))}
      </div>
    </div>
  );
}
