// components/HowItWorks.js

export default function HowItWorks() {
  return (
    <div style={{
      padding: '40px 20px',
      backgroundColor: '#f9fbff',
      textAlign: 'center',
      fontFamily: '"Inter", sans-serif',
    }}>
      <h2 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#1a1a1a',
      }}>How It Works</h2>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        maxWidth: '600px',
        margin: '0 auto',
      }}>
        <div style={{ fontSize: '16px', color: '#444' }}>1. Chat with us to get your real price range.</div>
        <div style={{ fontSize: '16px', color: '#444' }}>2. Reserve your move with a refundable $85 deposit.</div>
        <div style={{ fontSize: '16px', color: '#444' }}>3. Lock in your flat rate on your MoveSafe Call.</div>
      </div>
    </div>
  );
}
