import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import type { CostCategory, PaymentMethod, PaymentStatus } from '../../domain/models/types';
import { extractCostFromText } from '../../infrastructure/api/geminiApi';
import { Sparkles, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface CostFormProps {
  onSave: (cost: any) => void;
  onCancel: () => void;
}

const CATEGORIES = ['Material', 'Mão de Obra', 'Equipamento', 'Transporte', 'Alimentação', 'Outros'];
const PAYMENT_METHODS = ['PIX', 'Dinheiro', 'Cartão', 'Boleto', 'Transferência', 'Outros'];
const PAYMENT_STATUS = ['Pago', 'Pendente', 'Parcial'];

export const CostForm: React.FC<CostFormProps> = ({ onSave, onCancel }) => {
  const [smartText, setSmartText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [observations, setObservations] = useState('');

  const handleSmartExtract = async () => {
    if (!smartText.trim()) return;
    setIsExtracting(true);
    try {
      const data = await extractCostFromText(smartText);
      if (data.name) setName(data.name);
      if (data.category && CATEGORIES.includes(data.category)) setCategory(data.category);
      if (data.value) setValue(data.value.toString());
      if (data.paymentMethod && PAYMENT_METHODS.includes(data.paymentMethod)) setPaymentMethod(data.paymentMethod);
      if (data.paymentStatus && PAYMENT_STATUS.includes(data.paymentStatus)) setPaymentStatus(data.paymentStatus);
      if (data.observations) setObservations(data.observations);
      
      toast.success('Dados extraídos com sucesso! Revise antes de salvar.');
    } catch (error) {
      toast.error('Erro ao extrair dados. Verifique sua chave API ou tente manualmente.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category || !value || !paymentMethod || !paymentStatus || !date) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }

    onSave({
      name,
      category: category as CostCategory,
      value: parseFloat(value),
      paymentMethod: paymentMethod as PaymentMethod,
      paymentStatus: paymentStatus as PaymentStatus,
      date,
      observations,
    });
  };

  return (
    <Card className="p-6 bg-white border-primary-200 shadow-md">
      <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
        <label className="flex items-center gap-2 text-sm font-semibold text-indigo-900 mb-2">
          <Sparkles size={16} className="text-indigo-600" />
          Lançamento Inteligente por IA
        </label>
        <div className="flex gap-2">
          <textarea
            className="flex-1 w-full rounded-md border-indigo-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            rows={2}
            placeholder='Ex: "Comprei cimento por 300 no pix e já tá pago"'
            value={smartText}
            onChange={(e) => setSmartText(e.target.value)}
          />
          <Button 
            onClick={handleSmartExtract} 
            disabled={isExtracting || !smartText.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 h-auto"
          >
            {isExtracting ? <Loader2 className="animate-spin" size={20} /> : 'Extrair'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Descrição do Custo *" value={name} onChange={e => setName(e.target.value)} required />
          <Input 
            label="Valor (R$) *" 
            type="number" 
            step="0.01" 
            min="0"
            value={value} 
            onChange={e => setValue(e.target.value)} 
            required 
          />
          
          <Select 
            label="Categoria *" 
            value={category} 
            onChange={e => setCategory(e.target.value)}
            options={CATEGORIES.map(c => ({ label: c, value: c }))}
            required
          />
          <Select 
            label="Forma de Pagamento *" 
            value={paymentMethod} 
            onChange={e => setPaymentMethod(e.target.value)}
            options={PAYMENT_METHODS.map(m => ({ label: m, value: m }))}
            required
          />
          
          <Select 
            label="Status *" 
            value={paymentStatus} 
            onChange={e => setPaymentStatus(e.target.value)}
            options={PAYMENT_STATUS.map(s => ({ label: s, value: s }))}
            required
          />
          <Input 
            label="Data *" 
            type="date" 
            value={date} 
            onChange={e => setDate(e.target.value)} 
            required 
          />
        </div>
        
        <div className="w-full">
          <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
          <textarea
            className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
            rows={2}
            value={observations}
            onChange={e => setObservations(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
          <Button type="submit">Salvar Custo</Button>
        </div>
      </form>
    </Card>
  );
};
