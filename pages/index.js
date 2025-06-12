
import Head from "next/head";
import Chat from "../components/ChatBox"; // <-- This is your main orchestrator using ChatUI and the flow logic

export default function Home() {
  return (
    <div style={{
      background: "linear-gradient(to bottom right, #f9fbff, #eef2f7)",
      minHeight: "100vh",
      padding: "40px 20px",
      fontFamily: '"Inter", sans-serif',
    }}>
      <Head>
        <title>MovingCo | Get a Real Quote Now</title>
        <meta name="description" content="No forms, no waiting. Get a real long-distance moving quote now in chat." />
      </Head>
      <main style={{
        maxWidth: "800px",
        margin: "0 auto",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        padding: "32px",
      }}>
        <h1 style={{
          fontSize: "28px",
          marginBottom: "20px",
          color: "#1e70ff",
        }}>
          Welcome to MovingCo
        </h1>
        <Chat />
      </main>
    </div>
  );
}
