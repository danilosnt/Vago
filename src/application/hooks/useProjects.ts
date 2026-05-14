import { useState, useEffect } from 'react';
import type { Project } from '../../domain/models/types';
import { LocalStorageRepository } from '../../infrastructure/storage/localStorageRepository';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

const projectRepo = new LocalStorageRepository<Project>('digitec_projects');

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(projectRepo.getAll());
  }, []);

  const addProject = (name: string, description: string) => {
    const newProject: Project = {
      id: uuidv4(),
      name,
      description,
      createdAt: new Date().toISOString(),
    };
    projectRepo.add(newProject);
    setProjects(projectRepo.getAll());
    toast.success('Obra criada com sucesso!');
  };

  const removeProject = (id: string) => {
    projectRepo.remove(id);
    setProjects(projectRepo.getAll());
    // Also remove associated costs
    const costRepo = new LocalStorageRepository<any>('digitec_costs');
    const allCosts = costRepo.getAll();
    const filteredCosts = allCosts.filter((cost: any) => cost.projectId !== id);
    costRepo.saveAll(filteredCosts);
    toast.success('Obra removida com sucesso!');
  };

  return {
    projects,
    addProject,
    removeProject,
  };
};
