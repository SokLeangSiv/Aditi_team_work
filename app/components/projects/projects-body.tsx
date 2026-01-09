// app/components/projects/projects-body.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import LoadingPage from '@/app/projects/loading';
import { getProjects, type Project } from '@/lib/project';
import { Plus } from 'lucide-react';
import Link from 'next/link';


const avatarBgClasses = {
  purple: 'bg-purple-600 text-white',
  blue: 'bg-blue-600 text-white',
  pink: 'bg-pink-600 text-white',
  indigo: 'bg-indigo-600 text-white',
  green: 'bg-green-600 text-white',
};

export default function ProjectsBodyPage() {
  const { data, error, isLoading } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: getProjects,
  });

  const projects = data ?? [];

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return <div>Error loading projects</div>;
  }

  console.log('Projects data:', projects);

  return (
    <div className="flex-1 p-6 space-y-6">
   

      <div className="space-y-6">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            className="block rounded-xl border border-border bg-background shadow-sm p-6 hover:shadow-md transition-shadow"
            aria-label={`Open project ${project.name}`}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                <div className={`w-4 h-4 rounded-full ${project.color} mt-1`} />
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{project.name}</h3>
                  <p className="text-muted-foreground mt-1">{project.description}</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground font-medium">
                {project.status === 'active' ? project.dueDate || 'Active' : project.status}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                  <span>Progress</span>
                  <span>
                    {project.tasksCompleted}/{project.tasksTotal} tasks
                  </span>
                </div>
                <Progress
                  value={project.tasksTotal > 0 ? (project.tasksCompleted / project.tasksTotal) * 100 : 0}
                  className="h-2"
                />
              </div>

              <div className="flex -space-x-3 ml-8">
                <Avatar className="w-10 h-10 border-4 border-white">
                  <AvatarFallback className={`text-sm font-medium ${avatarBgClasses.purple}`}>
                    {project.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}