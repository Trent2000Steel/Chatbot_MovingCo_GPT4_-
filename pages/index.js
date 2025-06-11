
import Head from 'next/head';
import ChatBox from '../components/chatbox';
import Footer from '../components/footer';
import TestimonialBar from '../components/testimonialbar';

export default function Home() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }}>
      <Head>
        <title>MovingCo – The Standard of Moving</title>
        <meta name="description" content="Premium moving coordination built on trust. Get a flat-rate long distance move with verified movers." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Hero Section with Video Background */}
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

        {/* Optional dark overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.25)',
          zIndex: -1
        }} />

        {/* Overlay Image */}
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

      <ChatBox />
      <TestimonialBar />
      <Footer />
    </div>
  );
}
