export type CostCategory = 'Material' | 'Mão de Obra' | 'Equipamento' | 'Transporte' | 'Alimentação' | 'Outros';
export type PaymentMethod = 'PIX' | 'Dinheiro' | 'Cartão' | 'Boleto' | 'Transferência' | 'Outros';
export type PaymentStatus = 'Pago' | 'Pendente' | 'Parcial';

export interface CostItem {
  id: string;
  projectId: string;
  name: string;
  category: CostCategory;
  value: number; // Stored in cents (or standard number, I will use standard number but handle carefully)
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  date: string; // ISO date string
  observations: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}
