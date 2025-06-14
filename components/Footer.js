export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#f9f9f9',
      padding: '30px 20px',
      textAlign: 'center',
      fontSize: '14px',
      color: '#666',
      borderTop: '1px solid #e0e0e0'
    }}>
      <div style={{ marginBottom: '10px' }}>
        <a href="/about" style={{ margin: '0 10px', color: '#666', textDecoration: 'none' }}>About Us</a>
        |
        <a href="/contact" style={{ margin: '0 10px', color: '#666', textDecoration: 'none' }}>Contact</a>
        |
        <a href="/faq" style={{ margin: '0 10px', color: '#666', textDecoration: 'none' }}>FAQ</a>
        |
        <a href="/terms" style={{ margin: '0 10px', color: '#666', textDecoration: 'none' }}>Terms of Service</a>
        |
        <a href="/privacy" style={{ margin: '0 10px', color: '#666', textDecoration: 'none' }}>Privacy Policy</a>
      </div>
      <div>
        &copy; 2025 MovingCo. All rights reserved.
      </div>
    </footer>
  );
}
