import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjects } from '../../application/hooks/useProjects';
import { useCosts } from '../../application/hooks/useCosts';
import { Dashboard } from '../features/Dashboard';
import { CostForm } from '../features/CostForm';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Select } from '../components/Select';
import { formatCurrency } from '../../utils/formatCurrency';
import { Plus, ArrowLeft, Trash2, ReceiptText, Filter } from 'lucide-react';

export const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { projects } = useProjects();
  const project = projects.find(p => p.id === id);

  const {
    costs,
    addCost,
    removeCost,
    filterCategory,
    setFilterCategory,
    filterStatus,
    setFilterStatus,
    dashboardMetrics,
  } = useCosts(id || '');

  const [isFormOpen, setIsFormOpen] = useState(false);

  if (!project) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800">Obra não encontrada</h2>
        <Link to="/" className="mt-4 inline-block text-primary-600 hover:text-primary-700">
          <ArrowLeft className="inline mr-2" size={16} /> Voltar para lista
        </Link>
      </div>
    );
  }

  const statusColor = {
    'Pago': 'bg-emerald-100 text-emerald-800',
    'Pendente': 'bg-rose-100 text-rose-800',
    'Parcial': 'bg-amber-100 text-amber-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <Link to="/" className="p-2 bg-white rounded-full shadow-sm text-slate-500 hover:text-primary-600 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
          <p className="text-slate-500 text-sm">Gestão de Custos</p>
        </div>
      </div>

      <Dashboard metrics={dashboardMetrics} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 text-slate-700 font-medium">
          <Filter size={18} className="text-slate-400" /> Filtros:
        </div>
        <div className="flex flex-1 w-full sm:w-auto gap-4">
          <Select
            className="flex-1"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            options={[
              { label: 'Todas as Categorias', value: '' },
              { label: 'Material', value: 'Material' },
              { label: 'Mão de Obra', value: 'Mão de Obra' },
              { label: 'Equipamento', value: 'Equipamento' },
              { label: 'Transporte', value: 'Transporte' },
              { label: 'Alimentação', value: 'Alimentação' },
              { label: 'Outros', value: 'Outros' },
            ]}
          />
          <Select
            className="flex-1"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { label: 'Todos os Status', value: '' },
              { label: 'Pago', value: 'Pago' },
              { label: 'Pendente', value: 'Pendente' },
              { label: 'Parcial', value: 'Parcial' },
            ]}
          />
        </div>
        <Button icon={<Plus size={18} />} onClick={() => setIsFormOpen(!isFormOpen)}>
          {isFormOpen ? 'Fechar Formulário' : 'Novo Custo'}
        </Button>
      </div>

      {isFormOpen && (
        <CostForm 
          onSave={(cost) => {
            addCost(cost);
            setIsFormOpen(false);
          }} 
          onCancel={() => setIsFormOpen(false)} 
        />
      )}

      <Card className="overflow-hidden border-slate-200">
        {costs.length === 0 ? (
          <div className="text-center py-16">
            <ReceiptText className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-2 text-sm font-semibold text-slate-900">Nenhum custo encontrado</h3>
            <p className="mt-1 text-sm text-slate-500">
              Não há registros para os filtros selecionados ou nenhum custo foi adicionado ainda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Descrição / Data</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Categoria / Pgto</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Valor</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {costs.map((cost) => (
                  <tr key={cost.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{cost.name}</div>
                      <div className="text-sm text-slate-500">
                        {new Date(cost.date).toLocaleDateString('pt-BR')}
                        {cost.observations && <span className="ml-2 text-xs italic text-slate-400" title={cost.observations}>(obs)</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{cost.category}</div>
                      <div className="text-sm text-slate-500">{cost.paymentMethod}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor[cost.paymentStatus]}`}>
                        {cost.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-slate-900">
                      {formatCurrency(cost.value)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          if (window.confirm('Deseja realmente remover este custo?')) {
                            removeCost(cost.id);
                          }
                        }}
                        className="text-slate-400 hover:text-red-600 transition-colors"
                        title="Remover Custo"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
