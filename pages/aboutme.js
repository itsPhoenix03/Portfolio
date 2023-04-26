import AnimatedText from "@/src/components/AnimatedText";
import Layout from "@/src/components/Layout";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useRef } from "react";

import profilePicture from "../public/Images/contact-avatar.png";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import AboutSectionSkills from "@/src/components/AboutSectionSkills";
import Timeline from "@/src/components/Timeline";
import Education from "@/src/components/Education";

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

      <main className="flex w-full flex-col items-center justify-center">
        <Layout className="pt-16">
          <AnimatedText text="Passion Fuels Purpose!" className="mb-24" />

          <div className="grid w-full grid-cols-8 gap-16">
            <div className="col-span-3 flex flex-col items-start justify-start">
              <h2 className="mb-4 text-2xl font-bold text-dark/75 uppercase">
                Biography
              </h2>

              <p className="font-medium">
                Hi, I&#39;m Shreyas, a Fullstack Web Developer with a passion
                for creating beautiful, functional, and user-centered digital
                experiences. I am always looking for new and innovative ways to
                bring my clients&#39; visions to life.
              </p>

              <p className="font-medium my-6">
                I believe that design is about more than just making things look
                pretty – it&#39;s about solving problems and creating intuitive,
                enjoyable experiences for users.
              </p>

              <p className="font-medium">
                Whether I&#39;m working on any website, I bring my commitment to
                design excellence and user-centered thinking to every project I
                work on. I look forward to the opportunity to bring my skills
                and passion to your next project.
              </p>
            </div>

            <div className="col-span-3 relative h-[35rem] rounded-2xl border-2 border-solid border-dark bg-light p-8">
              <div className="absolute top-0 -right-3 -z-10 w-[102%] h-[103%] rounded-[2rem] bg-dark" />

              <Image
                src={profilePicture}
                alt="My pic using a comic filter"
                className="object-contain h-[30rem]"
              />
            </div>

            <div className="col-span-2 flex flex-col items-end justify-between">
              <div className="flex flex-col items-end justify-center">
                <span className="inline-block text-7xl font-bold">
                  <AnimatedNumbers value={18} />+
                </span>

                <h2 className="text-lg font-medium capitalize text-dark/75 text-right">
                  Months Working with relative technologies
                </h2>
              </div>

              <div className="flex flex-col items-end justify-center">
                <span className="inline-block text-7xl font-bold">
                  <AnimatedNumbers value={5} />+
                </span>

                <h2 className="text-lg font-medium capitalize text-dark/75 text-right">
                  Major Project&#39;s Completed
                </h2>
              </div>

              <div className="flex flex-col items-end justify-center">
                <span className="inline-block text-7xl font-bold">
                  <AnimatedNumbers value={7} />+
                </span>

                <h2 className="text-lg font-medium capitalize text-dark/75 text-right">
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
