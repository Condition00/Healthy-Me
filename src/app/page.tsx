import Image from "next/image";
import Header from "./Components/Header";
import Hero from "./Components/Hero";
import Features from "./Components/Features";
import Footer from "./Components/Footer";

export default function Home() {
  return (
    <div className="bg-blue-50">
    <Header />
    <Hero />
    <Features />
    <Footer />
    </div>
  );
}
