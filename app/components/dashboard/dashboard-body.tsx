"use client";

import { useState } from "react"; // Added useState
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  Clock,
  Flag,
  ListTodo,
  ChevronRight,
  LucideIcon,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

// Import types and fetchers
import { getProjects } from "@/lib/project";
import { getTasks, updateTask, type Task } from "@/lib/tasks";

// --- Helper Functions ---

const normalizeStatus = (status: string) => {
  return status.replace("-", "_");
};

const isInProgress = (status: Task["status"]) => {
  const s = normalizeStatus(status);
  return s === "in_progress";
};

const calculateStats = (tasks: Task[]) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => isInProgress(t.status)).length;

  const overdue = tasks.filter((t) => {
    const dueDate = new Date(t.dueDate);
    return dueDate < new Date() && t.status !== "done";
  }).length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const inProgressRate = total > 0 ? Math.round((inProgress / total) * 100) : 0;
  const overdueRate = total > 0 ? Math.round((overdue / total) * 100) : 0;

  return {
    total,
    completed,
    inProgress,
    overdue,
    completionRate,
    inProgressRate,
    overdueRate
  };
};

// --- Sub-Components ---

interface StatsCardProps {
  title: string;
  value: number;
  description: string;
  trendColor?: string;
  icon: LucideIcon;
  iconColor: string;
  onClick: () => void; // Added click handler
  isActive: boolean;   // Added active state
}

const StatsCard = ({
  title,
  value,
  description,
  trendColor,
  icon: Icon,
  iconColor,
  onClick,
  isActive,
}: StatsCardProps) => (
  <Card
    onClick={onClick}
    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
      isActive ? "ring-2 ring-blue-500 bg-blue-50/50 border-blue-200" : "hover:border-gray-400"
    }`}
  >
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
      <CardTitle className="text-sm font-medium text-gray-500">
        {title}
      </CardTitle>
      <Icon className={`h-5 w-5 ${iconColor}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className={`text-xs mt-1 ${trendColor || "text-gray-500"}`}>
        {description}
      </p>
    </CardContent>
  </Card>
);

const TaskItem = ({
  task,
  projectName,
  onToggle,
  isUpdating
}: {
  task: Task;
  projectName: string;
  onToggle: (task: Task) => void;
  isUpdating: boolean;
}) => {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "done";
  const dueDate = new Date(task.dueDate);
  const today = new Date();

  const isToday = dueDate.toDateString() === today.toDateString();
  const isTomorrow = dueDate.toDateString() === new Date(today.getTime() + 86400000).toDateString();

  let dueDateText = dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  if (isToday) dueDateText = "Today";
  if (isTomorrow) dueDateText = "Tomorrow";

  const statusConfig: Record<string, { label: string; style: string }> = {
    todo: { label: "To Do", style: "bg-gray-100 text-gray-800" },
    in_progress: { label: "In Progress", style: "bg-blue-100 text-blue-800" },
    done: { label: "Done", style: "bg-green-100 text-green-800" },
  };

  const normalizedStatus = normalizeStatus(task.status);
  const config = statusConfig[normalizedStatus] || statusConfig.todo;

  return (
    <div className={`flex items-center justify-between py-3 border-b last:border-0 hover:bg-gray-50 transition-colors px-1 ${isUpdating ? "opacity-50" : ""}`}>
      <div className="flex items-center space-x-3 flex-1 overflow-hidden">
        {/* Interactive Checkbox */}
        <input
          type="checkbox"
          checked={task.status === "done"}
          onChange={() => onToggle(task)}
          disabled={isUpdating}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
        />

        <div className="flex-1 min-w-0">
          <Link href={`/tasks/${task.id}`} className="block group">
            <h4 className={`font-medium truncate transition-all group-hover:text-blue-600 ${
              task.status === "done" ? "line-through text-gray-400" : "text-gray-900"
            }`}>
              {task.title}
            </h4>
          </Link>
          <p className="text-xs text-gray-500 truncate">{projectName}</p>
        </div>
      </div>

      <div className="flex items-center space-x-3 ml-4 shrink-0">
        <Badge variant="secondary" className={`${config.style} whitespace-nowrap`}>
          {config.label}
        </Badge>

        <div className="flex items-center w-20 justify-end">
          {isOverdue && <Flag className="h-3 w-3 text-red-500 mr-1" />}
          <span className={`text-xs ${isOverdue ? "text-red-600 font-medium" : "text-gray-500"}`}>
            {dueDateText}
          </span>
        </div>
      </div>
    </div>
  );
};

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4 rounded-full" />
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

const ErrorDisplay = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) => (
  <Alert variant="destructive">
    <AlertTitle>Error</AlertTitle>
    <AlertDescription className="flex items-center justify-between">
      <span>{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="ml-4 px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 text-xs font-medium"
        >
          Retry
        </button>
      )}
    </AlertDescription>
  </Alert>
);

// --- Main Component ---

type FilterType = "total" | "completed" | "in_progress" | "overdue";

export default function Dashboard() {
  const [filter, setFilter] = useState<FilterType>("total"); // State for filtering
  const queryClient = useQueryClient();

  const {
    data: tasks,
    isLoading: tasksLoading,
    error: tasksError,
    refetch: refetchTasks,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const {
    data: projects,
    isLoading: projectsLoading,
    error: projectsError,
    refetch: refetchProjects,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Task["status"] }) =>
      updateTask(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const handleToggleTask = (task: Task) => {
    const newStatus = task.status === "done" ? "todo" : "done";
    updateTaskMutation.mutate({ id: task.id, status: newStatus });
  };

  const isLoading = tasksLoading || projectsLoading;
  const error = tasksError || projectsError;

  const handleRetry = () => {
    refetchTasks();
    refetchProjects();
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
          message="Failed to load dashboard data. Please check your connection."
          onRetry={handleRetry}
        />
      </div>
    );
  }

  const stats = calculateStats(tasks || []);

  // Filter tasks based on selected card
  const filteredTasks = (tasks || []).filter((t) => {
    if (filter === "total") return true;
    if (filter === "completed") return t.status === "done";
    if (filter === "in_progress") return isInProgress(t.status);
    if (filter === "overdue") {
      return new Date(t.dueDate) < new Date() && t.status !== "done";
    }
    return true;
  });

  // Sort and slice the FILTERED list
  const displayTasks = filteredTasks
    .slice()
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )
    .slice(0, 5);

  const projectMap = (projects || []).reduce((acc, project) => {
    acc[project.id] = project.name;
    return acc;
  }, {} as Record<string, string>);

  const filterLabels = {
    total: "All Recent Tasks",
    completed: "Completed Tasks",
    in_progress: "Tasks In Progress",
    overdue: "Overdue Tasks"
  };

  return (
    <div className="p-8 mx-auto max-w-7xl">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Total Tasks"
          value={stats.total}
          description="Active tasks in database"
          icon={ListTodo}
          iconColor="text-blue-500"
          onClick={() => setFilter("total")}
          isActive={filter === "total"}
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          description={`${stats.completionRate}% completion rate`}
          trendColor="text-green-600"
          icon={CheckCircle2}
          iconColor="text-green-500"
          onClick={() => setFilter("completed")}
          isActive={filter === "completed"}
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgress}
          description={`${stats.inProgressRate}% currently active`}
          trendColor="text-orange-600"
          icon={Clock}
          iconColor="text-orange-500"
          onClick={() => setFilter("in_progress")}
          isActive={filter === "in_progress"}
        />
        <StatsCard
          title="Overdue"
          value={stats.overdue}
          description={`${stats.overdueRate}% of total tasks`}
          trendColor={stats.overdue > 0 ? "text-red-600" : "text-gray-500"}
          icon={Flag}
          iconColor="text-red-500"
          onClick={() => setFilter("overdue")}
          isActive={filter === "overdue"}
        />
      </div>

      <Card className="col-span-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="font-semibold text-lg">{filterLabels[filter]}</CardTitle>
            {filter !== "total" && (
                <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-100" onClick={() => setFilter("total")}>
                    Clear Filter <XCircle className="w-3 h-3 ml-1"/>
                </Badge>
            )}
          </div>
          <Link
            href="/tasks"
            className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center transition-colors"
          >
            View all
            <ChevronRight className="h-4 w-4 ml-0.5" />
          </Link>
        </CardHeader>
        <CardContent>
          {displayTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
              <ListTodo className="h-10 w-10 mb-3 opacity-20" />
              <p>No tasks found for this filter.</p>
              {filter !== "total" && (
                  <button
                    onClick={() => setFilter("total")}
                    className="text-sm text-blue-500 hover:underline mt-2"
                  >
                      Show all tasks
                  </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col">
              {displayTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  projectName={projectMap[task.projectId] || "Unknown Project"}
                  onToggle={handleToggleTask}
                  isUpdating={updateTaskMutation.isPending}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}