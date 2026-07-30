import Navbar from "@/components/Navbar/Navbar";

import Hero from "@/components/Home/Hero";
import About from "@/components/About/About";
import Services from "@/components/Services/Services";
import Projects from "@/components/Projects/Projects";
import WhyChooseUs from "@/components/WhyChooseUs/WhyChooseUs";
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer/Footer";
export default function Home() {
  return (
    <div>
      <Navbar></Navbar>
      <Hero></Hero>
      <About></About>
      <Services></Services>
      <Projects></Projects>
      <WhyChooseUs></WhyChooseUs>
      <Contact></Contact>
      <Footer />
    </div>
  );
}
