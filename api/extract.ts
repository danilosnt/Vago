import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
  }

  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Missing "text" field in request body.' });
  }

  try {
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

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Clean potential markdown from response
    const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(jsonStr);

    return res.status(200).json(parsedData);
  } catch (error: any) {
    console.error('Gemini API error:', error?.message || error);
    return res.status(500).json({ error: 'Failed to extract data from Gemini API.' });
  }
}
