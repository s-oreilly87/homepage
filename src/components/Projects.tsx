import { ProjectsCarousel } from "@/components/projects/ProjectsCarousel";
import { ScrollIndicator } from "@/components/ScrollIndicator";

export default function Projects() {
  return (
    <section id="projects" className="panel">
      <div className="pt-6 pb-2">
        <p className="section-label">Projects</p>
      </div>
      <ProjectsCarousel />
      <ScrollIndicator targetId="contact" label="Contact" />
    </section>
  );
}
