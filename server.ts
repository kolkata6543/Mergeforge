import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Allow large image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize GoogleGenAI with telemetry User-Agent
const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('Warning: GEMINI_API_KEY is not defined in environment.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

/**
 * Clean base64 image data helper
 */
function parseBase64(dataUriOrRaw: string): { data: string; mimeType: string } {
  const match = dataUriOrRaw.match(/^data:([^;]+);base64,(.+)$/);
  if (match) {
    return { mimeType: match[1], data: match[2] };
  }
  return { mimeType: 'image/jpeg', data: dataUriOrRaw };
}

/**
 * Route: /api/analyze-caption
 * Core feature: AI analyzes the image context and suggests 5 funny, relevant captions
 * Strictly uses model gemini-4-argon for image understanding, with gemini-3.8-flash fallback.
 */
app.post('/api/analyze-caption', async (req, res) => {
  try {
    const { image, userHint, tone } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Image is required for Magic Caption' });
    }

    const { data: base64Data, mimeType } = parseBase64(image);
    const ai = getAI();

    const toneDirective = tone ? `Tone preference: ${tone}.` : 'Tone: internet meme culture, sharp, hilarious, relatable.';
    const hintDirective = userHint ? `User context/topic to weave in: "${userHint}".` : '';

    const promptText = `You are a legendary meme creator, culture critic, and comedy genius.
Examine this image in depth: understand the focal facial expressions, character body language, background details, subtle ironic juxtapositions, and emotional subtext.

${toneDirective}
${hintDirective}

Provide exactly 5 distinct, punchy, laugh-out-loud funny meme captions tailored specifically to what is shown in this picture.
Ensure a great variety:
1. Relatable everyday life / procrastinating / adulting / sleep deprivation
2. Brutally honest sarcasm / corporate / work / school humor
3. Classic top-bottom meme punchline setup
4. Unhinged / Absurdist / "Me at 3am" / "Nobody: Absolutely Nobody:"
5. Emotional reaction / catastrophic overthinking / panic

Requirements:
- Each caption must have a full "text" string.
- Provide "topText" and "bottomText" if suitable for a two-liner split, or leave them as clean parts.
- Assign an appropriate style: "relatable" | "sarcastic" | "absurdist" | "work_tech" | "classic"
- Provide a punchy "toneTag" (e.g., "Work Mode", "Pure Chaos", "Overthinking", "Too Real", "Dead Inside")
- Provide a 1-sentence "punchlineDescription" explaining the comedic observation.
- Provide a 1-sentence "imageAnalysis" describing what is visually happening.`;

    let resultJson: any = null;

    // Primary: model gemini-4-argon as specified in requirements
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-4-argon',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType,
                data: base64Data,
              },
            },
            {
              text: promptText,
            },
          ],
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              imageAnalysis: { type: Type.STRING },
              captions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    text: { type: Type.STRING },
                    topText: { type: Type.STRING },
                    bottomText: { type: Type.STRING },
                    style: { type: Type.STRING },
                    toneTag: { type: Type.STRING },
                    punchlineDescription: { type: Type.STRING },
                  },
                  required: ['id', 'text', 'style', 'toneTag'],
                },
              },
            },
            required: ['imageAnalysis', 'captions'],
          },
        },
      });

      if (response.text) {
        resultJson = JSON.parse(response.text);
      }
    } catch (primaryErr: any) {
      console.warn('gemini-4-argon call failed, attempting fallback to gemini-3.8-flash:', primaryErr.message);

      // Fallback: gemini-3.8-flash
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType,
                data: base64Data,
              },
            },
            {
              text: promptText,
            },
          ],
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              imageAnalysis: { type: Type.STRING },
              captions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    text: { type: Type.STRING },
                    topText: { type: Type.STRING },
                    bottomText: { type: Type.STRING },
                    style: { type: Type.STRING },
                    toneTag: { type: Type.STRING },
                    punchlineDescription: { type: Type.STRING },
                  },
                  required: ['id', 'text', 'style', 'toneTag'],
                },
              },
            },
            required: ['imageAnalysis', 'captions'],
          },
        },
      });

      if (fallbackResponse.text) {
        resultJson = JSON.parse(fallbackResponse.text);
      }
    }

    if (!resultJson || !resultJson.captions) {
      throw new Error('Failed to parse AI response into meme captions');
    }

    // Ensure IDs are present
    const formattedCaptions = resultJson.captions.map((c: any, index: number) => ({
      id: c.id || `caption-${index + 1}-${Date.now()}`,
      text: c.text || '',
      topText: c.topText || (c.text.includes('\n') ? c.text.split('\n')[0] : c.text),
      bottomText: c.bottomText || (c.text.includes('\n') ? c.text.split('\n')[1] : ''),
      style: c.style || 'relatable',
      toneTag: c.toneTag || 'Humor',
      punchlineDescription: c.punchlineDescription || 'Matches the visual vibe of this meme.',
    }));

    return res.json({
      imageAnalysis: resultJson.imageAnalysis || 'Context analyzed successfully.',
      captions: formattedCaptions.slice(0, 5),
    });
  } catch (error: any) {
    console.error('Error generating captions:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate captions',
    });
  }
});

/**
 * Route: /api/generate-image
 * Create or edit meme images using gemini-nano-banana-2.1 with fallback to gemini-3.1-flash-lite-image
 */
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, baseImage, mode, aspectRatio = '1:1' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getAI();
    let imageUrl: string | null = null;

    // If editing existing image
    if (mode === 'edit' && baseImage) {
      const { data: base64Data, mimeType } = parseBase64(baseImage);
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-nano-banana-2.1',
          contents: {
            parts: [
              {
                inlineData: {
                  data: base64Data,
                  mimeType,
                },
              },
              {
                text: `Edit this meme image: ${prompt}. Maintain comic/meme energy, clean subject separation, vibrant visuals.`,
              },
            ],
          },
          config: {
            imageConfig: {
              aspectRatio: aspectRatio as any,
              imageSize: '1K',
            },
          },
        });

        if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
              break;
            }
          }
        }
      } catch (editErr: any) {
        console.warn('gemini-nano-banana-2.1 edit failed, trying gemini-3.1-flash-lite-image:', editErr.message);
        const fallbackResponse = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: {
            parts: [
              {
                inlineData: {
                  data: base64Data,
                  mimeType,
                },
              },
              {
                text: prompt,
              },
            ],
          },
        });
        if (fallbackResponse.candidates?.[0]?.content?.parts) {
          for (const part of fallbackResponse.candidates[0].content.parts) {
            if (part.inlineData) {
              imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
              break;
            }
          }
        }
      }
    } else {
      // Create new meme image from text prompt
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-nano-banana-2.1',
          contents: {
            parts: [
              {
                text: `Meme format photo, hilarious internet meme scene, viral meme template: ${prompt}. High quality, funny, clear focal point, cinematic meme lighting.`,
              },
            ],
          },
          config: {
            imageConfig: {
              aspectRatio: aspectRatio as any,
              imageSize: '1K',
            },
          },
        });

        if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
              break;
            }
          }
        }
      } catch (genErr: any) {
        console.warn('gemini-nano-banana-2.1 gen failed, trying gemini-3.1-flash-lite-image:', genErr.message);
        const fallbackResponse = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: {
            parts: [
              {
                text: `Meme template photo: ${prompt}. High quality, vivid, hilarious expression.`,
              },
            ],
          },
        });
        if (fallbackResponse.candidates?.[0]?.content?.parts) {
          for (const part of fallbackResponse.candidates[0].content.parts) {
            if (part.inlineData) {
              imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
              break;
            }
          }
        }
      }
    }

    if (!imageUrl) {
      throw new Error('Image model did not return image data');
    }

    return res.json({ imageUrl });
  } catch (error: any) {
    console.error('Error generating image:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate image',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MemeForge AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
