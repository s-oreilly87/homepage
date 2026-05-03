import ClientCanvas from "@/components/ClientCanvas";
import Hero from "@/components/Hero";
import Stack from "@/components/Stack";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <ClientCanvas />

      {/* Dark overlay — contrast layer between shader and text */}
      <div className="fixed inset-0 z-1 bg-page/60" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10">
        <div className="max-w-170 mx-auto px-6">
          <Hero />
          <Stack />
          <Projects />
          <Contact />
        </div>
      </div>
    </>
  );
}
