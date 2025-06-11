export default function TestimonialBar() {
  const testimonials = [
    {
      img: '/Te1.PNG',
      text: "We had a lot of concerns moving cross country. MovingCo didn't just calm our nerves — they handled every detail, every question, and never once made us feel like we were bothering them. Incredible service.",
      name: "Karen",
      route: "CA to TX"
    },
    {
      img: '/Te2.PNG',
      text: "Every mover showed up exactly on time, and the quote matched the final price. No surprises. That's all I ever wanted.",
      name: "Alicia",
      route: "TX to FL"
    },
    {
      img: '/Te3.PNG',
      text: "We had some valuable antiques we were worried about. Everything was packed with care and arrived perfectly.",
      name: "Evelyn",
      route: "NY to TN"
    },
    {
      img: '/Te4.PNG',
      text: "We weren’t sure if a concierge-style service would be worth it. It was. We had support the whole way through.",
      name: "Raj",
      route: "NV to AZ"
    },
    {
      img: '/Te5.PNG',
      text: "We’d been ghosted by another mover days before our move date. MovingCo came through and made it happen. Life saver.",
      name: "Chris",
      route: "IL to CA"
    }
  ];

  return (
    <div style={{ backgroundColor: '#e6f2ff', padding: '40px 20px', textAlign: 'center' }}>
      <div id="testimonial-container">
        {testimonials.map((t, i) => (
          <div key={i} style={{ maxWidth: '600px', margin: '0 auto 40px' }}>
            <img
              src={t.img}
              alt={`Photo of ${t.name}`}
              style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: '16px'
              }}
            />
            <p style={{
              fontStyle: 'italic',
              fontSize: '16px',
              lineHeight: '1.6',
              margin: '0 auto 10px',
              color: '#333'
            }}>
              “{t.text}”
            </p>
            <div style={{ fontSize: '18px', color: '#000', margin: '8px 0' }}>★ ★ ★ ★ ★</div>
            <div style={{ fontSize: '13px', color: '#555' }}>
              — {t.name}, {t.route}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}