import AnimatedText from "@/src/components/AnimatedText";
import Layout from "@/src/components/Layout";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useRef } from "react";

import { useInView, useMotionValue, useSpring } from "framer-motion";
import AboutSectionSkills from "@/src/components/AboutSectionSkills";
import Timeline from "@/src/components/Timeline";
import Education from "@/src/components/Education";
import TransitionsEffects from "@/src/components/TransitionsEffects";

import profilePicture from "../public/images/contact-avatar.png";

const AnimatedNumbers = ({ value }) => {
  const spanRef = useRef(null);

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 3000 });
  const inView = useInView(spanRef, { once: true });

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  useEffect(() => {
    springValue.on("change", (latestValue) => {
      if (spanRef.current && latestValue.toFixed(0) <= value)
        spanRef.current.textContent = latestValue.toFixed(0);
    });
  }, [springValue, value]);

  return <span ref={spanRef}></span>;
};

const aboutme = () => {
  return (
    <>
      <Head>
        <title>About Me</title>
        <meta
          name="description"
          content="This is were you can know about me!"
        />
      </Head>

      <TransitionsEffects />

      <main className="flex w-full flex-col items-center justify-center dark:text-light">
        <Layout className="pt-16">
          <AnimatedText
            text="Passion Fuels Purpose!"
            className="mb-24 lg:!text-7xl md:!text-6xl sm:!text-5xl"
          />

          <div className="grid w-full grid-cols-8 gap-16 sm:gap-10">
            <div className="col-span-3 flex flex-col items-start justify-start xl:col-span-4 md:order-2 md:col-span-8">
              <h2 className="mb-4 text-2xl font-bold text-dark/75 dark:text-light/75 uppercase">
                Biography
              </h2>

              <p className="font-medium xs:text-sm">
                Hi, I&#39;m Shreyas, a Fullstack Web Developer with a passion
                for creating beautiful, functional, and user-centered digital
                experiences. I am always looking for new and innovative ways to
                bring my clients&#39; visions to life.
              </p>

              <p className="font-medium xs:text-sm my-6">
                I believe that design is about more than just making things look
                pretty – it&#39;s about solving problems and creating intuitive,
                enjoyable experiences for users.
              </p>

              <p className="font-medium xs:text-sm">
                Whether I&#39;m working on any website, I bring my commitment to
                design excellence and user-centered thinking to every project I
                work on. I look forward to the opportunity to bring my skills
                and passion to your next project.
              </p>
            </div>

            <div
              className="col-span-3 relative h-[35rem] rounded-2xl border-2 border-solid border-dark bg-light dark:border-light dark:bg-dark p-8 xs:px-2
            xl:col-span-4 md:order-1 md:col-span-8
            "
            >
              <div className="absolute top-0 -right-3 -z-10 w-[102%] h-[103%] rounded-[2rem] bg-dark dark:bg-light xxs:-right-1 xxs:h-[102%] xxs:rounded-[1.5rem]" />

              <Image
                src={profilePicture}
                alt="My pic using a comic filter"
                className="object-contain h-[30rem]"
                priority
                sizes="
                  (max-width: 728px) 100vw
                  (max-width: 1200px) 50vw
                  33vw
                "
              />
            </div>

            <div className="col-span-2 flex flex-col items-end justify-between xl:col-span-8 xl:flex-row xl:items-center md:order-3">
              <div className="flex flex-col items-end justify-center xl:items-center">
                <span className="inline-block text-7xl font-bold md:text-6xl sm:text-5xl xs:text-4xl">
                  <AnimatedNumbers value={18} />+
                </span>

                <h2
                  className="text-lg font-medium capitalize text-dark/75 text-right xl:text-center xl:text-base dark:text-light/75
                  sm:text-sm xs:text-xs
                "
                >
                  Months Working with relative technologies
                </h2>
              </div>

              <div className="flex flex-col items-end justify-center xl:items-center">
                <span className="inline-block text-7xl font-bold md:text-6xl sm:text-5xl xs:text-4xl">
                  <AnimatedNumbers value={5} />+
                </span>

                <h2 className="text-lg font-medium capitalize text-dark/75 text-right xl:text-center xl:text-base dark:text-light/75 sm:text-sm xs:text-xs">
                  Major Project&#39;s Completed
                </h2>
              </div>

              <div className="flex flex-col items-end justify-center xl:items-center">
                <span className="inline-block text-7xl font-bold md:text-6xl sm:text-5xl xs:text-4xl">
                  <AnimatedNumbers value={7} />+
                </span>

                <h2 className="text-lg font-medium capitalize text-dark/75 text-right xl:text-center xl:text-base dark:text-light/75 sm:text-sm xs:text-xs">
                  Combinations of Techstack&#39;s Used in that projects
                </h2>
              </div>
            </div>
          </div>

          <AboutSectionSkills />

          <Timeline />

          <Education />
        </Layout>
      </main>
    </>
  );
};

export default aboutme;
