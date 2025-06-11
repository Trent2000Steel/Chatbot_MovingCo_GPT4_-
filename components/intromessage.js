export default function IntroMessage() {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      padding: '15px 20px',
      textAlign: 'center',
      maxWidth: '700px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h2 style={{ fontSize: '24px', marginBottom: '10px', color: '#333' }}>
        Skip the forms. Get a real quote in chat — fast.
      </h2>
      <p style={{ fontSize: '16px', color: '#555' }}>
        We’ll guide you step-by-step in just a few minutes:
      </p>
      <ol style={{
        textAlign: 'left',
        display: 'inline-block',
        marginTop: '10px',
        fontSize: '16px',
        lineHeight: '1.8',
        color: '#444',
        paddingLeft: '20px'
      }}>
        <li>Chat now and get your custom quote</li>
        <li>Reserve your move day with a refundable $85 deposit</li>
        <li>Lock in your flat rate after a quick MoveSafe Call</li>
      </ol>
    </div>
  );
}
