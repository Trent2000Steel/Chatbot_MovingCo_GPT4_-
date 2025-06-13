import Head from 'next/head';
import Image from 'next/image';
import footer from './footer';
import testimonialbar from './testimonialbar';

export default function Layout({ children }) {
  return (
    <div style={{ backgroundColor: '#f0f4f8', fontFamily: '"Inter", sans-serif' }}>
      <Head>
        <title>MovingCo | Trusted Long Distance Movers</title>
        <meta name="description" content="Get a real price range in chat. No forms, no waiting. Reserve your move today." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* HERO SECTION */}
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

        {/* Overlay with logo */}
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

        {/* Animated Arrow */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          animation: 'bounce 2s infinite'
        }}>
          <span style={{ fontSize: '32px', color: 'white' }}>↓</span>
        </div>
      </header>

      {/* TRUST TEXT + HAND ICON */}
      <section style={{ backgroundColor: '#fff', textAlign: 'center', padding: '30px 20px 10px' }}>
        <div style={{ fontSize: '14px', color: '#bbb', marginBottom: '10px' }}>
          Trusted by families in all 50 states
        </div>
        <div style={{ fontSize: '18px' }}>
          <span role="img" aria-label="wave">👋</span> Get an instant price right in chat
        </div>
      </section>

      {/* CHAT SECTION */}
      <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        {children}
      </main>

      {/* TESTIMONIALS */}
      <testimonialbar />

      {/* IMAGE 1 */}
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Image
          src="/17029ECA-FD4F-4F7C-A085-91BBF0DFDFFB.png"
          alt="Lifestyle Image"
          width={1200}
          height={600}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>

      {/* IMAGE 2 ON DARK BACKGROUND */}
      <div style={{ backgroundColor: '#111', padding: '40px 0', textAlign: 'center' }}>
        <Image
          src="/7D69579A-E413-48C9-AEF6-EDF9E30A2ACC.png"
          alt="Team or Call-to-Action"
          width={1200}
          height={600}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>

      {/* FOOTER */}
      <footer />
    </div>
  );
}
