import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const Skill = ({ name, x, y }) => {
  return (
    <motion.div
      className="absolute flex items-center justify-center rounded-full font-semibold bg-dark text-light py-3 px-6 shadow-dark cursor-default"
      whileHover={{ scale: 1.05 }}
      initial={{ x: 0, y: 0 }}
      whileInView={{ x, y }}
      transition={{ duration: 1.5 }}
    >
      {name}
    </motion.div>
  );
};

const AboutSectionSkills = () => {
  return (
    <>
      <h2 className="font-bold text-8xl mt-56 w-full text-center">Skills</h2>

      <div className="w-full h-screen relative flex items-center justify-center rounded-full bg-circularLight">
        <motion.div
          className="flex items-center justify-center rounded-full font-semibold bg-dark text-light p-8 shadow-dark cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          <Link href="/skills">Web</Link>
        </motion.div>

        <Skill name="ReactJs" x="-25vw" y="2vw" />
        <Skill name="JavaScript" x="-5vw" y="-10vw" />
        <Skill name="TypeScript" x="20vw" y="6vw" />
        <Skill name="NextJs" x="0vw" y="12vw" />
        <Skill name="CSS" x="-20vw" y="-15vw" />
        <Skill name="Tailwind CSS" x="15vw" y="-12vw" />
        <Skill name="HTML" x="32vw" y="5vw" />
        <Skill name="Styled Components" x="0vw" y="-20vw" />
        <Skill name="ExpressJs" x="-25vw" y="18vw" />
        <Skill name="NodeJs" x="18vw" y="18vw" />
      </div>
    </>
  );
};

export default AboutSectionSkills;
