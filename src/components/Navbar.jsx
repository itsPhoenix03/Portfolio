import Link from "next/link";
import React, { useState } from "react";
import Logo from "./Logo";
import { useRouter } from "next/router";
import {
  GmailIcon,
  GithubIcon,
  LinkedInIcon,
  MoonIcon,
  SunIcon,
  TwitterIcon,
} from "./Icons";
import { motion } from "framer-motion";
import { useThemeSwitcher } from "./hooks/useThemeSwitcher";

const CustomLink = ({ href, title, classname = "" }) => {
  const { asPath } = useRouter();

  return (
    <Link href={href} className={`${classname} relative group`}>
      {title}

      <span
        className={`h-[1px] inline-block bg-primary absolute left-0 -bottom-0.5 
        group-hover:w-full transition-[width] ease duration-300
        ${asPath === href ? "w-full" : "w-0"} dark:bg-primaryDark
    `}
      >
        &nbsp;
      </span>
    </Link>
  );
};

const CustomMobileLink = ({ href, title, classname = "", toggle }) => {
  const router = useRouter();

  const handleClick = () => {
    toggle();
    router.push(href);
  };

  return (
    <button
      href={href}
      className={`${classname} relative group`}
      onClick={handleClick}
    >
      {title}

      <span
        className={`h-[1px] inline-block bg-primary absolute left-0 -bottom-0.5 
        group-hover:w-full transition-[width] ease duration-300
        ${router.asPath === href ? "w-full" : "w-0"} dark:bg-primaryDark
    `}
      >
        &nbsp;
      </span>
    </button>
  );
};

const Navbar = () => {
  const [mode, setMode] = useThemeSwitcher();

  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen((prev) => !prev);

  return (
    <header
      className={`relative w-full px-32 py-8 font-medium flex items-center justify-between dark:text-light z-10 lg:px-20 md:px-12 sm:px-6`}
    >
      <button
        className="flex-col justify-center items-center hidden lg:flex"
        onClick={handleOpen}
      >
        <span
          className={`bg-dark dark:bg-light block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm  ${
            isOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
          }`}
        ></span>
        <span
          className={`bg-dark dark:bg-light block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        ></span>
        <span
          className={`bg-dark dark:bg-light block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
            isOpen ? "-rotate-45 -translate-y-1" : " translate-y-0.5"
          }`}
        ></span>
      </button>

      <div className="w-full flex justify-between items-center lg:hidden">
        <nav>
          <CustomLink href="/" title="Home" classname="mr-4" />
          <CustomLink href="/aboutme" title="About Me" classname="mx-4" />
          <CustomLink href="/projects" title="Projects" classname="mx-4" />
          <CustomLink href="/skills" title="Skills" classname="ml-4" />
        </nav>

        <nav className="flex justify-center items-center flex-wrap">
          <motion.a
            href="https://x.com/shreyas_misra_"
            target={"_blank"}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.9 }}
            className="w-6 mr-3"
          >
            <TwitterIcon />
          </motion.a>
          <motion.a
            href="https://github.com/itsPhoenix03"
            target={"_blank"}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.9 }}
            className="w-6 mx-3"
          >
            <GithubIcon />
          </motion.a>
          <motion.a
            href="https://www.linkedin.com/in/shreyas-misra/"
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
            className={`ml-3 p-1 flex items-center justify-center rounded-full 
            ${mode === "light" ? "bg-dark text-light" : "bg-light text-dark"}
          `}
          >
            {mode === "dark" ? (
              <SunIcon className={"fill-dark"} />
            ) : (
              <MoonIcon className={"fill-dark"} />
            )}
          </button>
        </nav>
      </div>

      {isOpen ? (
        <motion.div
          initial={{ scale: 0, opacity: 0, x: "-50%", y: "-50%" }}
          animate={{ scale: 1, opacity: 1 }}
          className="min-w-[70vw] z-30 flex flex-col justify-between items-center fixed top-1/2 left-1/2 -transalte-x-1/2 -translate-y-1/2
        bg-light/50 dark:bg-black/50 backdrop-blur-md rounded-lg py-32 border border-dark/25 dark:border-light/25 sm:min-w-[90vw]
      "
        >
          <nav className="flex flex-col justify-center items-center">
            <CustomMobileLink
              href="/"
              title="Home"
              classname="mb-4"
              toggle={handleOpen}
            />
            <CustomMobileLink
              href="/aboutme"
              title="About Me"
              classname="my-4"
              toggle={handleOpen}
            />
            <CustomMobileLink
              href="/projects"
              title="Projects"
              classname="my-4"
              toggle={handleOpen}
            />
            <CustomMobileLink
              href="/skills"
              title="Skills"
              classname="my-4"
              toggle={handleOpen}
            />
          </nav>

          <nav className="mt-4 flex justify-center items-center flex-wrap">
            <motion.a
              aria-label="My Twitter/X Account Link Button"
              href="https://twitter.com/its__Shreyas_"
              target={"_blank"}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="w-6 mr-3 ml-0 sm:mx-4"
            >
              <TwitterIcon />
            </motion.a>
            <motion.a
              aria-label="My Github Link Button"
              href="https://github.com/itsPhoenix03"
              target={"_blank"}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="w-6 mr-3 sm:mx-4"
            >
              <GithubIcon />
            </motion.a>
            <motion.a
              aria-label="My LinkedIn Profile Button"
              href="https://www.linkedin.com/in/shreyas-misra031/"
              target={"_blank"}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="w-6 mx-3 sm:mx-4"
            >
              <LinkedInIcon />
            </motion.a>
            {/* <motion.a
          href="https://github.com/itsPhoenix03"
          target={"_blank"}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.9 }}
          className="w-6 mx-3 sm:mx-4"
        >
          <GithubIconAlt />
        </motion.a> */}
            <motion.a
              aria-label="This is my Gmail you can mail to me using it!"
              href="mailto:shreyas.misra03@gmail.com"
              target={"_blank"}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="w-6 mx-3 sm:mx-4"
            >
              <GmailIcon />
            </motion.a>

            <button
              aria-label="Theme Switcher Button"
              onClick={() => setMode(mode === "light" ? "dark" : "light")}
              className={`mx-3 p-1 flex items-center justify-center rounded-full 
            ${mode === "light" ? "bg-dark text-light" : "bg-light text-dark"}
          `}
            >
              {mode === "dark" ? (
                <SunIcon className={"fill-dark"} />
              ) : (
                <MoonIcon className={"fill-dark"} />
              )}
            </button>
          </nav>
        </motion.div>
      ) : null}

      <div className="absolute left-[50%] top-2 translate-x-[-50%] lg:left-[85%]">
        <Logo />
      </div>
    </header>
  );
};

export default Navbar;
