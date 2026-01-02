import Image from "next/image";
import { Header } from "./components/Header";
import DashboardBodyPage from "./components/dashboard/dashboard-body";
import { Suspense } from "react";
import DashboardSkeleton from "./loading";

export default async function Dashboard() {
  return (
    <>
      <Header
        title="Dashboard"
        subTitle="Welcome to your dashboard"
        link="/dashboard/new"
      />
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardBodyPage />
      </Suspense>
    </>
  );
}
