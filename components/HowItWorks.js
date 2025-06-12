export default function HowItWorks() {
  return (
    <div style={{
      backgroundColor: '#f8f9fc',
      padding: '40px 20px',
      fontFamily: '"Inter", sans-serif',
      textAlign: 'center',
      borderTop: '1px solid #e0e6ed',
    }}>
      <h2 style={{
        fontSize: '28px',
        marginBottom: '30px',
        color: '#222'
      }}>How It Works</h2>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '30px',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {[
          { icon: '🧠', title: 'Step 1', text: 'Chat with MoveSafe AI and get a real quote instantly.' },
          { icon: '💳', title: 'Step 2', text: 'Reserve your date with a refundable $85 deposit.' },
          { icon: '📞', title: 'Step 3', text: 'Hop on a MoveSafe Call to confirm all the details.' },
          { icon: '🚚', title: 'Step 4', text: 'Relax—we handle coordination so you stay in control.' },
        ].map((step, idx) => (
          <div key={idx} style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
            padding: '24px',
            width: '220px',
            flex: '1 1 220px',
          }}>
            <div style={{
              fontSize: '32px',
              marginBottom: '10px'
            }}>{step.icon}</div>
            <h3 style={{
              fontSize: '18px',
              marginBottom: '8px',
              color: '#333'
            }}>{step.title}</h3>
            <p style={{
              fontSize: '14px',
              color: '#555',
              lineHeight: '1.4'
            }}>{step.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
