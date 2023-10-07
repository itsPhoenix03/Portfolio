import { motion, useScroll } from "framer-motion";
import React, { useRef } from "react";
import LiIcons from "./LiIcons";

const Details = ({ title, fromTime, toTime, desc }) => {
  const liRef = useRef(null);
  const wordArr = title.split(" ");
  const lastWord = wordArr.pop(wordArr.length - 1);

  return (
    <li
      ref={liRef}
      className="my-8 first:mt-0 last:mb-0 w-[80%] mx-auto flex flex-col items-center justify-between md:w-[80%] lg:mx-0"
    >
      <LiIcons reference={liRef} />
      <motion.div
        initial={{ y: 50 }}
        whileInView={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <h3 className="capitalize font-bold text-3xl sm:text-xl xs:text-lg">
          {wordArr.join(" ")}&nbsp;
          <span className="text-primary dark:text-primaryDark capitalize">
            {lastWord}
          </span>
        </h3>

        <span className="capitalize font-medium text-dark/75 dark:text-light/75 lg:text-sm sm:text-xs">
          {fromTime} - {toTime}
        </span>

        <p className="font-medium w-full lg:text-sm sm:text-xs">{desc}</p>
      </motion.div>
    </li>
  );
};

const Timeline = () => {
  const lineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ["start end", "center start"],
  });

  return (
    <div className="my-56">
      <h2 className="font-bold text-8xl mb-32 w-full text-center xl:text-7xl md:text-6xl sm:text-5xl">
        Mastering the Craft
      </h2>

      <div className="w-[75%] mx-auto relative lg:w-[90%] md:w-full">
        <motion.div
          ref={lineRef}
          style={{ scaleY: scrollYProgress }}
          className="absolute left-9 top-0 w-[4px] h-full bg-dark dark:bg-light origin-top
          md:w-[2px] md:left-[20px] xs:left-[10px]
          "
        />

        <ul className="w-full flex flex-col items-center justify-between ml-4 xs:ml-2">
          <Details
            title="The Beginning of My Web Development Odyssey"
            fromTime="June(2020)"
            toTime="July(2020)"
            desc="I embarked on a journey to learn HTML and CSS. With the intention of building my own website, I spent hours every day poring over tutorials and practicing my coding skills. At first, the process was daunting, but with each passing day, I grew more confident in my abilities. Through trial and error, I learned how to create basic web pages and style them using CSS. By the end of the month, I had a solid foundation in these technologies and was excited to continue exploring the world of web development."
          />
          <Details
            title="From Novice to Ninja in ReactJs"
            fromTime="August(2021)"
            toTime="November(2021)"
            desc="In August 2021, I set out to learn ReactJS and spent months practicing and building small applications. Despite the challenges, I gained a deeper understanding of the library's capabilities and became more confident in my abilities. By November 2021, I had completed several projects. I was proud of my progress and excited to continue exploring the world of front-end web development with React as my tool of choice."
          />
          <Details
            title="Journeying through the Back-end"
            fromTime="December(2021)"
            toTime="February(2022)"
            desc="During winter 2021-2022, I delved into the world of back-end web development, learning NodeJS, ExpressJS, and MongoDB. Over three months, I built small projects, studied authentication, authorization, and security, and explored RESTful API creation. By February 2022, I had completed projects, and was excited to continue exploring the possibilities of back-end web development."
          />
          <Details
            title="Building Bridges through Code"
            fromTime="April(2022)"
            toTime="May(2022)"
            desc="In April and May 2022, I and a friend built a secure and engaging social media platform for our final year graduation project. We designed features such as chat, post sharing, and user profiles, incorporating a focus on user experience and privacy. Despite the challenges, we worked closely together, leveraging our strengths and complementing each other's weaknesses. Our hard work paid off, and we were proud to launch the platform to the public, learning invaluable lessons in teamwork, project management, and software development."
          />
          <Details
            title="Endless Horizons: Journey Through the Dynamic Seas of Web Development"
            fromTime="June(2022)"
            toTime="Present"
            desc="Since June 2022, I have been immersing myself in TypeScript, NextJS and other popular library's, which are popular frameworks in the web development industry. I have explored NextJs and it's benefits of static typing and server-side rendering, and practiced my skills by building small projects. Now, I continue to deepen my understanding of these technologies and apply them to real-world projects. This journey has taught me the importance of staying on top of the latest web development trends and investing time in learning new technologies."
          />
        </ul>
      </div>
    </div>
  );
};

export default Timeline;
