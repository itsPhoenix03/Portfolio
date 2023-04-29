import React from "react";
import Layout from "./Layout";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full border-t-2 border-solid border-dark text-md font-medium dark:text-light dark:border-light">
      <Layout className="py-8 px-16 flex items-center justify-between">
        <span className="w-full">
          {new Date().getFullYear()} &copy; All Rights Reserved.
        </span>
        <div className="w-full flex items-center justify-center group">
          Build with{" "}
          <span className="text-primary dark:text-primaryDark text-3xl px-1 transition duration-150 ease-out hover:ease-in group-hover:-translate-y-1">
            &#9825;
          </span>{" "}
          by&nbsp;
          <Link href="/" className="underline underline-offset-2">
            Shreyas
          </Link>
        </div>
        <Link
          href="https://www.linkedin.com/in/shreyas-misra031/"
          className="w-full text-right underline underline-offset-2"
        >
          Say Hello!
        </Link>
      </Layout>
    </footer>
  );
};

export default Footer;
