
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatUI from '../components/ChatUI';
import TestimonialBar from '../components/TestimonialBar';

export default function Home() {
  return (
    <div style={{ fontFamily: '"Inter", sans-serif', backgroundColor: '#f5f8fc' }}>
      <Head>
        <title>Trust Moving Co</title>
        <meta name="description" content="Get your real move estimate instantly in chat." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header with video and logo */}
      <Header />

      {/* Floating arrow visual */}
      <div style={{ textAlign: 'center', marginTop: '8px' }}>
        <img src="/arrow-down.svg" alt="Scroll down" style={{ height: '28px' }} />
      </div>

      {/* Chat container */}
      <div style={{
        backgroundColor: "#fff",
        maxWidth: "100%",
        margin: "0 auto",
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        padding: "0",
        overflow: "hidden"
      }}>
        <div style={{
          backgroundColor: "#1e70ff",
          height: "6px",
          width: "100%",
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px"
        }} />
        <div style={{ padding: "16px" }}>
          <ChatUI />
        </div>
      </div>

      {/* Trust badge */}
      <div style={{ width: "100%", marginTop: "40px", marginBottom: "40px" }}>
        <img src="/Movingcompany2.png" alt="Trust Badges" style={{ width: "100%", height: "auto" }} />
      </div>

      {/* Testimonials */}
      <div style={{ marginBottom: "40px" }}>
        <TestimonialBar />
      </div>

      {/* How it works */}
      <div style={{ textAlign: "center", marginBottom: "0" }}>
        <img src="/17029ECA-FD4F-4F7C-A085-91BBF0DFDFFB.png" alt="How It Works" style={{ width: "100%", maxWidth: "900px" }} />
      </div>

      {/* Final image */}
      <div style={{ backgroundColor: "#111", padding: "40px 0", textAlign: "center" }}>
        <img src="/7D69579A-E413-48C9-AEF6-EDF9E30A2ACC.png" alt="Final Info" style={{ width: "100%", maxWidth: "900px" }} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
