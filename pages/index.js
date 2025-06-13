
import Head from 'next/head';
import Image from 'next/image';
import ChatFlow from '../components/ChatFlow';
import TestimonialBar from '../components/testimonialbar';
import Footer from '../components/footer';

export default function Home() {
  return (
    <div style={{
      backgroundColor: '#f3f8fe',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '20px 10px',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
    }}>
      <Head>
        <title>MovingCo — Get Your Flat Rate Quote</title>
        <meta name="description" content="Chat now to get your real moving estimate — no forms, no waiting. Just clear pricing and concierge service." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{
        width: '100%',
        maxWidth: '600px',
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
      }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
            display: 'block',
          }}
        >
          <source src="/videos/Hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <Image
          src="/HeaderOverlay.png"
          alt="Overlay"
          width={600}
          height={200}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
          }}
        />
      </div>

      <div style={{
        maxWidth: '600px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        padding: '0',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #dce3eb'
      }}>
        <ChatFlow />
      </div>

      <TestimonialBar />
      <Footer />
    </div>
  );
}
