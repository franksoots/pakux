import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Prospect = {
  company: string;
  website?: string | null;
  address?: string;
  phone?: string | null;
  types?: string[];
  contact?: {
    name?: string;
    email?: string | null;
    position?: string | null;
    confidence?: number | null;
  } | null;
};

export async function POST(
  request: Request,
) {
  try {
    const body = await request.json();

    const offer =
      String(body.offer || "").trim();

    const customer =
      String(body.customer || "").trim();

    const prospects =
      Array.isArray(body.prospects)
        ? (body.prospects as Prospect[])
        : [];

    if (!offer || !customer) {
      return NextResponse.json(
        {
          error:
            "Offer and customer description are required.",
        },
        { status: 400 },
      );
    }

    if (prospects.length === 0) {
      return NextResponse.json(
        {
          error:
            "No prospects were provided.",
        },
        { status: 400 },
      );
    }

    const limitedProspects =
      prospects.slice(0, 20);

    const prompt = `
You are the AI qualification engine for Pakux, a B2B prospecting platform.

The user sells:

${offer}

Their target customers are:

${customer}

Your job is to evaluate the businesses below as potential customers.

IMPORTANT:
- Do NOT judge whether they are competitors.
- Judge whether they could realistically BUY the user's product or service.
- Use the available company information.
- Do not invent facts.
- If information is missing, say so.
- A high score means there is a strong apparent business fit.
- A low score means the company appears less relevant.
- Recommend the most appropriate type of decision maker to contact.
- Keep explanations concise and useful for sales.

Return ONLY valid JSON in this exact structure:

{
  "prospects": [
    {
      "company": "Company name",
      "fit_score": 0,
      "priority": "high",
      "fit_reason": "Short explanation",
      "sales_angle": "A specific angle for approaching this company",
      "recommended_contact_role": "Marketing Manager"
    }
  ]
}

Priority rules:
- high = 80-100
- medium = 50-79
- low = 0-49

Businesses to evaluate:

${JSON.stringify(
  limitedProspects,
  null,
  2,
)}
`;

    const response =
      await openai.responses.create({
        model: "gpt-6-luna",
        input: prompt,
      });

    const text =
      response.output_text.trim();

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      console.error(
        "AI returned invalid JSON:",
        text,
      );

      return NextResponse.json(
        {
          error:
            "AI returned an invalid qualification response.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      results:
        parsed.prospects || [],
    });
  } catch (error) {
    console.error(
      "QUALIFICATION API ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Qualification failed.",
      },
      { status: 500 },
    );
  }
}