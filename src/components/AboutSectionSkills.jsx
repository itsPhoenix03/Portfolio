import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  CSSIcon,
  ExpressJsIcon,
  FigmaIcon,
  FirebaseIcon,
  FramerMotionIcon,
  HtmlIcon,
  JavaScriptIcon,
  MongoDbIcon,
  MongooseIcon,
  NextJsIcon,
  NodeJsIcon,
  NpmIcon,
  PrismaIcon,
  ReactIcon,
  ReactRouterDomIcon,
  ReduxIcon,
  StarIcon,
  StyledComponentIcon,
  TailwindCSSIcon,
  TypeScriptIcon,
} from "@/src/components/Icons";

const Skill = ({ name, icon: Icon, x, y }) => {
  return (
    <motion.div
      className="absolute flex items-center justify-center rounded-full font-semibold bg-transparent text-light dark:text-dark py-3 px-6 shadow-dark dark:shadow-light 
      cursor-default lg:py-2 lg:px-4 md:text-sm md:py-1.5 md:px-3 xs:bg-transparent xs:dark:bg-transparent xs:text-dark xs:dark:text-light xs:font-bold"
      whileHover={{ scale: 1.05 }}
      initial={{ x: 0, y: 0 }}
      whileInView={{ x, y, transition: { type: "spring", duration: 1.5 } }}
    >
      {((Icon && name) || (Icon && !name)) && (
        <Icon className="sm:w-8 sm:h-8" />
      )}
    </motion.div>
  );
};

const SkillMobileView = ({ name, icon: Icon, x, y }) => {
  return (
    <motion.div
      className="absolute flex items-center justify-center py-3 px-6"
      initial={{ x: 0, y: 0 }}
      whileInView={{
        x,
        y,
        transition: {
          type: "spring",
          duration: 1.5,
          stiffness: 50,
        },
      }}
      viewport={{ once: true }}
    >
      {((Icon && name) || (Icon && !name)) && <Icon className="w-fit h-fit" />}
    </motion.div>
  );
};

const AboutSectionSkills = () => {
  return (
    <>
      <h2 className="font-bold text-8xl mt-56 w-full text-center xl:text-7xl">
        Skills
      </h2>

      <div
        className="w-full h-screen relative flex items-center justify-center rounded-full bg-circularLight dark:bg-circularDark
      lg:h-[80vh] md:hidden xs:h-[50vh]
      lg:bg-circularLightLg dark:lg:bg-circularDarkLg
      md:bg-circularLightMd dark:md:bg-circularDarkMd
      sm:bg-circularLightSm dark:sm:bg-circularDarkSm
      "
      >
        <motion.div
          className="flex items-center justify-center rounded-full font-semibold bg-dark text-light dark:bg-light dark:text-dark p-8 shadow-dark dark:shadow-light cursor-pointer
          lg:p-6 md:p-4 xs-text-xs xs:p-2
          "
          whileHover={{ scale: 1.05 }}
        >
          <Link href="/skills">Web</Link>
        </motion.div>

        <Skill icon={ReactIcon} name="ReactJs" x="-25vw" y="2vw" />
        <Skill icon={JavaScriptIcon} name="JavaScript" x="-5vw" y="-10vw" />
        <Skill icon={TypeScriptIcon} name="TypeScript" x="20vw" y="6vw" />
        <Skill icon={NextJsIcon} name="NextJs" x="0vw" y="12vw" />
        <Skill icon={CSSIcon} name="CSS" x="-20vw" y="-15vw" />
        <Skill icon={TailwindCSSIcon} name="Tailwind CSS" x="15vw" y="-12vw" />
        <Skill icon={HtmlIcon} name="HTML" x="32vw" y="2vw" />
        <Skill icon={MongoDbIcon} name="MongoDb" x="0vw" y="-20vw" />
        <Skill icon={MongooseIcon} name="Mongoose" x="17vw" y="-20vw" />
        <Skill icon={ExpressJsIcon} name="ExpressJs" x="-25vw" y="18vw" />
        <Skill icon={NodeJsIcon} name="NodeJs" x="18vw" y="18vw" />
        <Skill icon={ReduxIcon} name="Redux" x="-34vw" y="-4vw" />
        <Skill icon={FirebaseIcon} name="Firebase" x="24vw" y="-9vw" />
        <Skill icon={NpmIcon} name="Npm" x="-8vw" y="5vw" />
        <Skill icon={FigmaIcon} name="Figma" x="38vw" y="-6vw" />
        <Skill
          icon={ReactRouterDomIcon}
          name="React Router Dom"
          x="-38vw"
          y="6vw"
        />
        <Skill
          icon={FramerMotionIcon}
          name="Framer Motion"
          x="-32vw"
          y="-16vw"
        />
        <Skill icon={PrismaIcon} name="Prisma" x="-8vw" y="18vw" />
        <Skill
          icon={StyledComponentIcon}
          name="Styled Component"
          x="16vw"
          y="-4vw"
        />
      </div>

      {/* Mobile View */}

      <div className="hidden w-full h-screen relative md:flex items-center justify-center mt-14">
        <motion.div className="flex items-center justify-center rounded-full font-semibold text-sm bg-dark text-light dark:bg-light dark:text-dark p-4 shadow-dark dark:shadow-light">
          <Link href="/skills">Web</Link>
        </motion.div>

        <SkillMobileView icon={ReactIcon} name="ReactJs" x="-30vw" y="10vw" />
        <SkillMobileView
          icon={JavaScriptIcon}
          name="JavaScript"
          x="-22vw"
          y="-20vw"
        />
        <SkillMobileView
          icon={TypeScriptIcon}
          name="TypeScript"
          x="20vw"
          y="23vw"
        />
        <SkillMobileView icon={NextJsIcon} name="NextJs" x="25vw" y="52vw" />
        <SkillMobileView icon={CSSIcon} name="CSS" x="-40vw" y="-46vw" />
        <SkillMobileView
          icon={TailwindCSSIcon}
          name="Tailwind CSS"
          x="38vw"
          y="-47vw"
        />
        <SkillMobileView icon={HtmlIcon} name="HTML" x="0vw" y="78vw" />
        <SkillMobileView icon={MongoDbIcon} name="MongoDb" x="18vw" y="-68vw" />
        <SkillMobileView
          icon={MongooseIcon}
          name="Mongoose"
          x="13vw"
          y="-32vw"
        />
        <SkillMobileView
          icon={ExpressJsIcon}
          name="ExpressJs"
          x="-2vw"
          y="-80vw"
        />
        <SkillMobileView icon={NodeJsIcon} name="NodeJs" x="-38vw" y="52vw" />
        <SkillMobileView icon={ReduxIcon} name="Redux" x="-9vw" y="-50vw" />
        <SkillMobileView
          icon={FirebaseIcon}
          name="Firebase"
          x="26vw"
          y="-88vw"
        />
        <SkillMobileView icon={NpmIcon} name="Npm" x="-28vw" y="80vw" />
        <SkillMobileView icon={FigmaIcon} name="Figma" x="33vw" y="-7vw" />
        <SkillMobileView
          icon={ReactRouterDomIcon}
          name="React Router Dom"
          x="32vw"
          y="86vw"
        />
        <SkillMobileView
          icon={FramerMotionIcon}
          name="Framer Motion"
          x="-32vw"
          y="-83vw"
        />
        <SkillMobileView icon={PrismaIcon} name="Prisma" x="-18vw" y="98vw" />
        <SkillMobileView
          icon={StyledComponentIcon}
          name="Styled Component"
          x="-12vw"
          y="32vw"
        />
      </div>
    </>
  );
};

export default AboutSectionSkills;
