import React from 'react';
import { Card } from '../components/Card';
import { formatCurrency } from '../../utils/formatCurrency';
import { Wallet, Clock, Activity } from 'lucide-react';

interface DashboardProps {
  metrics: {
    totalCost: number;
    totalPaid: number;
    totalPending: number;
  };
}

export const Dashboard: React.FC<DashboardProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Activity className="h-8 w-8 text-white" />
          </div>
          <div>
            <p className="text-blue-100 font-medium text-sm">Custo Total da Obra</p>
            <h3 className="text-3xl font-bold mt-1 tracking-tight">{formatCurrency(metrics.totalCost)}</h3>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-none">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Wallet className="h-8 w-8 text-white" />
          </div>
          <div>
            <p className="text-emerald-100 font-medium text-sm">Total Pago</p>
            <h3 className="text-3xl font-bold mt-1 tracking-tight">{formatCurrency(metrics.totalPaid)}</h3>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-rose-500 to-rose-600 text-white border-none">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Clock className="h-8 w-8 text-white" />
          </div>
          <div>
            <p className="text-rose-100 font-medium text-sm">Total Pendente</p>
            <h3 className="text-3xl font-bold mt-1 tracking-tight">{formatCurrency(metrics.totalPending)}</h3>
          </div>
        </div>
      </Card>
    </div>
  );
};
