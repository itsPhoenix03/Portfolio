import AnimatedText from "@/src/components/AnimatedText";
import { GithubIcon } from "@/src/components/Icons";
import Layout from "@/src/components/Layout";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import TheSocialScoop from "../public/Images/Projects/TheSocialScoop.PNG";
import Gericht from "../public/Images/Projects/Gericht.PNG";
import ShowFinder from "../public/Images/Projects/ShowFinder.PNG";
import BloggerJs from "../public/Images/Projects/BloggerJs.PNG";
import TrakerTask from "../public/Images/Projects/TrakerTask.PNG";
import Connecting from "../public/Images/Projects/Connecting.PNG";
import { motion } from "framer-motion";

const FramerImage = motion(Image);

const FeauredProject = ({ type, title, img, summary, link, github }) => {
  return (
    <article className="relative w-full p-6 flex items-center justify-between rounded-2xl border border-solid border-dark bg-light shadow-2xl">
      <div className="absolute top-0 -right-3 -z-10 w-[101%] h-[103%] rounded-[2rem] rounded-br-2xl bg-dark" />

      <Link
        href={link}
        target="_blank"
        className="w-1/2 cursor-pointer overflow-hidden rounded-2xl"
      >
        <FramerImage
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          src={img}
          alt={title}
          className="w-full h-auto"
        />
      </Link>

      <div className="w-1/2 flex flex-col items-start justify-between pl-6">
        <span className="text-primary font-medium text-xl">{type}</span>
        <Link
          href={link}
          target="_blank"
          className="hover:underline underline-offset-2"
        >
          <h2 className="my-2 w-full text-left text-3xl font-bold text-dark">
            {title}
          </h2>
        </Link>

        <p className="my-2 font-medium text-dark/75">{summary}</p>
        <div className="mt-2 flex items-center">
          <Link href={github} className="w-10">
            <GithubIcon />
          </Link>
          <Link
            href={link}
            className="ml-4 p-2 px-6 rounded-lg font-semibold bg-dark text-light"
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
    <article className="relative w-full p-6 flex flex-col items-center justify-between rounded-2xl border border-solid border-dark bg-light shadow-2xl">
      <div className="absolute top-0 -right-3 -z-10 w-[102%] h-[103%] rounded-[2rem] rounded-br-2xl bg-dark" />

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
          <h2 className="my-2 w-full text-left text-3xl font-bold text-dark">
            {title}
          </h2>
        </Link>

        <div className="w-full mt-2 flex items-center justify-between">
          <Link href={github} className="w-10">
            <GithubIcon />
          </Link>
          <Link
            href={link}
            className="p-2 px-6 rounded-lg font-semibold bg-dark text-light"
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
        <title>Projects</title>
        <meta name="description" content="These are my Projects!" />
      </Head>

      <main className="w-full mb-16 flex flex-col items-center justify-center">
        <Layout className="pt-16">
          <AnimatedText text="Imagination Trumps Knowledge!" className="pb-2" />

          <div className="grid grid-cols-12 gap-24 my-16">
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

            <div className="col-span-6">
              <Project
                title={"Gericht Restaurant"}
                img={Gericht}
                github={
                  "https://github.com/itsPhoenix03/Gericht-Restaurant-Landing-Page"
                }
                link={"https://gericht-restaurant-sam03.netlify.app/"}
              />
            </div>
            <div className="col-span-6">
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

            <div className="col-span-6">
              <Project
                title={"Show Finder"}
                img={ShowFinder}
                github={"https://github.com/itsPhoenix03/Show-Finder"}
                link={"https://show-finder-sam03.netlify.app/"}
              />
            </div>
            <div className="col-span-6">
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
