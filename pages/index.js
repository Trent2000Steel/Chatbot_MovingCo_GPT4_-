
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Footer from '../components/footer';
import TestimonialBar from '../components/testimonialbar';
import ChatFlow from '../components/ChatFlow'; // Assuming ChatFlow is now non-async and in components
import Image from 'next/image';

export default function Home() {
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
        <ChatFlow />
      </main>

      <Footer />
    </div>
  );
}
