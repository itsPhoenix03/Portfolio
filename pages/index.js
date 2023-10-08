import Layout from "@/src/components/Layout";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import AnimatedText from "@/src/components/AnimatedText";
import { LinkArrow } from "@/src/components/Icons";
import lightBulb from "../public/lightbulb.svg";
import TransitionsEffects from "@/src/components/TransitionsEffects";

// import profilePicture from "../public/images/pixton-avatar-full-body.png";
import profilePicture from "../public/images/mainPageImage.png";

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
            <div className="absolute -top-[10rem] lg:top-[5rem] md:top-[0rem] -left-56 lg:-left-20 md:-left-[1.5rem] xs:-top-[29rem] xs:left-auto xxs:-top-[28rem] sm:w-[100%] sm:h-[100%]">
              <Image
                src={profilePicture}
                alt="Shreyas Misra"
                className="w-full h-full object-contain"
                priority
                sizes="
                  (max-width: 728px) 100vw
                  (max-width: 1200px) 50vw
                  50vw
                "
              />
            </div>

            <div className="w-1/4"></div>

            <div className="w-[65%] lg:w-[60%] flex flex-col item-center self-center z-10 md:w-[100%]">
              <AnimatedText
                text="Turning Vision Into Reality With Code And Design."
                className="!text-7xl py-1 text-left 
                  xl:!text-8xl lg:!text-6xl md:!text-5xl sm:!text-4xl sm:text-center
                "
              />

              <p className="my-4 text-base font-medium lg:text-sm xxs:text-xs">
                Hi, I&#39;m{" "}
                <span className="text-primary dark:text-primaryDark">
                  Shreyas Misra
                </span>
                , a Fullstack Developer with a passion for creating beautiful,
                responsive, and user-friendly web applications. I have been
                working with MERN technologies for over a year now, and I am
                constantly learning and expanding my skills to stay up-to-date
                with the latest web development trends.
              </p>
              <p className="my-4 text-base font-medium lg:text-sm xxs:text-xs">
                As a skilled full-stack developer, I am dedicated to turning
                ideas into innovative web applications. Explore my latest
                projects and skills, showcasing my expertise in React.js and web
                development.
              </p>

              <div className="flex item-center self-start mt-2 xs:w-full xs:justify-evenly sm:flex-col sm:gap-4">
                <Link
                  href="/Resume.pdf"
                  target={"_blank"}
                  className="flex items-center justify-center gap-2 bg-dark text-light dark:bg-light dark:text-dark p-2 px-6 rounded-lg text-lg font-semibold border-2 border-solid border-transparent hover:bg-light hover:text-dark hover:border-dark dark:hover:bg-dark dark:hover:text-light dark:hover:border-light
                    md:px-4 md:text-base xxs:text-xs sm:py-3
                  "
                  download={true}
                >
                  Resume{" "}
                  {/* <Link id="overview" href="/Resume.pdf" target="_blank"> */}
                  <LinkArrow className="w-6 sm:w-4 xxs:" />
                  {/* </Link> */}
                </Link>
                <Link
                  href="mailto:shreyas.misra03@gmail.com"
                  target={"_blank"}
                  className="ml-4 p-2 px-6 capitalize border-2 border-solid border-dark text-dark rounded-lg text-lg font-semibold dark:border-light dark:text-light
                  md:px-4 md:text-base xxs:text-xs sm:ml-0 sm:py-3
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
         group lg:w-20 lg:-bottom-[10rem] md:w-14 md:-bottom-[6rem] xs:hidden"
        >
          <Image
            src={lightBulb}
            alt="light-bulb"
            className="w-full h-auto rounded-[5rem] dark:animate-faultyBulb hover:drop-shadow-[0px_1px_100px_#eacf70]  md:hover:shadow-none"
          />
        </div>
      </main>
    </>
  );
}
