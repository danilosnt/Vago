import { Logger } from '../logger/logger';
import type { CostCategory, PaymentMethod, PaymentStatus } from '../../domain/models/types';

export interface SmartCostExtraction {
  name: string;
  category: CostCategory;
  value: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  observations: string;
}

export const extractCostFromText = async (text: string): Promise<Partial<SmartCostExtraction>> => {
  // In production (Vercel), ALWAYS use the serverless function
  // In local dev, use client-side call if VITE_GEMINI_API_KEY is available
  const useClientSide = import.meta.env.DEV && !! import.meta.env.VITE_GEMINI_API_KEY;

  if (!useClientSide) {
    // --- Production path: call Vercel serverless function ---
    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const parsedData = await response.json();
      Logger.info('Gemini extraction successful (serverless)', parsedData);
      return parsedData;
    } catch (error) {
      Logger.error('Error calling serverless extract function', error);
      throw error;
    }
  } else {
    // --- Local dev path: direct client-side call ---
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
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
      const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(jsonStr);
      Logger.info('Gemini extraction successful (client-side)', parsedData);
      return parsedData;
    } catch (error) {
      Logger.error('Error extracting cost from text using Gemini (client-side)', error);
      throw error;
    }
  }
};
