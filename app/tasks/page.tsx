"use client"

import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/lib/tasks";

import { Header } from "../components/Header";
import LoadingPage from "./loading";
import TaskBodyPage from "../components/tasks/TaskBody";

export default function TasksPage() {
  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  return (
    <>
      <Header
        title="Tasks"
        subTitle={`${tasks.length} total task${tasks.length !== 1 ? 's' : ''}`}
        link="/tasks/new"
      />

      <Suspense fallback={<LoadingPage />}>
        <TaskBodyPage />
      </Suspense>
    </>
  )
}