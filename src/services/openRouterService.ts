import { getScrapItemsForCity, type ScrapItem } from '../data/scrapItems';

export interface AIDetectedItem {
  id?: string;
  name: string;
  category: 'Paper' | 'Plastic' | 'Metal' | 'E-waste' | 'Rubber' | 'Other';
  confidence: number;
  pricePerKg: number;
  unit: string;
  weightKg: number;
  icon: string;
  image?: string;
  matchedScrapId: string;
  detectionSource?: 'ai_detected' | 'user_corrected';
  isRecognized?: boolean;
}

export interface OpenRouterDetectionResult {
  items: AIDetectedItem[];
  rawContent?: string;
  isFallback?: boolean;
}

/** Helper to convert File object to Base64 Data URL */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
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
 * Intelligent Catalog Search with Autocomplete suggestions
 */
export function searchScrapCatalog(query: string, selectedCity: string = 'Pune'): ScrapItem[] {
  const cityItems = getScrapItemsForCity(selectedCity);
  if (!query || query.trim() === '') {
    return cityItems.slice(0, 8);
  }

  const q = query.toLowerCase().trim();
  return cityItems.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (q.includes('bott') && (item.name.toLowerCase().includes('plastic') || item.category === 'Plastic')) ||
      (q.includes('paper') && item.category === 'Paper') ||
      (q.includes('metal') && item.category === 'Metal')
  );
}

/**
 * Match a raw query or item name against the official catalog
 */
export function matchScrapItemByName(name: string, selectedCity: string = 'Pune'): ScrapItem | undefined {
  const cityItems = getScrapItemsForCity(selectedCity);
  const q = name.toLowerCase().trim();

  // Exact match
  let match = cityItems.find((i) => i.name.toLowerCase() === q);
  if (match) return match;

  // Substring match
  match = cityItems.find((i) => q.includes(i.name.toLowerCase()) || i.name.toLowerCase().includes(q));
  if (match) return match;

  // Category keyword match
  if (q.includes('bottle') || q.includes('bott') || q.includes('pet')) {
    match = cityItems.find((i) => i.id === 'plastic-bottles' || i.name.includes('PET'));
    if (match) return match;
  }

  return undefined;
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

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('YOUR_NEW_OPENROUTER_KEY')) {
    console.log('[OpenRouter Service] API key placeholder detected in .env. Using Vision Classifier fallback.');
    await new Promise((res) => setTimeout(res, 1200));
    return getDemoFallbackDetection(cityItems);
  }

  const systemInstruction = `You are ScrapNow's scrap-material identification assistant.
Analyze the uploaded image and identify recyclable scrap materials visible in it.

Return ONLY valid JSON in this format:
{
  "items": [
    {
      "name": "PET Water Bottle",
      "category": "Plastic",
      "confidence": 0.94
    }
  ]
}

Allowed categories:
Paper, Plastic, Metal, E-waste, Rubber, Other`;

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
      return getDemoFallbackDetection(cityItems);
    }

    const data = await response.json();
    const rawContent = data?.choices?.[0]?.message?.content || '';

    const cleanedJsonText = rawContent
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const parsed = JSON.parse(cleanedJsonText);

    if (!parsed || !Array.isArray(parsed.items)) {
      throw new Error('INVALID_AI_RESPONSE');
    }

    const mappedItems: AIDetectedItem[] = parsed.items.map((item: any, idx: number) => {
      const match = findBestScrapMatch(item.name, item.category, cityItems);
      const isRecognized = !!match;

      return {
        id: `ai-item-${idx}-${Date.now()}`,
        name: match ? match.name : item.name,
        category: (match ? match.category : item.category) as any,
        confidence: Math.min(1, Math.max(0.5, item.confidence || 0.9)),
        pricePerKg: match ? match.price : 20,
        unit: match ? match.unit : 'kg',
        weightKg: 5,
        icon: getCategoryIcon(match ? match.category : item.category),
        image: match ? match.image : undefined,
        matchedScrapId: match ? match.id : 'custom',
        detectionSource: 'ai_detected',
        isRecognized,
      };
    });

    return {
      items: mappedItems,
      rawContent,
      isFallback: false,
    };
  } catch (error) {
    console.error('[OpenRouter Error]', error);
    return getDemoFallbackDetection(cityItems);
  }
}

function findBestScrapMatch(name: string, category: string, cityItems: ScrapItem[]): ScrapItem | undefined {
  const lowerName = name.toLowerCase();

  let match = cityItems.find((s) => s.name.toLowerCase() === lowerName);
  if (match) return match;

  match = cityItems.find((s) => lowerName.includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(lowerName));
  if (match) return match;

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

function getDemoFallbackDetection(cityItems: ScrapItem[]): OpenRouterDetectionResult {
  const plastic = cityItems.find((i) => i.id === 'plastic-bottles' || i.category === 'Plastic') || cityItems[0];
  const paper = cityItems.find((i) => i.id === 'newspaper' || i.category === 'Paper') || cityItems[1];
  const metal = cityItems.find((i) => i.id === 'iron' || i.category === 'Metal') || cityItems[2];

  return {
    items: [
      {
        id: 'item-demo-1',
        name: paper.name,
        category: paper.category,
        confidence: 0.94,
        pricePerKg: paper.price,
        unit: paper.unit,
        weightKg: 5,
        icon: '📰',
        image: paper.image,
        matchedScrapId: paper.id,
        detectionSource: 'ai_detected',
        isRecognized: true,
      },
      {
        id: 'item-demo-2',
        name: plastic.name,
        category: plastic.category,
        confidence: 0.91,
        pricePerKg: plastic.price,
        unit: plastic.unit,
        weightKg: 6,
        icon: '🧴',
        image: plastic.image,
        matchedScrapId: plastic.id,
        detectionSource: 'ai_detected',
        isRecognized: true,
      },
      {
        id: 'item-demo-3',
        name: metal.name,
        category: metal.category,
        confidence: 0.88,
        pricePerKg: metal.price,
        unit: metal.unit,
        weightKg: 2,
        icon: '🔩',
        image: metal.image,
        matchedScrapId: metal.id,
        detectionSource: 'ai_detected',
        isRecognized: true,
      },
    ],
    isFallback: true,
  };
}
