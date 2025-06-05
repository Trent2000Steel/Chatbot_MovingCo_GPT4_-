import Link from 'next/link';

export default function ThankYou() {
  return (
    <div style={{
      background: 'linear-gradient(to bottom right, #f9fbff, #eef2f7)',
      minHeight: '100vh',
      padding: '40px 20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: '"Inter", sans-serif',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.1)',
        padding: '48px',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        border: '1px solid #e1e8f0',
      }}>
        <div style={{
          fontSize: '56px',
          color: '#3ccf55',
          marginBottom: '24px',
        }}>
          ✅
        </div>
        <h1 style={{ fontSize: '28px', marginBottom: '12px', color: '#111' }}>You're Booked</h1>
        <p style={{ fontSize: '16px', color: '#444', marginBottom: '32px' }}>
          Thanks for placing your <strong>$85 deposit</strong>. Your move has been reserved and added to our calendar.
        </p>
        <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#0d6efd' }}>Next Step</h3>
        <p style={{ fontSize: '15px', color: '#444', marginBottom: '36px' }}>
          A MoveSafe Coordinator will call you within 48 hours. We’ll walk through your move and plan the next steps together.
        </p>

        <div style={{ fontSize: '14px', marginBottom: '24px' }}>
          Questions? Email <a href="mailto:support@trustmovingco.com" style={{ color: '#0d6efd' }}>support@trustmovingco.com</a>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '14px' }}>
          <Link href="/terms" style={{ color: '#555', textDecoration: 'underline' }}>Terms</Link>
          <Link href="/refund-policy" style={{ color: '#555', textDecoration: 'underline' }}>Refund Policy</Link>
          <Link href="/service-agreement" style={{ color: '#555', textDecoration: 'underline' }}>Service Agreement</Link>
        </div>
      </div>
    </div>
  );
}
