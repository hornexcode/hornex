import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className="scroll-smooth">
      <Head />
      <script src="http://localhost:8097"></script>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
