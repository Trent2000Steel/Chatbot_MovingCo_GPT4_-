import ChatBox from '../components/chatbox';
import Footer from '../components/footer';
import IntroMessage from '../components/intromessage';
import TestimonialBar from '../components/testimonialbar';

export default function Home() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#ffffff' }}>
      <header style={{ textAlign: 'center', padding: '10px 0' }}>
        <img
          src="/Header.png"
          alt="MovingCo Header"
          style={{ width: '100%', height: 'auto', maxWidth: '600px', display: 'block', margin: '0 auto' }}
        />
      </header>

      <IntroMessage />

      <ChatBox />

      <TestimonialBar />

      <Footer />
    </div>
  );
}
