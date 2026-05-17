import ClientCanvas from "@/components/ClientCanvas";
import Nav from "@/components/Nav";
import ScrollManager from "@/components/ScrollManager";
import Hero from "@/components/Hero";
import Stack from "@/components/Stack";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <ClientCanvas />

      {/* Dark overlay — contrast layer between shader and text */}
      <div className="fixed inset-0 z-1 bg-page/60" aria-hidden="true" />

      {/* Floating nav — sits above everything */}
      <Nav />

      {/* Scroll manager — JS snap for mouse, CSS snap for touch */}
      <ScrollManager />

      {/* Content — pt-14 reserves space below the fixed nav */}
      <div className="relative z-10 pt-14">
        <div className="max-w-170 mx-auto px-6">
          <Hero />
          <Stack />
          <Projects />
          <Contact />
          <Footer />
        </div>
      </div>
    </>
  );
}
