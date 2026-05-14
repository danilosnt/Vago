import { useState, useEffect, useMemo } from 'react';
import type { CostItem } from '../../domain/models/types';
import { LocalStorageRepository } from '../../infrastructure/storage/localStorageRepository';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

const costRepo = new LocalStorageRepository<CostItem>('digitec_costs');

export const useCosts = (projectId: string) => {
  const [costs, setCosts] = useState<CostItem[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  useEffect(() => {
    loadCosts();
  }, [projectId]);

  const loadCosts = () => {
    const allCosts = costRepo.getAll();
    setCosts(allCosts.filter(cost => cost.projectId === projectId));
  };

  const addCost = (costData: Omit<CostItem, 'id' | 'projectId'>) => {
    const newCost: CostItem = {
      ...costData,
      id: uuidv4(),
      projectId,
    };
    costRepo.add(newCost);
    loadCosts();
    toast.success('Custo adicionado com sucesso!');
  };

  const removeCost = (id: string) => {
    costRepo.remove(id);
    loadCosts();
    toast.success('Custo removido com sucesso!');
  };

  const filteredCosts = useMemo(() => {
    return costs.filter(cost => {
      const matchCategory = filterCategory ? cost.category === filterCategory : true;
      const matchStatus = filterStatus ? cost.paymentStatus === filterStatus : true;
      return matchCategory && matchStatus;
    });
  }, [costs, filterCategory, filterStatus]);

  const dashboardMetrics = useMemo(() => {
    let totalCost = 0;
    let totalPaid = 0;
    let totalPending = 0;

    costs.forEach(cost => {
      totalCost += cost.value;
      if (cost.paymentStatus === 'Pago') {
        totalPaid += cost.value;
      } else if (cost.paymentStatus === 'Pendente') {
        totalPending += cost.value;
      } else if (cost.paymentStatus === 'Parcial') {
        // As per the rules, partial payment logic can be defined.
        // Let's assume 50% is paid for simplicity, or we just count it in neither if not strictly required.
        // Let's add half to paid and half to pending.
        totalPaid += cost.value / 2;
        totalPending += cost.value / 2;
      }
    });

    return { totalCost, totalPaid, totalPending };
  }, [costs]);

  return {
    costs: filteredCosts,
    allCosts: costs,
    addCost,
    removeCost,
    filterCategory,
    setFilterCategory,
    filterStatus,
    setFilterStatus,
    dashboardMetrics,
  };
};
