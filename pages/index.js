
import { useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Footer from '../components/footer';
import TestimonialBar from '../components/testimonialbar';
import ChatFlow from '../components/ChatFlow';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [isChatOpen, setChatOpen] = useState(false);

  return (
    <div style={{ backgroundColor: '#f0f4f8', fontFamily: '"Inter", sans-serif' }}>
      <Head>
        <title>MovingCo | Trusted Long Distance Movers</title>
        <meta name="description" content="Get a real price range in chat. No forms, no waiting. Reserve your move today." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header style={{ position: 'relative', width: '100%', height: 'auto' }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
        >
          <source src="/videos/Hero.mp4" type="video/mp4" />
        </video>
        <Image
          src="/Headeroverlay.PNG"
          alt="Overlay"
          width={1920}
          height={500}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            pointerEvents: 'none'
          }}
        />
      </header>

      <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <TestimonialBar />

        <AnimatePresence>
          {!isChatOpen && (
            <motion.div
              key="chat-closed"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setChatOpen(true)}
              style={{
                cursor: 'pointer',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                overflow: 'hidden'
              }}
            >
              <ChatFlow />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            key="chat-open"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'white',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Top bar */}
            <div style={{
              backgroundColor: '#1e70ff',
              color: 'white',
              padding: '16px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <button onClick={() => setChatOpen(false)} style={{
                fontSize: '1.5rem',
                background: 'none',
                border: 'none',
                color: 'white',
                marginRight: '12px',
                cursor: 'pointer'
              }}>←</button>
              MovingCo
            </div>

            {/* Chat content */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <ChatFlow />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
