import Banner from "@/components/home/Banner";
import React from "react";
import About from "../components/home/About";
import Category from "@/components/home/Category";
import Categories from "@/components/home/Categories";
import Discounted from "@/components/home/Discounted";
import BestSeller from "@/components/home/BestSeller";
import Contact from "@/components/home/Contact";
import Materials from "@/components/home/Materials";
import Process from "@/components/home/Process";
import Reason from "@/components/home/Reason";
import FAQ from "@/components/home/FAQ";
import ReComment from "@/components/home/ReComment";
import News from "@/components/home/News";

const Home = () => {
  return (
    <>
      <Banner />
      <About />
      <Category />
      <Categories />
      <Discounted />
      <BestSeller />
      <Contact />
      <Materials />
      <Process />
      <Reason />
      <FAQ />
      <ReComment />
      <News />
    </>
  );
};

export default Home;
