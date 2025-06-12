
import React from 'react';

const testimonials = [
  {
    name: "James, TX to FL",
    quote: "Every mover showed up exactly on time, and the quote matched the final price. No surprises. That's all I ever wanted.",
    image: "/Te1.PNG",
    rating: 5
  },
  {
    name: "Evelyn, NY to TN",
    quote: "We had some valuable antiques we were worried about. Everything was packed with care and arrived perfectly.",
    image: "/Te2.PNG",
    rating: 5
  },
  {
    name: "Marcus, AZ to WA",
    quote: "We weren’t sure if a concierge-style service would be worth it. It was. We had support the whole way through.",
    image: "/Te3.PNG",
    rating: 5
  }
];

export default function TestimonialBar() {
  return (
    <div style={{
      backgroundColor: '#f0f4f8',
      padding: '48px 16px'
    }}>
      <h2 style={{
        textAlign: 'center',
        fontSize: '24px',
        fontWeight: '600',
        marginBottom: '32px',
        color: '#222'
      }}>
        What Customers Are Saying
      </h2>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '24px'
      }}>
        {testimonials.map((t, i) => (
          <div key={i} style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.05)',
            padding: '24px',
            maxWidth: '340px',
            textAlign: 'center',
            flex: '1 1 300px'
          }}>
            <img
              src={t.image}
              alt={t.name}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: '16px'
              }}
            />
            <p style={{ fontSize: '16px', color: '#333', marginBottom: '12px' }}>
              “{t.quote}”
            </p>
            <div style={{ marginBottom: '6px' }}>
              {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
            </div>
            <p style={{ fontSize: '14px', color: '#777' }}>— {t.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
