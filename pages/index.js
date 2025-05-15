import Head from 'next/head'

export default function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      fontFamily: 'sans-serif'
    }}>
      <header style={{
        textAlign: 'center',
        padding: '24px',
        background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <h1>MOVINGCO</h1>
        <p>Powered by the MoveSafe Method™</p>
        <div style={{ marginTop: '12px', fontSize: '14px' }}>
          <strong>MoveSafe Verified™</strong>
          <p>We take the risk, not you. Money-back guarantee.</p>
        </div>
      </header>

      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        border: '1px solid #ddd',
        margin: '20px auto',
        width: '100%',
        maxWidth: '700px',
        borderRadius: '12px',
        backgroundColor: '#fff',
        boxShadow: '0 0 8px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          maxWidth: '70%',
          margin: '10px',
          padding: '12px 16px',
          borderRadius: '12px',
          backgroundColor: '#f1f1f1',
          alignSelf: 'flex-start'
        }}>
          No forms. No waiting. I’ll give you a real quote right here in chat. Just tell me about your move.
        </div>
      </main>

      <footer style={{
        textAlign: 'center',
        fontSize: '12px',
        padding: '20px',
        borderTop: '1px solid #e0e0e0',
        color: '#666'
      }}>
        <p>Verified Movers · Flat-Rate Guarantee · Concierge Support · Secure Checkout</p>
        <p><a href="#">Terms of Service</a> | <a href="#">Privacy Policy</a></p>
      </footer>
    </div>
  )
}
