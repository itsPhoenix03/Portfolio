import React from "react";
import Layout from "./Layout";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full border-t-2 border-solid border-dark text-md font-medium">
      <Layout className="py-8 flex items-center justify-between">
        <span>{new Date().getFullYear()} &copy; All Rights Reserved.</span>
        <div className="flex items-center justify-center group">
          Build with{" "}
          <span className="text-primary text-3xl px-1 transition duration-150 ease-out hover:ease-in group-hover:-translate-y-1">
            &#9825;
          </span>{" "}
          by&nbsp;
          <Link href="/" className="underline underline-offset-2">
            Shreyas
          </Link>
        </div>
        <Link href="/" className="underline underline-offset-2">
          Say Hello!
        </Link>
      </Layout>
    </footer>
  );
};

export default Footer;
