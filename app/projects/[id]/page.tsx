import { PROJECTS_DATA } from '@/data/projects';
import HeroSection from '@/components/case-study/hero';
import OverviewSection from '@/components/case-study/overview';
import ChallengesSection from '@/components/case-study/challenges';
import ResearchSection from '@/components/case-study/research';
import SolutionSection from '@/components/case-study/solution';
import SystemDesignSection from '@/components/case-study/system-design';
import ShowcaseSection from '@/components/case-study/showcase';
import { notFound } from 'next/navigation';
import Footer from '@/components/footer';
import Nav from '@/components/nav';
import ShowcaseVideoSection from '@/components/case-study/showcase-video';
import ProjectPagination from '@/components/case-study/ProjectPagination';

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const project = PROJECTS_DATA[resolvedParams.id];

  if (!project) {
    notFound();
  }

  return (
    <>
      <Nav />
      <main className='w-full min-h-screen'>
        <HeroSection data={project} />
        <OverviewSection data={project} />
        <ChallengesSection data={project} />

        <ResearchSection data={project} />
        <ShowcaseVideoSection data={project} />
        <SolutionSection data={project} />
        <SystemDesignSection data={project} />
        <ShowcaseSection data={project} />
        <ProjectPagination currentSlug={resolvedParams.id} />
      </main>
      <Footer />
    </>
  );
}
