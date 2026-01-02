import { Suspense } from "react";
import { Header } from "../components/Header";
import LoadingPage from "./loading";
import ProjectsBodyPage from "../components/projects/projects-body";

const ProjectsPage = () => {
  return (
    <>
      <Header
        title="Projects"
        subTitle="5 total projects"
        link="/projects/new"
      />
      <Suspense fallback={<LoadingPage />}>
        <ProjectsBodyPage />
      </Suspense>
    </>
  );
};

export default ProjectsPage;
