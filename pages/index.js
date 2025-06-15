
import Head from 'next/head';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Footer from '../components/Footer';
import TestimonialBar from '../components/TestimonialBar';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatFlow = dynamic(() => import('../components/ChatFlow'), { ssr: false });

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const previewRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowPulse(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (previewRef.current) {
      observer.observe(previewRef.current);
    }

    return () => {
      if (previewRef.current) {
        observer.unobserve(previewRef.current);
      }
    };
  }, []);

  return (
    <div style={{ backgroundColor: '#f0f4f8', fontFamily: '"Inter", sans-serif' }}>
      <Head>
        <title>MovingCo | Trusted Long Distance Movers</title>
        <meta name="description" content="Get a real price range in chat. No forms, no waiting. Reserve your move today." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Video Section */}
      <header style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        >
          <source src="/videos/Hero.mp4" type="video/mp4" />
        </video>
        <Image
          src="/Headeroverlay.PNG"
          alt="Overlay"
          layout="fill"
          objectFit="contain"
        />
      </header>

      {/* Trust Text + CTA */}
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <div style={{ fontSize: '20px', color: '#888' }}>Trusted by families in all 50 states</div>
        <div style={{ fontSize: '24px', marginTop: '8px' }}>
          <span role="img" aria-label="wave">👋</span> Get a price right now in chat!
        </div>
      </div>

      {/* Chat Box Preview */}
      <div
        ref={previewRef}
        onClick={() => setIsChatOpen(true)}
        style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          padding: '16px',
          margin: '32px auto',
          width: '95%',
          maxWidth: '500px',
          borderTop: '4px solid #1e70ff',
          cursor: 'pointer'
        }}
      >
        <div style={{ fontSize: '16px', color: '#555', marginBottom: '12px' }}>
          No forms, no waiting — I’ll give you a real price range right now. Where are you moving from?
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
  readOnly
  placeholder="City, State (e.g. Dallas, TX)"
  onFocus={() => setIsChatOpen(true)}
  style={{
    flex: 1,
    padding: '8px 12px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#fff',
    cursor: 'text',
    color: '#333',
  }}
/>
          <button style={{
            backgroundColor: '#1e70ff',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            cursor: 'pointer',
            animation: showPulse ? 'pulse 3s ease-in-out infinite' : 'none'
          }}>Send</button>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(30, 112, 255, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(30, 112, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(30, 112, 255, 0);
          }
        }
      `}</style>

      {/* Fullscreen Chat */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: '#ffffff',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{
              backgroundColor: '#1e70ff',
              color: '#fff',
              padding: '16px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <button onClick={() => setIsChatOpen(false)} style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '18px',
                cursor: 'pointer',
                marginRight: '8px'
              }}>← Back</button>
              <span>MovingCo Chat</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <ChatFlow />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Testimonials */}
      <TestimonialBar />

      {/* Full Width Images */}
      <Image
        src="/17029ECA-FD4F-4F7C-A085-91BBF0DFDFFB.png"
        alt="Scene Image"
        width={1920}
        height={1080}
        style={{ width: '100%', height: 'auto', display: 'block', marginTop: '40px' }}
      />
      <div style={{ backgroundColor: "#111", padding: "20px 0" }}>
        <Image
          src="/7D69579A-E413-48C9-AEF6-EDF9E30A2ACC.png"
          alt="Black Background Image"
          width={1920}
          height={1080}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
