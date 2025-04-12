import { toast } from "@/components/ui/use-toast";

// Types for the business idea data
export interface BusinessIdea {
  title: string;
  description: string;
  industry: string;
  targetAudience: string;
  uniqueSelling: string;
}

// Types for the analysis response
export interface AnalysisResponse {
  strengthsWeaknesses: {
    strengths: string[];
    weaknesses: string[];
  };
  marketAnalysis: string;
  competitorAnalysis: string[];
  targetCustomer: {
    demographics: string;
    psychographics: string;
    painPoints: string[];
  };
  roadmap: {
    phase: string;
    tasks: string[];
    timeframe: string;
  }[];
  financialProjections: {
    initialInvestment: string;
    breakevenPoint: string;
    revenueStreams: string[];
  };
}

const API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Add your API key here or load it from environment variables
// IMPORTANT: Replace this with your actual Gemini API key
const API_KEY = "AIzaSyB1i62tOXe6jLJ-fm7jpDo4mF-HQpQCJYE";

export const generateBusinessAnalysis = async (idea: BusinessIdea): Promise<AnalysisResponse> => {
  try {
    // Construct the prompt for the Gemini API
    const prompt = `
    Analyze this business idea in detail and provide a comprehensive response:
    
    Title: ${idea.title}
    Description: ${idea.description}
    Industry: ${idea.industry}
    Target Audience: ${idea.targetAudience}
    Unique Selling Proposition: ${idea.uniqueSelling}
    
    Please provide the following in a structured format:
    1. Strengths analysis (minimum 3 points)
    2. Weaknesses analysis (minimum 3 points)
    3. Market analysis (market size, trends, opportunities)
    4. Competitor analysis (list at least 3 competitors and their positions)
    5. Target customer profile (demographics, psychographics, pain points)
    6. Implementation roadmap (at least 3 phases with specific tasks and timeframes)
    7. Financial projections (initial investment needed, breakeven point, revenue streams)
    
    Format your response as a structured business analysis with clearly labeled sections. 
    For lists, please use numbers (1., 2., 3.) instead of bullet points or asterisks.
    Provide clear section headings for each part of the analysis.
    `;

    // Call the Gemini API
    const response = await fetch(`${API_ENDPOINT}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to generate analysis");
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;

    // Parse the response into structured data
    const structuredResponse = parseGeminiResponse(generatedText);
    return structuredResponse;
  } catch (error) {
    console.error("Error generating business analysis:", error);
    toast({
      variant: "destructive",
      title: "Analysis failed",
      description: "Unable to generate business analysis. Please try again.",
    });
    throw error;
  }
};

// Helper function to extract list items with various formats
const extractListItems = (text: string): string[] => {
  // Handle different list formats (asterisks, hyphens, bullets, numbers)
  const items: string[] = [];
  
  // Split by newlines and process each line
  const lines = text.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) continue;
    
    // Check for common list item patterns
    if (/^[-*•]|\d+\./.test(trimmedLine)) {
      // Remove the list marker and trim
      const content = trimmedLine.replace(/^[-*•]|\d+\.\s*/, "").trim();
      
      // Only add non-empty items
      if (content) {
        // Clean any formatting characters like ** or * for emphasis
        const cleanContent = content.replace(/\*\*|\*/g, "");
        items.push(cleanContent);
      }
    } else if (items.length > 0 && !trimmedLine.includes(":") && !trimmedLine.match(/^[A-Za-z]+ \d+:/)) {
      // This might be a continuation of the previous list item
      // Append to the last item if it doesn't look like a new section header
      items[items.length - 1] += " " + trimmedLine;
    }
  }
  
  return items;
};

// Helper function to parse the text response into structured data
const parseGeminiResponse = (text: string): AnalysisResponse => {
  console.log("Parsing Gemini response");
  
  try {
    // Improved section extraction with more robust patterns
    // Use regex patterns that account for various heading formats
    const sections = {
      strengths: extractSection(text, 
        /(?:1\.?|Strengths analysis|Strengths)[:\s]+([\s\S]*?)(?=(?:2\.?|Weaknesses|Conclusion|$))/i),
      
      weaknesses: extractSection(text, 
        /(?:2\.?|Weaknesses analysis|Weaknesses)[:\s]+([\s\S]*?)(?=(?:3\.?|Market|Conclusion|$))/i),
      
      market: extractSection(text, 
        /(?:3\.?|Market analysis|Market)[:\s]+([\s\S]*?)(?=(?:4\.?|Competitor|Conclusion|$))/i),
      
      competitors: extractSection(text, 
        /(?:4\.?|Competitor analysis|Competitors?)[:\s]+([\s\S]*?)(?=(?:5\.?|Target|Customer|Conclusion|$))/i),
      
      customers: extractSection(text, 
        /(?:5\.?|Target customer|Customer profile)[:\s]+([\s\S]*?)(?=(?:6\.?|Implementation|Roadmap|Conclusion|$))/i),
      
      roadmap: extractSection(text, 
        /(?:6\.?|Implementation roadmap|Roadmap)[:\s]+([\s\S]*?)(?=(?:7\.?|Financial|Conclusion|$))/i),
      
      financial: extractSection(text, 
        /(?:7\.?|Financial projections|Financial)[:\s]+([\s\S]*?)(?=(?:Conclusion|$))/i)
    };

    // Extract customer sub-sections
    const customerSections = {
      demographics: extractSubSection(sections.customers, 
        /(?:Demographics|Profile)[:\s]+([\s\S]*?)(?=(?:Psychographics|Pain Points|$))/i),
      
      psychographics: extractSubSection(sections.customers, 
        /(?:Psychographics)[:\s]+([\s\S]*?)(?=(?:Pain Points|$))/i),
      
      painPoints: extractSubSection(sections.customers, 
        /(?:Pain Points)[:\s]+([\s\S]*?)(?=$)/i)
    };

    // Extract roadmap phases
    const roadmapPhases = extractRoadmapPhases(sections.roadmap);

    // Extract financial subsections
    const financialSections = {
      initialInvestment: extractFinancialValue(sections.financial, 
        /(?:Initial Investment|Investment Required|Investment Needed)[:\s]+([^,\n]*)/i),
      
      breakevenPoint: extractFinancialValue(sections.financial, 
        /(?:Break[-\s]?even Point|Break[-\s]?even)[:\s]+([^,\n]*)/i),
      
      revenueStreams: sections.financial ? extractListItems(
        extractSubSection(sections.financial, 
          /(?:Revenue Streams|Monetization|Revenue Model)[:\s]+([\s\S]*?)(?=$)/i)
      ) : []
    };

    // Build the structured response
    return {
      strengthsWeaknesses: {
        strengths: extractListItems(sections.strengths),
        weaknesses: extractListItems(sections.weaknesses)
      },
      marketAnalysis: cleanText(sections.market),
      competitorAnalysis: extractListItems(sections.competitors),
      targetCustomer: {
        demographics: cleanText(customerSections.demographics),
        psychographics: cleanText(customerSections.psychographics),
        painPoints: extractListItems(customerSections.painPoints)
      },
      roadmap: roadmapPhases,
      financialProjections: {
        initialInvestment: financialSections.initialInvestment || "$50,000 - $100,000",
        breakevenPoint: financialSections.breakevenPoint || "12-18 months",
        revenueStreams: financialSections.revenueStreams.length > 0 ? 
          financialSections.revenueStreams : 
          defaultRevenueStreams()
      }
    };
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    // Return fallback data if parsing fails
    return generateFallbackResponse();
  }
};

// Helper function to extract a section using regex
const extractSection = (text: string, pattern: RegExp): string => {
  const match = text.match(pattern);
  return match?.[1]?.trim() || "";
};

// Helper function to extract a subsection using regex
const extractSubSection = (text: string, pattern: RegExp): string => {
  const match = text.match(pattern);
  return match?.[1]?.trim() || "";
};

// Helper function to extract a financial value
const extractFinancialValue = (text: string, pattern: RegExp): string => {
  const match = text.match(pattern);
  return match?.[1]?.trim() || "";
};

// Helper function to clean text by removing formatting characters
const cleanText = (text: string): string => {
  return text.replace(/\*\*|\*/g, "").trim();
};

// Helper function to extract roadmap phases
const extractRoadmapPhases = (text: string): AnalysisResponse["roadmap"] => {
  if (!text) return defaultRoadmap();
  
  // Try to find phases with various patterns
  const phaseBlocks = text.split(/(?:Phase \d+|Short[- ]Term|Medium[- ]Term|Long[- ]Term):/i)
    .filter(block => block.trim());
  
  const phaseHeaders = text.match(/(?:Phase \d+|Short[- ]Term|Medium[- ]Term|Long[- ]Term):/gi) || [];
  
  if (phaseBlocks.length === 0 || phaseHeaders.length === 0) {
    return defaultRoadmap();
  }
  
  return phaseHeaders.map((header, index) => {
    const phaseContent = phaseBlocks[index] || "";
    
    // Extract timeframe with various patterns
    const timeframeMatch = phaseContent.match(/(?:Timeframe|Duration|Timeline)[:\s]+([^.\n]*)/i) || 
                           phaseContent.match(/(\d+[-–]\d+\s*(?:months|weeks|days|years)|\d+\s*(?:months|weeks|days|years))/i);
    
    const timeframe = timeframeMatch?.[1]?.trim() || `${index * 3 + 3}-${index * 3 + 6} months`;
    
    // Extract tasks
    const taskSection = extractSubSection(phaseContent, /(?:Tasks|Activities|Steps)[:\s]+([\s\S]*?)(?=(?:Timeframe|Duration|Timeline|$))/i);
    const tasks = extractListItems(taskSection);
    
    return {
      phase: header.trim(),
      tasks: tasks.length > 0 ? tasks : [`Market research and validation`, `Product development`, `User testing`],
      timeframe: cleanText(timeframe)
    };
  });
};

// Default revenue streams
const defaultRevenueStreams = (): string[] => [
  "Subscription model with tiered pricing",
  "Premium features and add-ons",
  "Enterprise solutions with custom pricing"
];

// Default roadmap
const defaultRoadmap = (): AnalysisResponse["roadmap"] => [
  {
    phase: "Phase 1: Foundation",
    tasks: ["Market research and validation", "MVP development", "Initial user testing"],
    timeframe: "0-3 months"
  },
  {
    phase: "Phase 2: Development & Launch",
    tasks: ["Full feature development", "Marketing campaign preparation", "Beta testing and refinement"],
    timeframe: "4-6 months"
  },
  {
    phase: "Phase 3: Growth & Expansion",
    tasks: ["Full market launch", "Customer acquisition campaigns", "Feedback collection and product iteration"],
    timeframe: "7-12 months"
  }
];

// Generate fallback response if parsing fails
const generateFallbackResponse = (): AnalysisResponse => {
  return {
    strengthsWeaknesses: {
      strengths: [
        "Innovative solution addressing a real market need",
        "Clear target audience identification",
        "Strong unique selling proposition"
      ],
      weaknesses: [
        "Potential high initial development costs",
        "Market education may be required",
        "Competitive landscape challenges"
      ]
    },
    marketAnalysis: "The market shows significant growth potential with increasing demand for innovative solutions in this space.",
    competitorAnalysis: [
      "Competitor A - Current market leader with traditional approach",
      "Competitor B - Recent entrant with technology focus but limited features",
      "Competitor C - Established player targeting adjacent market segments"
    ],
    targetCustomer: {
      demographics: "25-45 year old professionals in urban areas with above-average income",
      psychographics: "Tech-savvy, value convenience and efficiency, willing to try new solutions",
      painPoints: [
        "Existing solutions are time-consuming and inefficient",
        "Current market offerings are expensive with poor user experience",
        "Lack of personalized options in available alternatives"
      ]
    },
    roadmap: defaultRoadmap(),
    financialProjections: {
      initialInvestment: "$50,000 - $100,000",
      breakevenPoint: "12-18 months",
      revenueStreams: defaultRevenueStreams()
    }
  };
};