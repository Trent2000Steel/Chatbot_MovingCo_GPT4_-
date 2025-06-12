
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
          margin: '12px auto -4px'
        }}>
          Trusted by families in all 50 states.
        </p>

        {/* Chat Section with background */}
        <div style={{
          backgroundColor: '#f5f6f7',
          padding: '24px 0 48px 0'
        }}>
          <div style={{
            maxWidth: '700px',
            margin: '0 auto',
            padding: '0 16px'
          }}>
            <p style={{
              textAlign: 'center',
              fontSize: '16px',
              fontWeight: '500',
              color: '#444',
              marginBottom: '16px'
            }}>
              👋 Ready to get your price? Just answer a few quick questions.
            </p>
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
              borderTop: '4px solid #1e70ff',
              padding: '24px 16px'
            }}>
              <ChatBox />
            </div>
          </div>
        </div>

        {/* Trust Bar Image with bottom padding */}
        <div style={{ paddingBottom: '24px' }}>
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
        </div>

        <TestimonialBar />

        {/* Replacing HowItWorks with static image */}
        <div style={{ backgroundColor: '#1a1a1a', padding: '40px 0' }}>
          <img
            src="/17029ECA-FD4F-4F7C-A085-91BBF0DFDFFB.png"
  loading="lazy"
            alt="How It Works"
            style={{
              width: '100%',
              maxWidth: '900px',
              margin: '0 auto 40px auto',
              display: 'block'
            }}
          />
          <img
            src="/7D69579A-E413-48C9-AEF6-EDF9E30A2ACC.png"
  loading="lazy"
            alt="Final Call To Action"
            style={{
              width: '100%',
              maxWidth: '800px',
              margin: '0 auto',
              display: 'block'
            }}
          />
        </div>

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
