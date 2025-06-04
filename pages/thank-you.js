export default function ThankYou() {
  return (
    <div style={{
      backgroundColor: "#f4f4f4",
      padding: "60px 24px",
      fontFamily: '"Inter", "Segoe UI", "Helvetica Neue", sans-serif',
      minHeight: "100vh"
    }}>
      <div style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "40px 32px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
        textAlign: "center",
        border: "1px solid #e0e0e0"
      }}>
        <div style={{ fontSize: "64px", marginBottom: "24px", color: "#28a745" }}>✅</div>
        <h1 style={{ fontSize: "30px", marginBottom: "16px", color: "#222" }}>You're Booked</h1>
        <p style={{ fontSize: "17px", marginBottom: "24px", color: "#444" }}>
          Thanks for placing your $85 deposit. Your move has been reserved and added to our calendar.
        </p>
        <h3 style={{ fontSize: "20px", marginBottom: "8px", color: "#111" }}>Next Step</h3>
        <p style={{ fontSize: "16px", color: "#555" }}>
          A MoveSafe Coordinator will call you within 48 hours. We’ll walk through your move and next steps together.
        </p>
        <footer style={{ marginTop: "40px", fontSize: "13px", color: "#999" }}>
          <p>
            Questions? Email <a href="mailto:support@trustmovingco.com" style={{ color: "#0d6efd" }}>support@trustmovingco.com</a>
          </p>
          <p style={{ marginTop: "8px" }}>
            <a href="/terms" style={{ color: "#666", marginRight: "10px" }}>Terms</a> ·
            <a href="/refund-policy" style={{ color: "#666", margin: "0 10px" }}>Refund Policy</a> ·
            <a href="/service-agreement" style={{ color: "#666", marginLeft: "10px" }}>Service Agreement</a>
          </p>
        </footer>
      </div>
    </div>
  );
}
