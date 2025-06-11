
import ChatBox from '../components/chatbox';
import Footer from '../components/footer';
import IntroMessage from '../components/intromessage';
import TestimonialBar from '../components/testimonialbar';

export default function Home() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#ffffff' }}>
      {/* Hero Section with Background Video and Overlay */}
      <div style={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        textAlign: 'center',
      }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          type="video/mp4"
          src="/videos/Hero4.mp4"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -1,
            opacity: 0.6
          }}
        />

        <img
          src="/images/HeaderOverlay.png"
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

      <IntroMessage />

      <ChatBox />

      <TestimonialBar />

      <Footer />
    </div>
  );
}
