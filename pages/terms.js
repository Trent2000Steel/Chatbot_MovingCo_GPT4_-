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

        <section style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", color: "#111" }}>1. Introduction</h2>
          <p>
            By using the services provided by MovingCo (“we,” “us,” or “our”), you agree to these Terms of Service.
            If you do not agree, please do not use our website or services.
          </p>
        </section>

        <section style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", color: "#111" }}>2. What We Do</h2>
          <p>
            MovingCo is a move coordination and concierge platform. We assist customers in planning long-distance moves 
            using verified third-party vendors. Our goal is to simplify your move through transparent flat-rate pricing and 
            organized scheduling.
          </p>
        </section>

        <section style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", color: "#111" }}>3. What We Don’t Do</h2>
          <p>
            We are not a moving company. We do not operate moving trucks, provide manual labor, or physically transport 
            goods. We are not a freight broker, common carrier, or insurer. All physical services are performed by independent 
            third parties.
          </p>
        </section>

        <section style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", color: "#111" }}>4. The MoveSafe Method™</h2>
          <p>
            Our MoveSafe Method involves collecting information, photos, and inventory details from you to help generate a flat-rate quote.
            This quote is subject to approval by our internal review process and may change if conditions differ from your submitted details.
          </p>
        </section>

        <section style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", color: "#111" }}>5. Your Responsibilities</h2>
          <p>
            You agree to provide truthful, complete, and timely information. You must submit the requested photos within 48 hours of your initial booking.
            Failure to do so may delay or alter the coordination of your move.
          </p>
        </section>

        <section style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", color: "#111" }}>6. Deposits & Refunds</h2>
          <p>
            A refundable $85 deposit is required to initiate your booking. This deposit is fully refundable up until your MoveSafe Call.
            For more details, see our <a href="/refund-policy" style={{ color: "#0d6efd" }}>Refund Policy</a>.
          </p>
        </section>

        <section style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", color: "#111" }}>7. Third-Party Services & Liability</h2>
          <p>
            We are not liable for any damages, losses, or delays caused by the independent vendors we coordinate with.
            However, we will do our best to assist you in resolving issues or filing claims if necessary.
          </p>
        </section>

        <section style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", color: "#111" }}>8. Service Denial or Termination</h2>
          <p>
            We reserve the right to cancel or deny service to anyone at our discretion, especially in cases involving fraud,
            abuse, or misrepresentation.
          </p>
        </section>

        <section style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", color: "#111" }}>9. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the state of Texas, without regard to its conflict of law principles.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "20px", color: "#111" }}>10. Contact</h2>
          <p>
            Questions about these terms? Email us at <a href="mailto:support@trustmovingco.com" style={{ color: "#0d6efd" }}>support@trustmovingco.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
