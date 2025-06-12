
import Head from "next/head";
import ChatFlow from "../components/ChatFlow_Master";
import Footer from "../components/footer";
import TestimonialBar from "../components/testimonialbar";

export default function Home() {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', margin: 0, padding: 0, backgroundColor: '#f9fbff' }}>
      <Head>
        <title>MovingCo | Get a Real Quote Now</title>
        <meta name="description" content="No forms, no waiting. Get a real long-distance moving quote now in chat." />
      </Head>

      {/* Hero video and overlay */}
      <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
        <video
          src="/videos/Hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 0
          }}
        />
        <img
          src="/Headeroverlay.PNG"
          alt="MovingCo Overlay"
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: "100%",
            height: "auto",
            display: "block",
            margin: "0 auto",
            paddingTop: "60px"
          }}
        />
      </div>

      {/* Trust message */}
      <div style={{
        textAlign: "center",
        fontSize: "14px",
        color: "#888",
        marginTop: "12px",
        marginBottom: "8px"
      }}>
        Trusted by families in all 50 states.
      </div>

      {/* Intro message */}
      <div style={{
        textAlign: "center",
        fontSize: "18px",
        margin: "0 auto 20px auto",
        padding: "0 20px",
        maxWidth: "500px"
      }}>
        <span role="img" aria-label="wave">👋</span> Ready to get your price? Just answer a few quick questions.
      </div>

      {/* Chat container with light gray background */}
      <div style={{ backgroundColor: "#f2f4f7", padding: "40px 12px" }}>
        <main style={{
          maxWidth: "800px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          padding: "40px 12px"
        }}>
          <div style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)"
          }}>
            <div style={{
              backgroundColor: "#1e70ff",
              height: "8px",
              width: "100%",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
              marginBottom: "16px"
            }} />
            <ChatFlow />
          </div>
        </main>
      </div>

      {/* Full-width trust badge image */}
      <div style={{ width: "100%", marginTop: "40px", marginBottom: "40px" }}>
        <img src="/Movingcompany2.png" alt="Trust Badges" style={{ width: "100%", height: "auto" }} />
      </div>

      {/* Testimonials */}
      <div style={{ marginBottom: "40px" }}>
        <TestimonialBar />
      </div>

      {/* How it works images */}
      <div style={{ textAlign: "center", marginBottom: "0" }}>
        <img src="/17029ECA-FD4F-4F7C-A085-91BBF0DFDFFB.png" alt="How It Works" style={{ width: "100%", maxWidth: "900px" }} />
      </div>

      {/* Final image with soft black background */}
      <div style={{ backgroundColor: "#111", padding: "40px 0", textAlign: "center" }}>
        <img src="/7D69579A-E413-48C9-AEF6-EDF9E30A2ACC.png" alt="Final Info" style={{ width: "100%", maxWidth: "900px" }} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
