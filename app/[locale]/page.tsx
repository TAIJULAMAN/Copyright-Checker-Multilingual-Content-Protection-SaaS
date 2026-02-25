import Hero from "@/components/hero";
import HowItWorks from "@/components/how-it-works";
import Features from "@/components/features";
import Pricing from "@/components/pricing";
import Testimonials from "@/components/testimonials";
import Blog from "@/components/blog";
import ImagePart from "@/components/imagePart";
import ResultsSection from "@/components/results-section";

export default function Home() {
  return (
    <main className="w-full">
      <Hero />
      <div id="how-it-works">
        <HowItWorks />
        <ResultsSection />
      </div>
      <Pricing />
      <div className="flex justify-center items-center pb-0 md:pb-20">
        <iframe
          width="800"
          height="500"
          src="https://www.youtube.com/embed/Dn63NzP9to4?si=YvfiVkwg2QuPU_aO"
          title="Erklärung Copyright Chevcker"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>
      <Features />
      <ImagePart />
      <Testimonials />
      <Blog />
    </main>
  );
}
