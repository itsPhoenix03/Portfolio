import Link from "next/link";
import React from "react";
import Logo from "./Logo";
import { useRouter } from "next/router";
import GmailIcon, {
  GithubIcon,
  GithubIconAlt,
  LinkedInIcon,
  MoonIcon,
  SunIcon,
} from "./Icons";
import { motion } from "framer-motion";
import useThemeSwitcher from "./hooks/useThemeSwitcher";

const CustomLink = ({ href, title, classname }) => {
  const { asPath } = useRouter();

  return (
    <Link href={href} className={`${classname} relative group`}>
      {title}

      <span
        className={`h-[1px] inline-block bg-dark absolute left-0 -bottom-0.5 
        group-hover:w-full transition-[width] ease duration-300
        ${asPath === href ? "w-full" : "w-0"}
    `}
      >
        &nbsp;
      </span>
    </Link>
  );
};

const Navbar = () => {
  const [mode, setMode] = useThemeSwitcher();
  console.log(mode);
  return (
    <header
      className={`w-full px-32 py-8 font-medium flex items-center justify-between`}
    >
      <nav>
        <CustomLink href="/" title="Home" classname="mr-4" />
        <CustomLink href="/aboutme" title="About Me" classname="mx-4" />
        <CustomLink href="/projects" title="Projects" classname="mx-4" />
        <CustomLink href="/skills" title="Skills" classname="ml-4" />
      </nav>

      <nav className="flex justify-center items-center flex-wrap">
        <motion.a
          href="https://github.com/itsPhoenix03"
          target={"_blank"}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.9 }}
          className="w-6 mr-3"
        >
          <GithubIcon />
        </motion.a>
        <motion.a
          href="https://www.linkedin.com/in/shreyas-misra031/"
          target={"_blank"}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.9 }}
          className="w-6 mx-3"
        >
          <LinkedInIcon />
        </motion.a>
        {/* <motion.a
          href="https://github.com/itsPhoenix03"
          target={"_blank"}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.9 }}
          className="w-6 mx-3"
        >
          <GithubIconAlt />
        </motion.a> */}
        <motion.a
          href="mailto:shreyas.misra03@gmail.com"
          target={"_blank"}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.9 }}
          className="w-6 mx-3"
        >
          <GmailIcon />
        </motion.a>

        <button
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
          className={`ml-3 p-1 flex items-center justify-center rounded-full ${
            mode === "light" ? "text-black" : "text-light"
          }`}
        >
          {mode !== "dark" ? (
            <SunIcon className={"fill-light"} />
          ) : (
            <MoonIcon className={"fill-dark"} />
          )}
        </button>
      </nav>

      <div className="absolute left-[50%] top-2 translate-x-[-50%]">
        <Logo />
      </div>
    </header>
  );
};

export default Navbar;
