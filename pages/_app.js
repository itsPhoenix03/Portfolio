import Footer from "@/src/components/Footer";
import Navbar from "@/src/components/Navbar";
import "@/styles/globals.css";
import { AnimatePresence } from "framer-motion";
import { Montserrat } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-mont",
});

export default function App({ Component, pageProps }) {
  const { asPath } = useRouter();
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="/images/pixton-avatar-headshot.png"
          type="image/png"
          sizes="16x16"
        />
      </Head>
      <main
        className={`${montserrat.variable} font-mont bg-light dark:bg-dark min-h-screen w-full`}
      >
        <Navbar />
        <AnimatePresence mode="wait">
          <Component key={asPath} {...pageProps} />
        </AnimatePresence>
        <Footer />
      </main>
    </>
  );
}
