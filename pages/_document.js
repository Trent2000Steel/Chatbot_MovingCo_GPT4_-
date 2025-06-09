import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-JC5ZTSZED2"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-JC5ZTSZED2');
            `,
          }}
        />

        {/* Cookie Consent */}
        <script src="https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener("load", function(){
                window.cookieconsent.initialise({
                  palette: {
                    popup: { background: "#f0f2f5", text: "#333" },
                    button: { background: "#007bff", text: "#fff" }
                  },
                  theme: "classic",
                  position: "bottom",
                  content: {
                    message: "We use cookies to analyze traffic and deliver our services.",
                    dismiss: "OK, got it!",
                    link: "Learn more",
                    href: "/privacy"
                  }
                });
              });
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
