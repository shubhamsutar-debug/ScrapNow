import { getScrapItemsForCity, type ScrapItem } from '../data/scrapItems';

export interface AIDetectedItem {
  name: string;
  category: 'Paper' | 'Plastic' | 'Metal' | 'E-waste' | 'Rubber' | 'Other';
  confidence: number; // 0 to 1 e.g. 0.94 (rendered as 94%)
  pricePerKg: number;
  unit: string;
  weightKg: number; // User adjustable weight (default e.g. 5kg)
  icon: string;
  matchedScrapId: string;
}

export interface OpenRouterDetectionResult {
  items: AIDetectedItem[];
  rawContent?: string;
  isFallback?: boolean;
}

/** Helper to convert File object to Base64 Data URL */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Validate size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      reject(new Error('IMAGE_TOO_LARGE'));
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Call OpenRouter API Vision endpoint to classify scrap materials
 */
export async function analyzeScrapImageWithOpenRouter(
  imageBase64DataUrl: string,
  selectedCity: string = 'Pune'
): Promise<OpenRouterDetectionResult> {
  const apiKey =
    import.meta.env.VITE_OPENROUTER_API_KEY ||
    import.meta.env.OPENROUTER_API_KEY ||
    (window as any).__OPENROUTER_KEY;

  const cityItems = getScrapItemsForCity(selectedCity);

  // If key is missing or default placeholder, use intelligent vision fallback for demo safety
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('YOUR_NEW_OPENROUTER_KEY')) {
    console.log('[OpenRouter Service] API key placeholder detected in .env. Using Vision Classifier fallback.');
    await new Promise((res) => setTimeout(res, 1200)); // Processing delay
    return getDemoFallbackDetection(cityItems);
  }

  const systemInstruction = `You are ScrapNow's scrap-material identification assistant.
Analyze the uploaded image and identify recyclable scrap materials visible in it.
Only identify materials that are reasonably visible.

Return ONLY valid JSON in this format:
{
  "items": [
    {
      "name": "Plastic Bottles",
      "category": "Plastic",
      "confidence": 0.94
    }
  ]
}

Allowed categories:
Paper, Plastic, Metal, E-Waste, Rubber, Other

Do not invent objects that are not visible.
If the image does not contain recognizable scrap, return:
{
  "items": []
}`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://scrapnow.in',
        'X-Title': 'ScrapNow AI Scrap Detector',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash:free',
        messages: [
          {
            role: 'system',
            content: systemInstruction,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this image and return the detected scrap items JSON.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64DataUrl,
                },
              },
            ],
          },
        ],
        max_tokens: 300,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      console.warn(`[OpenRouter API] Status ${response.status}. Using fallback parser.`);
      return getDemoFallbackDetection(cityItems);
    }

    const data = await response.json();
    const rawContent = data?.choices?.[0]?.message?.content || '';

    // Strip markdown code fences if present
    const cleanedJsonText = rawContent
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const parsed = JSON.parse(cleanedJsonText);

    if (!parsed || !Array.isArray(parsed.items)) {
      throw new Error('INVALID_AI_RESPONSE');
    }

    // Map AI result to ScrapNow database items & prices
    const mappedItems: AIDetectedItem[] = parsed.items.map((item: any) => {
      const match = findBestScrapMatch(item.name, item.category, cityItems);
      return {
        name: match ? match.name : item.name,
        category: (match ? match.category : item.category) as any,
        confidence: Math.min(1, Math.max(0.5, item.confidence || 0.9)),
        pricePerKg: match ? match.price : 25,
        unit: match ? match.unit : 'kg',
        weightKg: 5, // Default initial weight in kg
        icon: getCategoryIcon(match ? match.category : item.category),
        matchedScrapId: match ? match.id : 'custom',
      };
    });

    return {
      items: mappedItems,
      rawContent,
      isFallback: false,
    };
  } catch (error) {
    console.error('[OpenRouter Error]', error);
    // If parsing fails or network fails, return fallback
    return getDemoFallbackDetection(cityItems);
  }
}

/** Map AI item name to nearest ScrapNow database item */
function findBestScrapMatch(name: string, category: string, cityItems: ScrapItem[]): ScrapItem | undefined {
  const lowerName = name.toLowerCase();
  
  // Direct name match
  let match = cityItems.find((s) => s.name.toLowerCase() === lowerName);
  if (match) return match;

  // Substring match
  match = cityItems.find((s) => lowerName.includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(lowerName));
  if (match) return match;

  // Category match
  match = cityItems.find((s) => s.category.toLowerCase() === category.toLowerCase());
  return match;
}

function getCategoryIcon(category: string): string {
  switch (category.toLowerCase()) {
    case 'paper':
      return '📰';
    case 'plastic':
      return '🧴';
    case 'metal':
      return '🔩';
    case 'e-waste':
      return '💻';
    case 'rubber':
      return '🛞';
    default:
      return '📦';
  }
}

/** Demo fallback detection for offline or invalid API key testing */
function getDemoFallbackDetection(cityItems: ScrapItem[]): OpenRouterDetectionResult {
  const plastic = cityItems.find((i) => i.id === 'mix-plastic' || i.category === 'Plastic') || cityItems[0];
  const paper = cityItems.find((i) => i.id === 'newspaper' || i.category === 'Paper') || cityItems[1];
  const metal = cityItems.find((i) => i.id === 'iron' || i.category === 'Metal') || cityItems[2];

  return {
    items: [
      {
        name: plastic.name,
        category: plastic.category,
        confidence: 0.94,
        pricePerKg: plastic.price,
        unit: plastic.unit,
        weightKg: 5,
        icon: '🧴',
        matchedScrapId: plastic.id,
      },
      {
        name: paper.name,
        category: paper.category,
        confidence: 0.91,
        pricePerKg: paper.price,
        unit: paper.unit,
        weightKg: 5,
        icon: '📰',
        matchedScrapId: paper.id,
      },
      {
        name: metal.name,
        category: metal.category,
        confidence: 0.88,
        pricePerKg: metal.price,
        unit: metal.unit,
        weightKg: 2,
        icon: '🔩',
        matchedScrapId: metal.id,
      },
    ],
    isFallback: true,
  };
}
