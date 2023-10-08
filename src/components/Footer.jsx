import React from "react";
import Layout from "./Layout";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full border-t-2 border-solid border-dark text-md font-medium dark:text-light dark:border-light">
      <Layout className="py-8 px-16 flex items-center justify-between lg:py-4 lg:px-10 sm:px-2 md:text-base md:flex-col md:text-center md:gap-4">
        <span className="w-full xxs:text-sm">
          {new Date().getFullYear()} &copy; All Rights Reserved.
        </span>
        <div className="w-full flex items-center justify-center group xxs:text-sm ">
          Build with{" "}
          <span className="text-primary dark:text-primaryDark text-3xl px-1 transition duration-150 ease-out hover:ease-in group-hover:-translate-y-1">
            &#9825;
          </span>{" "}
          by&nbsp;
          <Link
            href="https://github.com/itsPhoenix03"
            className="underline underline-offset-4"
          >
            Shreyas
          </Link>
        </div>
        <Link
          href="https://www.linkedin.com/in/shreyas-misra031/"
          className="w-full text-right underline underline-offset-4 md:text-center xxs:text-sm"
        >
          Say Hello!
        </Link>
      </Layout>
    </footer>
  );
};

export default Footer;
