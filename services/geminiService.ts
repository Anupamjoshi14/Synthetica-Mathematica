import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { IMOSubject, SynthesisResult, Language, ProblemDifficulty, GeneratedProblem, Solution, ReasoningStep, VerificationResult } from "../types";
import { DIFFICULTIES, IMO_SUBJECTS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const solutionSchema = {
    type: Type.OBJECT,
    properties: {
        methodName: {
            type: Type.STRING,
            description: "The name of the solution method (e.g., 'Synthetic Geometry', 'Coordinate Bash', 'Vector Approach'). This field MUST be in English.",
        },
        elegance: {
            type: Type.STRING,
            enum: ['High', 'Medium', 'Low'],
            description: "An assessment of the solution's elegance and conciseness. High is best. This field MUST be in English.",
        },
        formalization: {
            type: Type.STRING,
            description: "A concise, formal representation of the user's problem using mathematical or logical notation, specific to this solution method.",
        },
        reasoningTrace: {
            type: Type.ARRAY,
            description: "A step-by-step breakdown of the logical process to solve the problem for this specific method.",
            items: {
                type: Type.OBJECT,
                properties: {
                  id: {
                    type: Type.STRING,
                    description: "A unique identifier for the step (e.g., 'S1', 'L2').",
                  },
                  type: {
                    type: Type.STRING,
                    enum: ['Hypothesis', 'Axiom', 'Lemma', 'Deduction', 'Conclusion'],
                    description: "The type of reasoning step. This field MUST be in English.",
                  },
                  statement: {
                    type: Type.STRING,
                    description: "The core logical or mathematical statement of this step.",
                  },
                  justification: {
                    type: Type.STRING,
                    description: "Explanation of why this step is valid, referencing previous steps by their IDs if necessary.",
                  },
                  dependencies: {
                    type: Type.ARRAY,
                    description: "An array of IDs of the steps that this step directly depends on.",
                    items: { type: Type.STRING },
                  },
                },
                required: ['id', 'type', 'statement', 'justification', 'dependencies'],
            },
        },
        geometricVisualization: {
            type: Type.STRING,
            description: "If the identified subject is 'Geometry', this MUST be a single, self-contained SVG string representing the geometric diagram for the problem. The SVG MUST be 400x400 pixels. Use a dark theme: background '#1e293b', lines 'rgba(255, 255, 255, 0.6)', points as small circles with fill '#22d3ee', and labels in white text. The SVG should not have any XML or DOCTYPE headers, just the <svg> tag and its content. For all other subjects, this field should be an empty string.",
        },
    },
    required: ['methodName', 'elegance', 'formalization', 'reasoningTrace', 'geometricVisualization'],
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    solutions: {
        type: Type.ARRAY,
        description: "An array of one or more distinct solutions to the problem. If possible, provide multiple methods (e.g., synthetic, coordinate).",
        items: solutionSchema,
    },
    interconnections: {
        type: Type.ARRAY,
        description: "An array of objects representing a knowledge graph of related concepts.",
        items: {
            type: Type.OBJECT,
            properties: {
                source: { type: Type.STRING },
                target: { type: Type.STRING },
            },
            required: ['source', 'target'],
        },
    },
    difficulty: {
        type: Type.STRING,
        enum: DIFFICULTIES,
        description: "An estimation of the problem's difficulty.",
    },
    solveTime: {
        type: Type.NUMBER,
        description: "A plausible time in seconds for an AGI to solve this problem.",
    },
    subject: {
        type: Type.STRING,
        enum: IMO_SUBJECTS,
        description: "The primary mathematical subject of the problem (e.g., 'Geometry', 'Number Theory'). This field MUST be in English.",
    },
  },
  required: ['solutions', 'interconnections', 'difficulty', 'solveTime', 'subject'],
};

const getSystemInstruction = (language: Language): string => {
  const languageName = language === 'hi' ? 'Hindi' : 'English';
  return `You are 'Synthetica Mathematica,' a world-class AGI specializing in all core subjects of the International Mathematical Olympiad (IMO): Geometry, Number Theory, Algebra, and Combinatorics. Your task is to receive a math problem, identify its subject, and produce multiple, distinct, and rigorous solutions.

**Core Task: Multi-Solution Synthesis**
1.  **Identify the Subject**: First, analyze the problem to determine its primary mathematical subject from the list: 'Geometry', 'Number Theory', 'Algebra', 'Combinatorics'. You MUST set this in the 'subject' field of your response.
2.  **Generate Multiple Solutions**: For the given problem, generate at least one, and preferably two or more, distinct solutions. For example, for an algebra problem, you might provide a solution using polynomial manipulation and another using inequalities.
3.  **Detail Each Solution**: Each solution must be a self-contained object with its own \`methodName\`, \`elegance\` rating, \`formalization\`, and \`reasoningTrace\`.
4.  **Assess Elegance**: For each solution, provide an \`elegance\` rating ('High', 'Medium', 'Low'). A 'High' elegance solution is typically concise, insightful, and avoids brute-force calculations. A 'Low' elegance solution might be a correct but lengthy "bash".
5.  **Generate Geometric Visualization (Conditional)**: If and only if the identified subject is 'Geometry', you MUST create a 'geometricVisualization'. This should be a single, valid, self-contained SVG string of size 400x400 pixels. The SVG should visually represent the geometric objects in the problem. Use a dark theme: background '#1e293b', lines 'rgba(255, 255, 255, 0.6)', points as small circles with fill '#22d3ee', and labels in white text. The response for this field must be only the SVG content, starting with \`<svg ...>\` and ending with \`</svg>\`. For any subject other than Geometry, this field MUST be an empty string ("").

You MUST provide your entire response as a single, well-formed JSON object that adheres to the provided schema. Do NOT use markdown or any other formatting.

IMPORTANT: The user has requested the output in ${languageName}. All textual content in your response (specifically the 'formalization', 'statement', 'justification', and concept names within 'interconnections') MUST be in ${languageName}.

However, for structural consistency, the 'type' field within each 'reasoningTrace' object, the 'methodName', 'elegance', and top-level 'subject' field MUST ALWAYS be in English.

The top-level JSON object will contain these keys: 'solutions', 'interconnections', 'difficulty', 'solveTime', and 'subject'.`;
}

export async function synthesize(prompt: string, subject: IMOSubject, difficulty: ProblemDifficulty, language: Language): Promise<SynthesisResult> {
  const fullPrompt = `User-Assessed Difficulty: ${difficulty}\nPrimary Subject: ${subject}\nProblem: ${prompt}`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
      config: {
        systemInstruction: getSystemInstruction(language),
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const text = response.text.trim();
    // Sanitize the response to remove potential markdown wrappers if the model misbehaves.
    const sanitizedText = text.startsWith('```json') ? text.substring(7, text.length - 3).trim() : text;
    const result = JSON.parse(sanitizedText) as SynthesisResult;
    return result;

  } catch (error) {
    console.error("Error during Gemini API call:", error);
    if (error instanceof Error) {
        throw new Error(`API Error: ${error.message}. The model might have failed to generate valid JSON.`);
    }
    throw new Error("An unknown error occurred during the API call.");
  }
}

const generationResponseSchema = {
    type: Type.OBJECT,
    properties: {
        problem: {
            type: Type.STRING,
            description: "The full text of the generated math problem."
        },
        subject: {
            type: Type.STRING,
            enum: IMO_SUBJECTS,
            description: "The subject of the generated problem. Must be one of the provided IMO subjects."
        },
        difficulty: {
            type: Type.STRING,
            enum: DIFFICULTIES,
            description: "The difficulty of the generated problem. Must be one of the provided difficulty levels."
        },
    },
    required: ['problem', 'subject', 'difficulty'],
};

const getGenerationSystemInstruction = (language: Language): string => {
    const languageName = language === 'hi' ? 'Hindi' : 'English';
    return `You are an expert mathematician and a creative problem setter for the International Mathematical Olympiad (IMO). Your task is to generate a new, interesting, and challenging math problem based on user-provided parameters.

You MUST provide your entire response as a single, well-formed JSON object that adheres to the provided schema. Do NOT use markdown or any other formatting.

The user has requested the problem statement in ${languageName}. The 'problem' field in your JSON response must be in ${languageName}.

The 'subject' and 'difficulty' fields must correspond to the user's request and must be one of the provided enum values.`;
}

export async function generateProblem(subject: IMOSubject, difficulty: ProblemDifficulty, language: Language, concepts: string): Promise<GeneratedProblem> {
    const prompt = `Generate a math problem with the following characteristics:
- Subject: ${subject}
- Difficulty: ${difficulty}
${concepts ? `- Must involve the following key concepts: ${concepts}` : ''}
- The problem statement should be novel and engaging.`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: getGenerationSystemInstruction(language),
                responseMimeType: "application/json",
                responseSchema: generationResponseSchema,
            }
        });
        
        const text = response.text.trim();
        const sanitizedText = text.startsWith('```json') ? text.substring(7, text.length - 3).trim() : text;
        const result = JSON.parse(sanitizedText) as GeneratedProblem;
        return result;

    } catch (error) {
        console.error("Error during Gemini API call for problem generation:", error);
        if (error instanceof Error) {
            throw new Error(`API Error: ${error.message}. The model might have failed to generate valid JSON.`);
        }
        throw new Error("An unknown error occurred during the problem generation API call.");
    }
}


const verificationResponseSchema = {
    type: Type.OBJECT,
    properties: {
        isValid: {
            type: Type.BOOLEAN,
            description: "Is the user's proposed step logically correct and relevant?"
        },
        feedback: {
            type: Type.STRING,
            description: "Concise, helpful feedback for the user about their proposed step. Explain why it is valid or invalid."
        },
        formalizedStep: {
            type: Type.OBJECT,
            description: "If the step is valid, provide the full, formalized ReasoningStep object. If invalid, this should be null.",
            properties: {
                id: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['Hypothesis', 'Axiom', 'Lemma', 'Deduction', 'Conclusion'] },
                statement: { type: Type.STRING },
                justification: { type: Type.STRING },
                dependencies: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            nullable: true,
        },
        suggestions: {
            type: Type.ARRAY,
            description: "If the step is valid, provide 2-3 short, distinct suggestions for what the user could try to prove next. If invalid, provide suggestions on how to correct the mistake.",
            items: { type: Type.STRING }
        }
    },
    required: ['isValid', 'feedback', 'formalizedStep', 'suggestions'],
};


const getWorkbenchSystemInstruction = (language: Language): string => {
    const languageName = language === 'hi' ? 'Hindi' : 'English';
    return `You are an interactive Proof Assistant for 'Synthetica Mathematica'. Your role is to guide a user as they build a mathematical proof step-by-step.

You will receive the main problem, a list of existing, already-validated proof steps, and a new 'proposedStep' from the user.

Your task is to:
1.  **Evaluate**: Analyze the 'proposedStep' in the context of the 'problem' and 'existingSteps'. Is it a logically sound deduction? Is it relevant?
2.  **Provide Feedback**: Based on your evaluation, set 'isValid' to true or false. Write a concise, helpful 'feedback' message explaining your reasoning.
3.  **Formalize if Valid**: If 'isValid' is true, you MUST create a complete 'formalizedStep' object.
    -   Generate a new sequential 'id' (e.g., if last step was 'S3', the new one is 'S4').
    -   Determine the correct 'type' ('Hypothesis', 'Deduction', etc.).
    -   Rephrase the user's step into a clear, formal 'statement'.
    -   Write a 'justification', referencing dependencies by their ID (e.g., "From S1 and S2.").
    -   List the 'dependencies' as an array of IDs.
4.  **Suggest Next Steps**: Provide a few distinct and helpful 'suggestions'. If the step was valid, suggest what to prove next. If it was invalid, suggest how the user might correct their reasoning.

**Language**: All text in 'feedback', 'statement', 'justification', and 'suggestions' MUST be in ${languageName}. The 'type' field in the 'formalizedStep' MUST be in English.

You MUST respond with a single, well-formed JSON object adhering to the schema. No markdown.`;
};


export async function verifyAndSuggestStep(problem: string, existingSteps: ReasoningStep[], proposedStep: string, language: Language): Promise<VerificationResult> {
    const prompt = `
Problem: "${problem}"

Existing Steps:
${JSON.stringify(existingSteps, null, 2)}

Proposed Next Step: "${proposedStep}"

Please evaluate my proposed step.`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: getWorkbenchSystemInstruction(language),
                responseMimeType: "application/json",
                responseSchema: verificationResponseSchema,
            }
        });
        
        const text = response.text.trim();
        const sanitizedText = text.startsWith('```json') ? text.substring(7, text.length - 3).trim() : text;
        const result = JSON.parse(sanitizedText) as VerificationResult;
        return result;

    } catch (error) {
        console.error("Error during Gemini API call for step verification:", error);
        if (error instanceof Error) {
            throw new Error(`API Error: ${error.message}. The model might have failed to generate valid JSON.`);
        }
        throw new Error("An unknown error occurred during the step verification API call.");
    }
}