export default function HomePage() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      flexDirection: 'column',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5'
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>
        🚀 LunarFlow
      </h1>
      
      <h2 style={{ color: '#666', marginBottom: '20px' }}>
        Content Management Platform
      </h2>
      
      <p style={{ color: '#666', textAlign: 'center', maxWidth: '600px' }}>
        Your application is running successfully in Kubernetes!
      </p>
      
      <div style={{ marginTop: '30px' }}>
        <button 
          style={{
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            marginRight: '10px',
            cursor: 'pointer'
          }}
        >
          View Content
        </button>
        <button 
          style={{
            backgroundColor: 'transparent',
            color: '#0070f3',
            border: '1px solid #0070f3',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Create Content
        </button>
      </div>
    </div>
  );
}
