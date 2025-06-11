export default function HomePage() {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🚀 LunarFlow</h1>
      <h2>Application is running successfully!</h2>
      <p>Frontend is working in Kubernetes</p>
      <p>No external imports - pure HTML/CSS</p>
    </div>
  );
}
