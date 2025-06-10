export default function Terms() {
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
        maxWidth: "800px",
        margin: "0 auto",
        padding: "40px 32px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
        border: "1px solid #e0e0e0"
      }}>
        <h1 style={{ fontSize: "28px", marginBottom: "24px", color: "#222" }}>Terms of Service</h1>

        {/* Sections 1–9 unchanged... */}

        <section style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", color: "#111" }}>9. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the state of Texas, without regard to its conflict of law principles.
          </p>
        </section>

        <section style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", color: "#111" }}>10. Cookies & Analytics</h2>
          <p>
            We use essential cookies to operate and secure our website. We also use Google Analytics to understand how users interact with our site. 
            These tools may place cookies on your device to collect anonymized traffic and usage data. 
            We do not use advertising or remarketing cookies at this time. You may adjust your browser settings to block or delete cookies at any time.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "20px", color: "#111" }}>11. Contact</h2>
          <p>
            Questions about these terms? Email us at <a href="mailto:support@trustmovingco.com" style={{ color: "#0d6efd" }}>support@trustmovingco.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
