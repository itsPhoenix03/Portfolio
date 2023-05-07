import Layout from "@/src/components/Layout";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import AnimatedText from "@/src/components/AnimatedText";
import { LinkArrow } from "@/src/components/Icons";
import lightBulb from "../public/lightbulb.svg";
import TransitionsEffects from "@/src/components/TransitionsEffects";

import profilePicture from "../public/images/pixton-avatar-full-body.png";

export default function Home() {
  return (
    <>
      <Head>
        <title>Shreyas Misra</title>
        <meta name="description" content="Welcome to my portfolio website!" />
      </Head>

      <TransitionsEffects />

      <main className="flex item-center text-dark min-h-screen dark:text-light">
        <Layout className="xs:mt-[20rem] sm:mb-12">
          <div className="relative flex justify-between items-center w-full sm:text-center xs:flex-col">
            <div className="absolute -top-[10rem] lg:-top-[5rem] md:top-[0rem] left-0 lg:-left-20 md:-left-[1.5rem] xs:-top-[23rem] xs:left-auto">
              <Image
                src={profilePicture}
                alt="Shreyas Misra"
                className="w-full h-[45rem] md:h-[23rem]"
                priority
                sizes="
                  (max-width: 728px) 100vw
                  (max-width: 1200px) 50vw
                  50vw
                "
              />
            </div>

            <div className="w-1/4"></div>

            <div className="w-[65%] flex flex-col item-center self-center z-10 md:w-[100%]">
              <AnimatedText
                text="Turning Vision Into Reality With Code And Design."
                className="!text-7xl py-1 text-left 
                  xl:!text-8xl lg:!text-6xl md:!text-5xl sm:!text-4xl sm:text-center
                "
              />

              <p className="my-4 text-base font-medium lg:text-sm">
                Hi, I&#39;m Shreyas Misra, a Fullstack Developer with a passion
                for creating beautiful, responsive, and user-friendly web
                applications. I have been working with MERN technologies for
                over a year now, and I am constantly learning and expanding my
                skills to stay up-to-date with the latest web development
                trends.
              </p>
              <p className="my-4 text-base font-medium lg:text-sm">
                As a skilled full-stack developer, I am dedicated to turning
                ideas into innovative web applications. Explore my latest
                projects and articles, showcasing my expertise in React.js and
                web development.
              </p>

              <div className="flex item-center self-start mt-2 xs:w-full xs:justify-evenly">
                <Link
                  href="/Resume.pdf"
                  target={"_blank"}
                  className="flex items-center bg-dark text-light dark:bg-light dark:text-dark p-2 px-6 rounded-lg text-lg font-semibold border-2 border-solid border-transparent hover:bg-light hover:text-dark hover:border-dark dark:hover:bg-dark dark:hover:text-light dark:hover:border-light
                    md:px-4 md:text-base
                  "
                  download={true}
                >
                  Resume{" "}
                  {/* <Link id="overview" href="/Resume.pdf" target="_blank"> */}
                  <LinkArrow className="w-6 ml-1 sm:text-sm" />
                  {/* </Link> */}
                </Link>
                <Link
                  href="mailto:shreyas.misra03@gmail.com"
                  target={"_blank"}
                  className="ml-4 p-2 px-6 capitalize border-2 border-solid border-dark text-dark rounded-lg text-lg font-semibold dark:border-light dark:text-light
                  md:px-4 md:text-base
                  "
                >
                  Contact Me
                </Link>
              </div>
            </div>
          </div>
        </Layout>

        <div
          className="absolute right-12 -bottom-16 inline-block w-28 -rotate-[32deg]  rounded-[5rem]
        hover:shadow-[0px_-80px_90px_-25px_#eacf70] group lg:w-20 lg:-bottom-[10rem] md:w-14 md:-bottom-[6rem] xs:hidden"
        >
          <Image
            src={lightBulb}
            alt="light-bulb"
            className="w-full h-auto rounded-[5rem] hover:shadow-[inset_0px_80px_102px_-95px_#eacf70] md:hover:shadow-none"
          />
        </div>
      </main>
    </>
  );
}
