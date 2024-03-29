import { motion, useScroll } from "framer-motion";
import React, { useRef } from "react";
import LiIcons from "./LiIcons";

const Details = ({ type, time, place, info }) => {
  const liRef = useRef(null);
  const wordArr = type.split(" ");
  const firstWord = wordArr.shift(0);

  return (
    <li
      ref={liRef}
      className="my-8 first:mt-0 last:mb-0 w-[60%] mx-auto flex flex-col items-center justify-between md:w-[80%]"
    >
      <LiIcons reference={liRef} />
      <motion.div
        initial={{ y: 50 }}
        whileInView={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <h3 className="capitalize font-bold text-3xl sm:text-xl xs:text-lg">
          <span className="text-primary dark:text-primaryDark capitalize">
            {firstWord}
          </span>
          &nbsp;{wordArr.join(" ")}
        </h3>

        <span className="capitalize font-medium text-dark/75 dark:text-light/75 sm:text-sm">
          {time} | {place}
        </span>

        <p className="font-medium w-full sm:text-sm xxs:text-xs">{info}</p>
      </motion.div>
    </li>
  );
};

const Education = () => {
  const lineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ["start end", "center start"],
  });

  return (
    <div className="my-56">
      <h2 className="font-bold text-8xl mb-32 w-full text-center xl:text-7xl md:text-6xl sm:text-5xl">
        Education
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
            type="Master's of Computer Application"
            time="2022-2024"
            place={`Pondicherry University`}
            info="A course including the deep learning of Web Development, Database Management Systems, Artificial Intellegence, Data Structures and Algorithms with a sprinkle of Understanding Managerial Skills and sharping Communicaition Skills."
          />
          <Details
            type="Bachelor's of Computer Application"
            time="2019-2022"
            place={`University of Lucknow`}
            info="A course dealing with the introduction about the different areas of Cryptography, Networking, Data Mining, UNIX and Oprating Systems and Management Information Systems and Managerial Concept's."
          />
          <Details
            type="Intermidate (Physics + Chemistry + Mathematics + Computer Science)"
            time="2018-2019"
            place={`Central Academy`}
            info="The course build for understaing the concepts of Physics, Chemistry and Mathematics including with the understanding and working of Computer Sciences and Concepts."
          />
          <Details
            type="High School"
            time="2017-2018"
            place={`Central Academy`}
            info="Basics of General Studies including subjects like Science, Social Science, Mathematics and different Language Subjects."
          />
        </ul>
      </div>
    </div>
  );
};

export default Education;
