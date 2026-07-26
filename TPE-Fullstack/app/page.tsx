import { Catalog } from "@/components/sections/Catalog";
import { Expertise } from "@/components/sections/Expertise";
import { FAQ } from "@/components/sections/FAQ";
import { Features } from "@/components/sections/Features";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Industries } from "@/components/sections/Industries";
import { InstagramFeed } from "@/components/sections/InstagramFeed";
import { Sustainability } from "@/components/sections/Sustainability";
import { Testimonials } from "@/components/sections/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Expertise />
      <Catalog />
      <Industries />
      <Sustainability />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <InstagramFeed />
    </>
  );
}
