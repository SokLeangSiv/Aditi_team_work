// app/components/projects/projects-body.tsx
'use client'; // IMPORTANT: Add this at the top because we're using state now

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type Project = {
  id: string;
  title: string;
  description: string;
  color: 'red' | 'blue' | 'green';
  completedTasks: number;
  totalTasks: number;
  dueDate?: string;
  ongoing?: boolean;
  assignees: { initials: string; color: string }[];
};

const initialProjects: Project[] = [
  {
    id: '1',
    title: 'Marketing Campaign',
    description: 'Q1 marketing initiatives and brand awareness campaigns',
    color: 'red',
    completedTasks: 18,
    totalTasks: 24,
    dueDate: 'Mar 31, 2025',
    assignees: [{ initials: 'JD', color: 'purple' }, { initials: 'AH', color: 'blue' }, { initials: 'SL', color: 'pink' }],
  },
  {
    id: '2',
    title: 'Product Launch',
    description: 'New product release including design system and mobile app',
    color: 'blue',
    completedTasks: 28,
    totalTasks: 42,
    dueDate: 'Feb 15, 2025',
    assignees: [{ initials: 'JD', color: 'purple' }, { initials: 'MK', color: 'green' }, { initials: 'AH', color: 'blue' }, { initials: 'SL', color: 'pink' }],
  },
  {
    id: '3',
    title: 'Engineering',
    description: 'Technical infrastructure and backend improvements',
    color: 'green',
    completedTasks: 20,
    totalTasks: 36,
    ongoing: true,
    assignees: [{ initials: 'AK', color: 'indigo' }, { initials: 'MR', color: 'purple' }],
  },
];

const colorDotClasses = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
};

const avatarBgClasses = {
  purple: 'bg-purple-600 text-white',
  blue: 'bg-blue-600 text-white',
  pink: 'bg-pink-600 text-white',
  indigo: 'bg-indigo-600 text-white',
  green: 'bg-green-600 text-white',
};

export default function ProjectsBodyPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<'red' | 'blue' | 'green'>('blue');

  const handleAddProject = () => {
    if (!title.trim()) return;

    const newProject: Project = {
      id: Date.now().toString(),
      title,
      description,
      color,
      completedTasks: 0,
      totalTasks: 10, // default
      assignees: [{ initials: 'YOU', color: 'purple' }], // you can improve this later
    };

    setProjects([newProject, ...projects]); // add to top
    setTitle('');
    setDescription('');
    setColor('blue');
    setOpen(false);
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-sm">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Add a new project to your workspace. Fill in the details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Website Redesign"
                  autoFocus
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the project..."
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="color">Project Color</Label>
                <Select value={color} onValueChange={(value: never) => setColor(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="red">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-red-500" />
                        Red
                      </div>
                    </SelectItem>
                    <SelectItem value="blue">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-blue-500" />
                        Blue
                      </div>
                    </SelectItem>
                    <SelectItem value="green">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-green-500" />
                        Green
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProject} disabled={!title.trim()}>
                Create Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                <div className={`w-4 h-4 rounded-full ${colorDotClasses[project.color]} mt-1`} />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                  <p className="text-gray-600 mt-1">{project.description}</p>
                </div>
              </div>
              <span className="text-sm text-gray-500 font-medium">
                {project.ongoing ? 'Ongoing' : project.dueDate || 'No due date'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{project.completedTasks}/{project.totalTasks} tasks</span>
                </div>
                <Progress value={(project.completedTasks / project.totalTasks) * 100} className="h-2" />
              </div>

              <div className="flex -space-x-3 ml-8">
                {project.assignees.map((assignee, index) => (
                  <Avatar key={index} className="w-10 h-10 border-4 border-white">
                    <AvatarFallback className={`text-sm font-medium ${avatarBgClasses[assignee.color as keyof typeof avatarBgClasses]}`}>
                      {assignee.initials}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}