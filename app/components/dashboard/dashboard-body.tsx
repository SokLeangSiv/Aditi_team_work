"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  Clock,
  Flag,
  ListTodo,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { LucideIcon } from "lucide-react";


// Types
interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate: string;
  tags: string[];
}

interface Project {
  id: string;
  name: string;
  color: string;
}

// Fetch functions
const fetchTasks = async (): Promise<Task[]> => {
  const response = await fetch("http://localhost:3001/tasks");
  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

const fetchProjects = async (): Promise<Project[]> => {
  const response = await fetch("http://localhost:3001/projects");
  if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

// Update task status
const updateTaskStatus = async ({ id, status }: { id: string; status: "todo" | "in-progress" | "done" }): Promise<Task> => {
  const response = await fetch(`http://localhost:3001/tasks/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update task: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

// Calculate statistics
const calculateStats = (tasks: Task[]) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const overdue = tasks.filter((t) => {
    const dueDate = new Date(t.dueDate);
    return dueDate < new Date() && t.status !== "done";
  }).length;

  return { total, completed, inProgress, overdue };
};

// Stats Card Component
const StatsCard = ({
  title,
  value,
  change,
  icon: Icon,
  iconColor,
}: {
  title: string;
  value: number;
  change: string;
  // icon: any;
  icon : LucideIcon;
  iconColor: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-gray-500">
        {title}
      </CardTitle>
      <Icon className={`h-5 w-5 ${iconColor}`} />
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold">{value}</div>
      <p
        className={`text-xs ${
          change.startsWith("+") ? "text-green-600" : "text-red-600"
        } mt-1`}
      >
        {change} from last week
      </p>
    </CardContent>
  </Card>
);

// Recent Task Item Component
const TaskItem = ({
  task,
  projectName,
  onToggle,
  isUpdating,
}: {
  task: Task;
  projectName: string;
  onToggle: (taskId: string, currentStatus: Task["status"]) => void;
  isUpdating: boolean;
}) => {
  const isOverdue =
    new Date(task.dueDate) < new Date() && task.status !== "done";
  const dueDate = new Date(task.dueDate);
  const today = new Date();
  const isToday = dueDate.toDateString() === today.toDateString();
  const isTomorrow =
    dueDate.toDateString() ===
    new Date(today.getTime() + 86400000).toDateString();

  let dueDateText = dueDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  if (isToday) dueDateText = "Today";
  if (isTomorrow) dueDateText = "Tomorrow";

  const statusColors = {
    todo: "bg-gray-100 text-gray-800",
    "in-progress": "bg-orange-100 text-orange-800",
    done: "bg-green-100 text-green-800",
  };

  const statusLabels = {
    todo: "To Do",
    "in-progress": "In Progress",
    done: "Done",
  };

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0 hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-3 flex-1">
        <input
          type="checkbox"
          checked={task.status === "done"}
          onChange={() => onToggle(task.id, task.status)}
          disabled={isUpdating}
          className="h-4 w-4 rounded border-gray-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="flex-1">
          <h4
            className={`font-medium transition-all ${
              task.status === "done"
                ? "line-through text-gray-500"
                : "text-gray-900"
            } ${isUpdating ? "opacity-50" : ""}`}
          >
            {task.title}
          </h4>
          <p className="text-sm text-gray-500">{projectName}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Badge variant="secondary" className={statusColors[task.status]}>
          {statusLabels[task.status]}
        </Badge>
        {isOverdue && <Flag className="h-4 w-4 text-red-500" />}
        <span
          className={`text-sm ${isOverdue ? "text-red-600" : "text-gray-600"}`}
        >
          {dueDateText}
        </span>
      </div>
    </div>
  );
};

// Loading Skeleton Component
const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div>
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-4 w-32" />
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </CardContent>
    </Card>
  </div>
);

// Error Component
const ErrorDisplay = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <Alert variant="destructive">
    <AlertTitle>Error</AlertTitle>
    <AlertDescription className="flex items-center justify-between">
      <span>{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="ml-4 px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 text-sm"
        >
          Retry
        </button>
      )}
    </AlertDescription>
  </Alert>
);

// Main Dashboard Component
export default function Dashboard() {
  const queryClient = useQueryClient();

  const {
    data: tasks,
    isLoading: tasksLoading,
    error: tasksError,
    refetch: refetchTasks,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 2,
  });

  const {
    data: projects,
    isLoading: projectsLoading,
    error: projectsError,
    refetch: refetchProjects,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 2,
    refetchOnWindowFocus: true,
  });

  // Mutation for updating task status
  const updateTaskMutation = useMutation({
    mutationFn: updateTaskStatus,
    onMutate: async ({ id, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      // Snapshot previous value
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      // Optimistically update the cache
      queryClient.setQueryData<Task[]>(["tasks"], (old) => {
        if (!old) return old;
        return old.map((task) =>
          task.id === id ? { ...task, status } : task
        );
      });

      // Return context with previous value
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
      console.error("Failed to update task:", err);
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const isLoading = tasksLoading || projectsLoading;
  const error = tasksError || projectsError;

  const handleRetry = () => {
    refetchTasks();
    refetchProjects();
  };

  const handleToggleTask = (taskId: string, currentStatus: Task["status"]) => {
    const newStatus: Task["status"] = currentStatus === "done" ? "todo" : "done";
    updateTaskMutation.mutate({ id: taskId, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <DashboardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <ErrorDisplay 
          message="Failed to load dashboard data. Please make sure JSON Server is running on port 3001." 
          onRetry={handleRetry}
        />
      </div>
    );
  }

  const stats = calculateStats(tasks || []);
  const recentTasks = (tasks || [])
    .slice()
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )
    .slice(0, 5);

  const projectMap = (projects || []).reduce((acc, project) => {
    acc[project.id] = project.name;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Total Tasks"
          value={stats.total}
          change="+12%"
          icon={ListTodo}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          change="+8%"
          icon={CheckCircle2}
          iconColor="text-green-500"
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgress}
          change="+5%"
          icon={Clock}
          iconColor="text-orange-500"
        />
        <StatsCard
          title="Overdue"
          value={stats.overdue}
          change="-2%"
          icon={Flag}
          iconColor="text-red-500"
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription className="mt-1">
              Your most recent task updates
            </CardDescription>
          </div>
          <Link
            href="/tasks"
            className="text-sm text-gray-600 hover:text-blue-500 flex items-center"
          >
            View all
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </CardHeader>
        <CardContent>
          {recentTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No tasks found</p>
          ) : (
            <div>
              {recentTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  projectName={projectMap[task.projectId] || "Unknown Project"}
                  onToggle={handleToggleTask}
                  isUpdating={updateTaskMutation.isPending && updateTaskMutation.variables?.id === task.id}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}