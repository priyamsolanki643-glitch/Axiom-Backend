import { GoogleGenAI } from '@google/genai';

async function list() {
  const client = new GoogleGenAI({ apiKey: "AIzaSyCSB9xsxVZWXoFq56PtkeAvT113kpu5nVw" });
  try {
    const models = await client.models.list();
    for await (const m of models) {
      console.log(m.name);
    }
  } catch (e: any) {
    console.error("List failed:", e.message);
  }
}
list();
