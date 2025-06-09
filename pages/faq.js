export default function FAQ() {
  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif', color: '#333' }}>
      <a
        href="/"
        style={{
          display: 'inline-block',
          marginBottom: '20px',
          color: '#0d6efd',
          fontSize: '14px',
          textDecoration: 'none'
        }}
      >
        ← Back to Home
      </a>

      <h1 style={{ fontSize: '28px', marginBottom: '20px' }}>Frequently Asked Questions</h1>

      <div style={{ fontSize: '16px', lineHeight: '1.7' }}>
        <p><strong>Q: Is this a moving company?</strong><br />
        A: No — we’re a concierge service. We coordinate your move with licensed, verified movers. You get one point of contact, guaranteed pricing, and full support, but we don’t operate the trucks ourselves.</p>

        <p><strong>Q: Do I really get a quote in chat?</strong><br />
        A: Yes. We’ll ask a few quick questions and give you an instant estimated range based on real move data — no forms, no spam, no phone calls.</p>

        <p><strong>Q: What’s the $85 deposit for?</strong><br />
        A: It reserves your date and starts the review process. After you send photos and complete the MoveSafe Call, we’ll send your flat-rate offer. Don’t like it? We refund your deposit, no questions asked.</p>

        <p><strong>Q: Is the quote final?</strong><br />
        A: The price range you see in chat is based on your move details. Once your photos are reviewed and you speak with our coordinator, you’ll get a locked-in flat rate. That’s the number you pay — no surprises.</p>

        <p><strong>Q: What’s the MoveSafe Method™?</strong><br />
        A: It’s our 5-step process to keep your move simple, secure, and fair: verified movers, instant quoting, human review, clear coordination, and a money-back guarantee.</p>

        <p><strong>Q: Are your movers background-checked and licensed?</strong><br />
        A: Yes. We only coordinate with vetted, licensed movers — no gig crews or fly-by-night operations.</p>

        <p><strong>Q: What if I need to cancel?</strong><br />
        A: You can cancel anytime before accepting your flat-rate offer and get a full refund of your deposit.</p>

        <p><strong>Q: Can I talk to a human?</strong><br />
        A: Absolutely. After your initial quote, you’ll have a live MoveSafe Call with a real coordinator to review your move and confirm your rate.</p>
      </div>
    </div>
  );
}
