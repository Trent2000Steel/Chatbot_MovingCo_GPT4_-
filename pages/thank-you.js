export default function ThankYou() {
  return (
    <div style={{
      padding: "48px 24px",
      fontFamily: "Arial, sans-serif",
      maxWidth: "600px",
      margin: "0 auto",
      textAlign: "center",
      backgroundColor: "#fffdf9"
    }}>
      <div style={{ fontSize: "72px", color: "#28a745", marginBottom: "24px" }}>✅</div>
      <h1 style={{ fontSize: "32px", marginBottom: "16px", color: "#222" }}>You're Booked</h1>
      <p style={{ fontSize: "18px", marginBottom: "24px", color: "#444" }}>
        Thanks for placing your $85 deposit. Your move has been reserved and added to our calendar.
      </p>
      <h3 style={{ fontSize: "20px", marginBottom: "8px", color: "#222" }}>Next Step</h3>
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
  );
}
