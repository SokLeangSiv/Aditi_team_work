import { Suspense } from "react";
import { Header } from "../components/Header";
import LoadingPage from "./loading";
import TaskBodyPage from "../components/tasks/TaskBody";

export default function TasksPage() {
  // throw new Error("Failed to load tasks")
  return (
    <>
      <Header title="Tasks" subTitle="8 total tasks" link="/tasks/new" />

      <Suspense fallback={<LoadingPage />}>
        <TaskBodyPage />
      </Suspense>
    </>
  )
}
