
import Head from 'next/head';
import ChatBox from '../components/chatbox';
import Footer from '../components/footer';
import TestimonialBar from '../components/testimonialbar';

export default function Home() {
  return (
    <>
      <Head>
        <title>MovingCo – The Standard of Moving</title>
        <meta name="description" content="Premium moving coordination built on trust. Get a flat-rate long distance move with verified movers." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }}>
        {/* Hero Section */}
        <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
          <video
            autoPlay
            muted
            loop
            playsInline
            type="video/mp4"
            src="/videos/Hero.mp4"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: -2
            }}
          />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.25)',
            zIndex: -1
          }} />
          <img
            src="/Headeroverlay.PNG"
            alt="MovingCo Overlay"
            style={{
              maxWidth: '1000px',
              width: '100%',
              margin: '0 auto',
              display: 'block',
              padding: '60px 20px',
              position: 'relative',
              zIndex: 1
            }}
          />
          <div style={{
            textAlign: 'center',
            marginTop: '-20px',
            fontSize: '32px',
            animation: 'bounce 2s infinite',
            color: '#ffffff',
            opacity: 0.7
          }}>
            ↓
          </div>
        </div>

        {/* Trust Line */}
        <p style={{
          textAlign: 'center',
          fontSize: '14px',
          color: '#888',
          margin: '16px auto -8px'
        }}>
          Trusted by families in all 50 states.
        </p>

        {/* Chat Container */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          maxWidth: '700px',
          margin: '40px auto 20px auto',
          padding: '24px 16px',
          zIndex: 2,
          position: 'relative'
        }}>
          <ChatBox />
        </div>

        {/* Trust Bar Image */}
        <img
          src="/Movingcompany2.png"
          alt="Trust Bar"
          style={{
            width: '100%',
            display: 'block',
            margin: 0,
            padding: 0
          }}
        />

        <TestimonialBar />
        <Footer />
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(6px);
          }
          60% {
            transform: translateY(3px);
          }
        }
      `}</style>
    </>
  );
}
