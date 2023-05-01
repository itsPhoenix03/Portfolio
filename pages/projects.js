import AnimatedText from "@/src/components/AnimatedText";
import { GithubIcon } from "@/src/components/Icons";
import Layout from "@/src/components/Layout";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import TransitionsEffects from "@/src/components/TransitionsEffects";

const TheSocialScoop = "../public/Images/Projects/TheSocialScoop.PNG";
const Gericht = "../public/Images/Projects/Gericht.PNG";
const ShowFinder = "../public/Images/Projects/ShowFinder.PNG";
const BloggerJs = "../public/Images/Projects/BloggerJs.PNG";
const TrakerTask = "../public/Images/Projects/TrakerTask.PNG";
const Connecting = "../public/Images/Projects/Connecting.PNG";

const FramerImage = motion(Image);

const FeauredProject = ({ type, title, img, summary, link, github }) => {
  return (
    <article
      className="relative w-full p-6 flex items-center justify-between rounded-2xl border border-solid border-dark bg-light dark:border-light dark:bg-dark shadow-2xl
      lg:flex-col lg:p-8 sm:p-3 xs:rounded-xl
    "
    >
      <div
        className="absolute top-0 -right-3 -z-10 w-[101%] h-[103%] rounded-[2rem] rounded-br-2xl bg-dark dark:bg-light
      xs:-right-2 sm:h-[102%] xs:w-full xs:h-[101%] xs:rounded-[1rem]
      "
      />

      <Link
        href={link}
        target="_blank"
        className="w-1/2 cursor-pointer overflow-hidden rounded-2xl lg:w-full"
      >
        <FramerImage
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          src={img}
          alt={title}
          className="w-full h-auto"
          priority
          sizes="
                  (max-width: 728px) 100vw
                  (max-width: 1200px) 50vw
                  50vw
                "
        />
      </Link>

      <div className="w-1/2 flex flex-col items-start justify-between pl-6 lg:w-full lg:pl-0 lg:pt-6">
        <span className="text-primary dark:text-primaryDark font-medium text-xl xs:text-sm">
          {type}
        </span>
        <Link
          href={link}
          target="_blank"
          className="hover:underline underline-offset-2"
        >
          <h2 className="my-2 w-full text-left text-3xl font-bold text-dark dark:text-light sm:text-2xl">
            {title}
          </h2>
        </Link>

        <p className="my-2 font-medium text-dark/75 dark:text-light/75 lg:text-sm">
          {summary}
        </p>
        <div className="mt-2 flex items-center dark:text-light sm:w-full sm:justify-between">
          <Link href={github} className="w-10 xxs:w-6">
            <GithubIcon />
          </Link>
          <Link
            href={link}
            className="ml-4 p-2 px-6 rounded-lg font-semibold bg-dark text-light dark:bg-light dark:text-dark sm:px-4 sm:text-base"
          >
            Visit Project
          </Link>
        </div>
      </div>
    </article>
  );
};

const Project = ({ title, img, github, link }) => {
  return (
    <article
      className="relative w-full p-6 flex flex-col items-center justify-between rounded-2xl border border-solid border-dark bg-light dark:border-light dark:bg-dark shadow-2xl
    sm:p-3
    "
    >
      <div
        className="absolute top-0 -right-3 -z-10 w-[102%] h-[103%] rounded-[2rem] rounded-br-2xl bg-dark dark:bg-light
      md:-right-2 md:w-[101%] xs:h-[101%] xs:rounded-[1rem]
      "
      />

      <Link
        href={link}
        target="_blank"
        className="w-full cursor-pointer overflow-hidden rounded-2xl"
      >
        <FramerImage
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          src={img}
          alt={title}
          className="w-full h-auto"
        />
      </Link>

      <div className="w-full mt-2 flex flex-col items-start justify-between">
        <Link
          href={link}
          target="_blank"
          className="hover:underline underline-offset-2"
        >
          <h2 className="my-2 w-full text-left text-3xl font-bold text-dark dark:text-light lg:text-2xl">
            {title}
          </h2>
        </Link>

        <div className="w-full mt-2 flex items-center justify-between dark:text-light">
          <Link href={github} className="w-10 xxs:w-6">
            <GithubIcon />
          </Link>
          <Link
            href={link}
            className="p-2 px-6 rounded-lg font-semibold bg-dark text-light dark:bg-light dark:text-dark md:text-base"
          >
            Visit
          </Link>
        </div>
      </div>
    </article>
  );
};

const projects = () => {
  return (
    <>
      <Head>
        <title>Shreyas | Projects</title>
        <meta
          name="description"
          content="These are my Projects build using my WebDev Skills!"
        />
      </Head>

      <TransitionsEffects />

      <main className="w-full mb-16 flex flex-col items-center justify-center">
        <Layout className="pt-16">
          <AnimatedText
            text="Imagination Trumps Knowledge!"
            className="pb-2 lg:!text-6xl md:!text-5xl sm:!text-4xl"
          />

          <div className="grid grid-cols-12 gap-24 my-16 xl:gap-x-16 lg:gap-x-8 md:gap-y-24 sm:gap-x-0">
            <div className="col-span-12">
              <FeauredProject
                type="Featured Project"
                title={`The Social Scoop`}
                img={TheSocialScoop}
                summary={
                  "This is a Modern Social Media Web Application which provides all te nessasary funtions of a soical media media application. With a minimal design, has a option for 'Dark' & 'Light' Themes. It use the timeline for fetching posts of the users followers. The passwords & messages are been enceypted."
                }
                github={"https://github.com/itsAbh15hek/TheSocialScoop"}
                link={"https://social-scoop.netlify.app/"}
              />
            </div>

            <div className="col-span-6 sm:col-span-12">
              <Project
                title={"Gericht Restaurant"}
                img={Gericht}
                github={
                  "https://github.com/itsPhoenix03/Gericht-Restaurant-Landing-Page"
                }
                link={"https://gericht-restaurant-sam03.netlify.app/"}
              />
            </div>
            <div className="col-span-6 sm:col-span-12">
              <Project
                title={"Tracker Task"}
                img={TrakerTask}
                github={"https://github.com/itsPhoenix03/Todo-List-TS"}
                link={"https://traker-task.netlify.app/"}
              />
            </div>

            <div className="col-span-12">
              <FeauredProject
                type="Featured Project"
                title={`BloggerJS`}
                img={BloggerJs}
                summary={
                  "This is a Full Stack MERN website for blogging. A user can also compose and edit the blogs but after a registeration or login procedure. Users can also upload image for the blogs and also update their profile picture, name, email and passwords. The passwords are been stored in the encrypted form in the database."
                }
                github={"https://github.com/itsPhoenix03/BloggerJS"}
                link={"https://bloggerjs.netlify.app/#/"}
              />
            </div>

            <div className="col-span-6 sm:col-span-12">
              <Project
                title={"Show Finder"}
                img={ShowFinder}
                github={"https://github.com/itsPhoenix03/Show-Finder"}
                link={"https://show-finder-sam03.netlify.app/"}
              />
            </div>
            <div className="col-span-6 sm:col-span-12">
              <Project
                title={"Connecting"}
                img={Connecting}
                github={"https://github.com/itsPhoenix03/Chat-Application"}
                link={"https://chat-web-app-8dd66.web.app/"}
              />
            </div>
          </div>
        </Layout>
      </main>
    </>
  );
};

export default projects;
