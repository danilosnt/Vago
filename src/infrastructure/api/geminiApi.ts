import { GoogleGenerativeAI } from '@google/generative-ai';
import { Logger } from '../logger/logger';
import type { CostCategory, PaymentMethod, PaymentStatus } from '../../domain/models/types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;

if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
} else {
  Logger.warn('VITE_GEMINI_API_KEY is not defined in environment variables.');
}

export interface SmartCostExtraction {
  name: string;
  category: CostCategory;
  value: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  observations: string;
}

export const extractCostFromText = async (text: string): Promise<Partial<SmartCostExtraction>> => {
  if (!genAI) {
    Logger.error('Gemini API is not initialized. Check your API key.');
    throw new Error('Gemini API is not configured.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `
    Você é um assistente de gestão de obras. Extraia as informações financeiras do texto fornecido e retorne APENAS um objeto JSON válido, sem markdown, sem crases, sem nada além do JSON.
    As chaves do JSON devem ser estritamente:
    - "name" (string): Nome curto e descritivo do custo.
    - "category" (string): Uma destas exatas opções: "Material", "Mão de Obra", "Equipamento", "Transporte", "Alimentação", "Outros".
    - "value" (number): O valor monetário do custo.
    - "paymentMethod" (string): Uma destas exatas opções: "PIX", "Dinheiro", "Cartão", "Boleto", "Transferência", "Outros".
    - "paymentStatus" (string): Uma destas exatas opções: "Pago", "Pendente", "Parcial".
    - "observations" (string): Alguma observação extra presente no texto ou deixe vazio.

    Se não for possível inferir alguma informação com certeza, omita a chave no JSON ou deixe null/vazio.

    Texto do usuário: "${text}"
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean potential markdown from response
    const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsedData = JSON.parse(jsonStr);
    Logger.info('Gemini extraction successful', parsedData);
    return parsedData;
  } catch (error) {
    Logger.error('Error extracting cost from text using Gemini', error);
    throw error;
  }
};
