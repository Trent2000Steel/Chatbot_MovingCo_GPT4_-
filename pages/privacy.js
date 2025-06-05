import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '20px' }}>Privacy Policy</h1>
      <p>Last updated: June 2025</p>

      <h3>1. Introduction</h3>
      <p>
        Trust Moving Co (“we”, “our”, or “us”) values your privacy. This Privacy Policy explains how we collect, use,
        and protect your personal information when you visit our website or use our services.
      </p>

      <h3>2. What Information We Collect</h3>
      <ul>
        <li>Your name, phone number, and email address</li>
        <li>Move details, including addresses, date, and room information</li>
        <li>Payment-related data (processed securely via Stripe — we do not store credit card info)</li>
        <li>Basic technical data like browser type and device (via standard cookies)</li>
      </ul>

      <h3>3. How We Use Your Information</h3>
      <p>We use your information to:</p>
      <ul>
        <li>Coordinate and confirm your move</li>
        <li>Contact you for the MoveSafe Call</li>
        <li>Send quotes, confirmations, invoices, and reminders</li>
        <li>Improve website experience and security</li>
      </ul>

      <h3>4. Sharing Your Information</h3>
      <p>
        We do not sell or rent your personal data. We only share information with trusted service providers (such as
        independent movers or Housecall Pro) for the purpose of fulfilling your service.
      </p>

      <h3>5. Third-Party Services</h3>
      <p>
        We rely on third-party platforms like Stripe, Housecall Pro, and our hosting provider (Vercel) to deliver our
        services. These platforms have their own privacy policies and we recommend reviewing them separately.
      </p>

      <h3>6. Data Retention</h3>
      <p>
        We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy
        or comply with legal requirements.
      </p>

      <h3>7. Your Rights</h3>
      <p>
        If you are a California resident or covered by similar privacy laws, you have the right to:
      </p>
      <ul>
        <li>Request access to your personal data</li>
        <li>Request correction or deletion</li>
        <li>Opt out of communications at any time</li>
      </ul>
      <p>To submit a request, email <a href="mailto:support@trustmovingco.com">support@trustmovingco.com</a>.</p>

      <h3>8. Cookies</h3>
      <p>
        We use essential cookies to operate and secure our website. We do not use marketing or tracking cookies. You
        may adjust your browser settings to block or delete cookies at any time.
      </p>

      <h3>9. Contact</h3>
      <p>
        For privacy-related questions, contact us at:{' '}
        <a href="mailto:support@trustmovingco.com">support@trustmovingco.com</a>.
      </p>

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <Link href="/" style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#0d6efd',
          color: '#fff',
          borderRadius: '6px',
          textDecoration: 'none'
        }}>
          Back to Chat
        </Link>
      </div>
    </div>
  );
}
