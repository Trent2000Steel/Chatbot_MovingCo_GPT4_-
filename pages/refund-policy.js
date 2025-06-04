export default function RefundPolicy() {
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
        <h1 style={{ fontSize: "28px", marginBottom: "24px", color: "#222" }}>Refund Policy</h1>

        <section style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", color: "#111" }}>1. $85 Deposit Refunds</h2>
          <p>
            Your $85 deposit is <strong>fully refundable</strong> up until you accept your flat-rate quote.
            If you decide not to proceed after the MoveSafe Call, we’ll refund your deposit in full—no questions asked.
          </p>
          <p style={{ marginTop: "12px" }}>
            Once you accept your flat rate and coordination begins, the deposit becomes <strong>non-refundable</strong>.
          </p>
        </section>

        <section style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", color: "#111" }}>2. What This Policy Covers</h2>
          <p>
            This refund policy only applies to the initial $85 booking deposit. It does not cover any additional payments,
            such as packing supplies or third-party moving services.
          </p>
        </section>

        <section style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", color: "#111" }}>3. How to Request a Refund</h2>
          <p>
            To request a refund, email <a href="mailto:support@trustmovingco.com" style={{ color: "#0d6efd" }}>support@trustmovingco.com</a>
            within 14 days of your original booking. Please include your name and the email address used at checkout.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "20px", color: "#111" }}>4. Exceptions</h2>
          <p>
            We reserve the right to deny refunds in cases of fraud, false information, abuse of our booking system, or where significant
            coordination work has already been performed prior to cancellation.
          </p>
        </section>
      </div>
    </div>
  );
}
