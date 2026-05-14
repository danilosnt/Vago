import React, { useState } from 'react';
import { useProjects } from '../../application/hooks/useProjects';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Building2, Plus, Trash2, ChevronRight, FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProjectsPage: React.FC = () => {
  const { projects, addProject, removeProject } = useProjects();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addProject(name, description);
      setName('');
      setDescription('');
      setIsFormOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Minhas Obras</h1>
        <Button 
          icon={<Plus size={18} />} 
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          {isFormOpen ? 'Cancelar' : 'Nova Obra'}
        </Button>
      </div>

      {isFormOpen && (
        <Card className="p-6 bg-primary-50 border-primary-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nome da Obra *"
                placeholder="Ex: Reforma da Casa"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Descrição"
                placeholder="Ex: Reforma geral com ampliação"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Salvar Obra</Button>
            </div>
          </form>
        </Card>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
          <FolderOpen className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-sm font-semibold text-slate-900">Nenhuma obra cadastrada</h3>
          <p className="mt-1 text-sm text-slate-500">Comece criando sua primeira obra para gerenciar os custos.</p>
          <div className="mt-6">
            <Button onClick={() => setIsFormOpen(true)} icon={<Plus size={18} />}>
              Nova Obra
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow group flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-slate-900 line-clamp-1">{project.name}</h3>
                      <p className="text-sm text-slate-500">
                        {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (window.confirm('Tem certeza que deseja remover esta obra e todos os seus custos?')) {
                        removeProject(project.id);
                      }
                    }}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                    title="Remover Obra"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <p className="mt-4 text-slate-600 text-sm line-clamp-2">
                  {project.description || 'Sem descrição.'}
                </p>
              </div>
              <div className="bg-slate-50 border-t border-slate-100 p-4">
                <Link
                  to={`/project/${project.id}`}
                  className="flex items-center justify-center w-full text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
                >
                  Gerenciar Custos
                  <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
