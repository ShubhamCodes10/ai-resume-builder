import { NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const body: { data: string; format: 'points' | 'paras'; sectionType: string; numPoints: number } = await req.json();
    const { data, format, sectionType, numPoints } = body;

    if (!data || typeof data !== 'string' || !data.trim()) {
      return new Response(JSON.stringify({ error: 'Invalid or missing data input' }), { status: 400 });
    }

    if (!['points', 'paras'].includes(format)) {
      return new Response(JSON.stringify({ error: 'Invalid format. Choose either "points" or "paras".' }), { status: 400 });
    }

    const prompt = `You are an expert ATS-optimized content writer. Your task is to optimize the provided content for a specific section type of a resume (e.g., summary, experience, skills). You will:

    1. Focus exclusively on the specific section's content.
    2. Optimize the content for ATS requirements, using strategic keywords and formatting relevant to the section type.
    3. Ensure the content is clear, concise, and easily parsed by Applicant Tracking Systems.
    4. Preserve the original meaning, context, and key achievements of the content without altering the intent or introducing fictional information.
    5. Tailor the optimization to the section's requirements while maintaining the exact number of ${numPoints} points in your response.
    6. DO NOT use any markdown formatting (no asterisks, no bold markers).

    Important guidelines:
    - Only generate the optimized content for the specified section type.
    - Do not modify or distort the original meaning or intent of the provided data.
    - Ensure maximum ATS compatibility while maintaining authenticity and clarity.
    - Your response MUST contain exactly ${numPoints} distinct points.
    - Do not include any asterisks (*) or other markdown formatting in the response.

    Input Details:
    Data: ${data}
    Format: ${format}
    Section Type: ${sectionType}
    Number of Points: ${numPoints}

    Generate the optimized content directly, tailored specifically for the provided section type, while strictly maintaining ${numPoints} distinct points and preserving the original meaning.`;


    const model = genAi.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    
    // Clean up the response by removing asterisks and other markdown formatting
    let cleanedResponse = result.response.text()
      .replace(/\*\*/g, '')  // Remove double asterisks
      .replace(/\*/g, '')    // Remove single asterisks
      .replace(/_{2,}/g, '') // Remove underscores
      .replace(/#{1,6}\s/g, ''); // Remove heading markers

    return new Response(
      JSON.stringify({ response: cleanedResponse }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error generating content:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}

