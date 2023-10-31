import AnimatedText from "@/src/components/AnimatedText";
import Layout from "@/src/components/Layout";
import Head from "next/head";
import React from "react";
import { motion } from "framer-motion";
import TransitionsEffects from "@/src/components/TransitionsEffects";

const Card = ({ wrapperObject }) => {
  // Desrtucturing the recevied object
  const { heading, dataArray } = wrapperObject;

  return (
    <motion.div
      initial={{
        y: 150,
        opacity: 0,
        skewX: 5,
      }}
      animate={{
        y: 0,
        opacity: 1,
        skewX: 0,
        transition: { delay: 1, duration: 1 },
      }}
      viewport={{ once: true }}
      className="row-span-1 mb-auto "
    >
      <div className="flex flex-col justify-start items-start gap-2">
        <h2 className="flex justify-start items-center gap-2 text-2xl font-bold xxs:text-xl">
          <span className="bg-gradient-to-t from-primary to-transparent dark:from-primaryDark inline-block text-transparent bg-clip-text">
            &#35;
          </span>
          <span>{heading}</span>
        </h2>

        <ul
          className="relative w-full px-6 py-3 font-normal text-md xxs:text-xs text-dark/75 dark:text-light/75 grid grid-cols-4 gap-4 before:absolute before:-top-3 before:left-2 before:w-[1px] before:h-[150%] before:bg-gradient-to-b before:from-primary before:to-light/75 dark:before:bg-gradient-to-b dark:before:from-primaryDark dark:before:to-dark/75 sm:before:h-[100%]
        "
        >
          {dataArray.map((data) => (
            <li
              className="row-span-1 sm:col-span-full sm:self-center"
              key={dataArray.findIndex((d) => d === data)}
            >
              {data}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

const skills = () => {
  // Data for the Card Component
  const developmentSkills = {
    heading: "Development Skills",
    dataArray: [
      "ReactJs, NextJs, Tailwind CSS, Styled Components, Framer Motion, UI/UX, Responsive Design's",
      "TypeScript, JavaScript, HTML5, CSS3",
      "NodeJs, Express, MongoDb, Mongoose, Prisma, Rest API's, Firebase",
      "Git & Github, NPM, Postman, Visual Studio Code, Canva, Figma",
    ],
  };

  const softSkills = {
    heading: "Soft Skills",
    dataArray: [
      "Active Listener, Try to Think Out of the Box Solutions for Complex Problems",
      "BrainStroming, Creativity, Focused on Objectives, Calm and Understanding",
      "Try to Deal with Complex Situations without losing Temper",
    ],
  };

  const languageProficiency = {
    heading: "Language Proficiency",
    dataArray: [
      "English (Professional Level)",
      "Hindi (Professional Level and Native Language)",
    ],
  };

  return (
    <>
      <Head>
        <title>Shreyas | Skills</title>
        <meta
          name="description"
          content="These are my acquired development Skills!"
        />
      </Head>

      <TransitionsEffects />

      <main className="w-full flex flex-col items-center justify-between mb-16">
        <Layout className="pt-16 lg:pt-10">
          <AnimatedText
            text={"Dynamic Arsenal of Skills"}
            className="pb-2 lg:text-6xl md:text-5xl sm:text-4xl"
          />

          <div className="mt-16 w-full h-auto grid grid-cols-1 gap-20 text-dark dark:text-light">
            <Card wrapperObject={developmentSkills} />

            <Card wrapperObject={softSkills} />

            <Card wrapperObject={languageProficiency} />
          </div>
        </Layout>
      </main>
    </>
  );
};

export default skills;
