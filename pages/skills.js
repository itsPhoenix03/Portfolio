import AnimatedText from "@/src/components/AnimatedText";
import {
  CSSIcon,
  ExpressJsIcon,
  HtmlIcon,
  JavaScriptIcon,
  MongoDbIcon,
  NextJsIcon,
  NodeJsIcon,
  ReactIcon,
  TailwindCSSIcon,
  TypeScriptIcon,
} from "@/src/components/Icons";
import Layout from "@/src/components/Layout";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import TransitionsEffects from "@/src/components/TransitionsEffects";

const Card = ({ title, desc, link, iconComponent }) => {
  return (
    <motion.div
      initial={{
        y: 150,
        opacity: 0,
      }}
      whileInView={{
        y: 0,
        opacity: 1,
        transition: { duration: 1 },
      }}
      viewport={{ once: true }}
      className="
      relative
              col-span-1 p-10 rounded-2xl 
              w-full flex flex-col items-center justify-between gap-8
              border border-solid border-dark border-r-[5px] border-b-[5px]
              bg-light text-dark dark:border-light dark:bg-dark
              lg:p-6
            "
    >
      <div className="w-full flex items-center justify-between">
        <h2 className="font-bold text-5xl dark:text-light first-letter:text-primary dark:first-letter:text-primaryDark capitalize lg:text-4xl md:text-3xl sm:text-2xl">
          {title}
        </h2>
        {iconComponent}
      </div>
      <p className="font-medium text-dark/75 dark:text-light/75 lg:text-sm sm:text-xs">
        {desc}
      </p>

      <Link
        href={link}
        target="_blank"
        className="self-end bg-light text-dark dark:bg-dark dark:text-light border border-solid border-dark/75 dark:border-light/75 font-medium transition hover:border-dark/25 dark:hover:border-light/25 p-3 px-6 rounded-xl
        lg:text-sm sm:text-xs
        "
      >
        Know More
      </Link>
    </motion.div>
  );
};

const skills = () => {
  return (
    <>
      <Head>
        <title>Shreyas | Skills</title>
        <meta
          name="description"
          content="These are my acquired development Skills!"
        />
      </Head>

      <TransitionsEffects />

      <main className="w-full flex flex-col items-center justify-between mb-16">
        <Layout className="pt-16 lg:pt-10">
          <AnimatedText
            text={"Dynamic Arsenal of Skills"}
            className="pb-2 lg:text-6xl md:text-5xl sm:text-4xl"
          />

          <div className="mt-16 w-full h-auto grid grid-cols-2 gap-10 lg:grid-cols-1">
            <Card
              title="ReactJs"
              desc={
                "ReactJS is a popular open-source JavaScript library used for building user interfaces. It was developed by Facebook and is widely adopted in web development. ReactJS uses a declarative approach to building components that allows for easy reusability and modularity, making it a powerful tool for building complex UIs."
              }
              link={"https://react.dev/"}
              iconComponent={<ReactIcon className="text-5xl xxs:hidden" />}
            />
            <Card
              title="JavaScript"
              desc={
                "JavaScript is a popular high-level programming language used for both front-end and back-end web development. It was created by Netscape and is now widely adopted as an open standard. JavaScript allows for dynamic and interactive web content, and is often used alongside HTML and CSS to create modern web applications."
              }
              link={"https://developer.mozilla.org/en-US/docs/Web/JavaScript"}
              iconComponent={<JavaScriptIcon className="text-5xl xxs:hidden" />}
            />
            <Card
              title="NodeJs"
              desc={
                "Node.js is an open-source, cross-platform JavaScript runtime environment that allows developers to build server-side applications using JavaScript. It is built on the Chrome V8 JavaScript engine and provides a scalable and event-driven architecture that is well-suited for building real-time, data-intensive applications. Node.js has a large and active community of developers and is widely used in web development."
              }
              link={"https://nodejs.org/en/about"}
              iconComponent={<NodeJsIcon className="text-5xl xxs:hidden" />}
            />
            <Card
              title="TypeScript"
              desc={
                "TypeScript is a strongly-typed superset of JavaScript that adds optional static typing, classes, and interfaces to the language. It was developed and is maintained by Microsoft, and can be used in both front-end and back-end development. TypeScript is designed to make large-scale JavaScript applications more manageable and maintainable, by catching errors before they occur and improving code readability."
              }
              link={"https://www.typescriptlang.org/"}
              iconComponent={<TypeScriptIcon className="text-5xl xxs:hidden" />}
            />
            <Card
              title="NextJs"
              desc={
                "Next.js is an open-source JavaScript framework used for building server-side rendered and static web applications. It is built on top of React and Node.js, and provides features such as automatic code splitting, server-side rendering, and static site generation. Next.js is commonly used for building complex, performance-driven web applications."
              }
              link={"https://nextjs.org/"}
              iconComponent={<NextJsIcon className="xxs:hidden" />}
            />
            <Card
              title="ExpressJs"
              desc={
                "Express.js is a popular open-source web application framework for Node.js, used for building server-side applications. It provides a simple, yet powerful set of features for building web applications, such as routing, middleware, and templates. Express.js is highly customizable and can be used in conjunction with other Node.js libraries and frameworks to build scalable and modular applications."
              }
              link={"https://expressjs.com/"}
              iconComponent={<ExpressJsIcon className="text-5xl xxs:hidden" />}
            />
            <Card
              title="MongoDb"
              desc={
                "MongoDB is a popular open-source NoSQL database program that uses a document-oriented data model. It is designed to be scalable, flexible and high-performance, and allows developers to store and retrieve data using JSON-like documents with dynamic schemas. MongoDB is commonly used in modern web applications, and is particularly well-suited for applications that require frequent and complex data queries."
              }
              link={"https://www.mongodb.com/"}
              iconComponent={<MongoDbIcon className="text-5xl xxs:hidden" />}
            />
            <Card
              title="CSS"
              desc={
                "Cascading Style Sheets (CSS) is a language used for describing the presentation and styling of web pages. It is used in conjunction with HTML to create visually appealing and user-friendly websites. CSS allows developers to control the layout, colors, fonts, and other visual aspects of a web page, and is an essential tool for modern web development."
              }
              link={"https://developer.mozilla.org/en-US/docs/Web/CSS"}
              iconComponent={<CSSIcon className="text-5xl xxs:hidden" />}
            />
            <Card
              title="Html"
              desc={
                "HTML (Hypertext Markup Language) is a markup language used for creating and structuring web pages. It is the standard language used for creating content on the World Wide Web. HTML uses a series of tags to define the structure, content, and layout of a web page, and is essential for creating modern, dynamic, and interactive web pages."
              }
              link={"https://developer.mozilla.org/en-US/docs/Web/HTML"}
              iconComponent={<HtmlIcon className="text-5xl xxs:hidden" />}
            />
            <Card
              title="Tailwind CSS"
              desc={
                "Tailwind CSS is a popular utility-first CSS framework used for creating responsive and customizable user interfaces. It provides a comprehensive set of pre-defined CSS classes that can be combined and configured to create complex and modern layouts. Tailwind CSS is designed to improve development speed and efficiency, and is widely adopted by web developers for building scalable and consistent user interfaces."
              }
              link={"https://tailwindcss.com/"}
              iconComponent={
                <TailwindCSSIcon className="text-5xl xxs:hidden" />
              }
            />
          </div>
        </Layout>
      </main>
    </>
  );
};

export default skills;
