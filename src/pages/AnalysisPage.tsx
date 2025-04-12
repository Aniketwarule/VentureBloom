import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { 
  ArrowRightIcon, 
  Check, 
  X, 
  Users, 
  TrendingUp, 
  Zap, 
  Target, 
  BadgeCheck, 
  BarChart3, 
  Clock,
  Sparkles,
  AlertTriangle,
  Globe,
  ChevronRight
} from "lucide-react";
import { type AnalysisResponse } from "@/services/geminiService";


const AnalysisPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [businessIdea, setBusinessIdea] = useState<any>(null);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [currentPhase, setCurrentPhase] = useState(0);

  useEffect(() => {
    // Load business idea and analysis from session storage
    const loadData = () => {
      try {
        const ideaData = sessionStorage.getItem("businessIdea");
        const analysisData = sessionStorage.getItem("businessAnalysis");
        
        if (!ideaData) {
          toast({
            variant: "destructive",
            title: "No idea found",
            description: "Please submit an idea first.",
          });
          navigate("/start");
          return;
        }
        
        setBusinessIdea(JSON.parse(ideaData));
        
        if (analysisData) {
          // Clean up markdown formatting in the analysis data
          const cleanedData = JSON.parse(analysisData);
          
          // Clean markdown formatting from strings
          if (cleanedData.marketAnalysis) {
            cleanedData.marketAnalysis = cleanedData.marketAnalysis.replace(/\*\*/g, '');
          }
          
          // Clean markdown formatting from arrays
          ['strengths', 'weaknesses'].forEach(key => {
            if (cleanedData.strengthsWeaknesses && Array.isArray(cleanedData.strengthsWeaknesses[key])) {
              cleanedData.strengthsWeaknesses[key] = cleanedData.strengthsWeaknesses[key].map(
                (item: string) => item.replace(/\*\*/g, '')
              );
            }
          });
          
          // Clean pain points
          if (cleanedData.targetCustomer && Array.isArray(cleanedData.targetCustomer.painPoints)) {
            cleanedData.targetCustomer.painPoints = cleanedData.targetCustomer.painPoints.map(
              (item: string) => item.replace(/\*\*/g, '')
            );
          }
          
          // Clean demographics and psychographics
          if (cleanedData.targetCustomer) {
            if (cleanedData.targetCustomer.demographics) {
              cleanedData.targetCustomer.demographics = cleanedData.targetCustomer.demographics.replace(/\*\*/g, '');
            }
            if (cleanedData.targetCustomer.psychographics) {
              cleanedData.targetCustomer.psychographics = cleanedData.targetCustomer.psychographics.replace(/\*\*/g, '');
            }
          }
          
          // Clean roadmap tasks
          if (cleanedData.roadmap && Array.isArray(cleanedData.roadmap)) {
            cleanedData.roadmap = cleanedData.roadmap.map((phase: any) => ({
              ...phase,
              tasks: Array.isArray(phase.tasks) 
                ? phase.tasks.map((task: string) => task.replace(/\*\*/g, ''))
                : phase.tasks
            }));
          }
          
          // Clean competitor analysis and financial projections
          if (Array.isArray(cleanedData.competitorAnalysis)) {
            cleanedData.competitorAnalysis = cleanedData.competitorAnalysis.map(
              (item: string) => item.replace(/\*\*/g, '')
            );
          }
          
          if (cleanedData.financialProjections) {
            if (Array.isArray(cleanedData.financialProjections.revenueStreams)) {
              cleanedData.financialProjections.revenueStreams = cleanedData.financialProjections.revenueStreams.map(
                (item: string) => item.replace(/\*\*/g, '')
              );
            }
            
            if (cleanedData.financialProjections.initialInvestment) {
              cleanedData.financialProjections.initialInvestment = 
                cleanedData.financialProjections.initialInvestment.replace(/\*\*/g, '');
            }
            
            if (cleanedData.financialProjections.breakevenPoint) {
              cleanedData.financialProjections.breakevenPoint = 
                cleanedData.financialProjections.breakevenPoint.replace(/\*\*/g, '');
            }
          }
          
          setAnalysis(cleanedData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          variant: "destructive",
          title: "Error loading data",
          description: "Please try again.",
        });
        navigate("/start");
      }
    };
    
    loadData();
  }, [navigate]);

  const handleContinue = () => {
    navigate("/results");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          </div>
          <p className="text-lg font-medium">Analyzing your idea...</p>
          <p className="text-sm text-gray-400">Crunching the numbers and market data</p>
        </div>
      </div>
    );
  }

  if (!businessIdea || !analysis) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="text-center p-8 rounded-lg">
          <p className="text-xl mb-4">No analysis data found</p>
          <Button onClick={() => navigate("/start")} className="bg-blue-600 text-white hover:bg-blue-700">
            Submit an idea
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />
      <div className="flex-1 pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Analysis Complete</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Business Idea Analysis
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto">
              We've analyzed your {businessIdea.industry} business concept "{businessIdea.title}" 
              and identified key insights to help you move forward.
            </p>
          </div>

          <div className="space-y-12">
            {/* Strengths & Weaknesses */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-lg border border-gray-800">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <BadgeCheck className="w-6 h-6 mr-2 text-green-500" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                  Strengths & Weaknesses Analysis
                </span>
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-800/70 rounded-lg p-6 border border-green-500/20 shadow-lg shadow-green-900/5">
                  <h3 className="text-xl font-semibold mb-4 text-green-400 flex items-center">
                    <Check className="w-5 h-5 mr-2" />
                    Strengths
                  </h3>
                  <ul className="space-y-4">
                    {analysis.strengthsWeaknesses.strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start group">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mr-3 mt-1 group-hover:bg-green-500/40 transition-all">
                          <Check className="w-3 h-3 text-green-500" />
                        </span>
                        <span className="text-gray-200">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-800/70 rounded-lg p-6 border border-red-500/20 shadow-lg shadow-red-900/5">
                  <h3 className="text-xl font-semibold mb-4 text-red-400 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Challenges
                  </h3>
                  <ul className="space-y-4">
                    {analysis.strengthsWeaknesses.weaknesses.map((weakness, idx) => (
                      <li key={idx} className="flex items-start group">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center mr-3 mt-1 group-hover:bg-red-500/40 transition-all">
                          <X className="w-3 h-3 text-red-400" />
                        </span>
                        <span className="text-gray-200">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Market Analysis */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-lg border border-gray-800">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Globe className="w-6 h-6 mr-2 text-blue-500" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  Market Analysis
                </span>
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg">{analysis.marketAnalysis}</p>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-purple-400" />
                  Key Competitors
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {analysis.competitorAnalysis.map((competitor, idx) => (
                    <div key={idx} className="bg-gray-800/70 p-5 rounded-lg border border-gray-700 hover:border-purple-500/30 transition-all group">
                      <p className="group-hover:text-white text-gray-300">{competitor}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Target Customer */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-lg border border-gray-800">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Users className="w-6 h-6 mr-2 text-purple-500" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                  Target Customer Profile
                </span>
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gray-800/70 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-xl font-semibold mb-4 text-purple-400">Demographics</h3>
                    <p className="text-gray-300">{analysis.targetCustomer.demographics}</p>
                  </div>
                  
                  <div className="bg-gray-800/70 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-xl font-semibold mb-4 text-purple-400">Psychographics</h3>
                    <p className="text-gray-300">{analysis.targetCustomer.psychographics}</p>
                  </div>
                </div>
                <div className="bg-gray-800/70 p-6 rounded-lg border border-purple-500/20 shadow-lg">
                  <h3 className="text-xl font-semibold mb-6 text-purple-400">Pain Points</h3>
                  <ul className="space-y-4">
                    {analysis.targetCustomer.painPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start group">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 mt-1 group-hover:bg-purple-500/40 transition-all">
                          <Target className="w-3 h-3 text-purple-500" />
                        </span>
                        <span className="text-gray-200">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Roadmap */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-lg border border-gray-800">
              <h2 className="text-2xl font-bold mb-8 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-blue-400" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-500">
                  Implementation Roadmap
                </span>
              </h2>
              
              <div className="relative mb-8">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-teal-500 z-0 rounded-full"></div>
                
                {/* Phase markers */}
                <div className="space-y-12 relative">
                  {analysis.roadmap.map((phase, idx) => (
                    <div key={idx} className={`relative z-10 pl-16 ${idx === currentPhase ? 'opacity-100' : 'opacity-80'}`}>
                      {/* Marker */}
                      <div 
                        className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300
                          ${idx === currentPhase 
                            ? 'bg-blue-500 border-2 border-blue-400 ring-4 ring-blue-500/20'
                            : idx < currentPhase 
                              ? 'bg-green-500' 
                              : 'bg-gray-700 hover:bg-gray-600'}`}
                        onClick={() => setCurrentPhase(idx)}
                      >
                        {idx < currentPhase ? (
                          <Check className="w-4 h-4 text-white" />
                        ) : (
                          <span className="text-white font-bold">{idx + 1}</span>
                        )}
                      </div>
                      
                      <div className={`border rounded-lg p-6 transition-all duration-300 ${
                        idx === currentPhase 
                          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.25)]' 
                          : 'bg-gray-800/70 border-gray-700 hover:border-gray-600'
                      }`}>
                        <div className="flex justify-between items-start mb-5">
                          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                            {phase.phase}
                          </h3>
                          <span className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-sm border border-blue-500/20">
                            {phase.timeframe}
                          </span>
                        </div>
                        <ul className="space-y-3">
                          {phase.tasks.map((task, taskIdx) => (
                            <li key={taskIdx} className="flex items-start group">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-1 group-hover:bg-blue-500/30 transition-all">
                                <ChevronRight className="w-3 h-3 text-blue-400" />
                              </span>
                              <span className="text-gray-200">{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Financial Projections */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-lg border border-gray-800">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2 text-green-500" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-500">
                  Financial Projections
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-6 rounded-lg border border-green-500/20 shadow-lg">
                  <h3 className="text-xl font-semibold mb-3 text-green-400">Initial Investment</h3>
                  <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-400">
                    {analysis.financialProjections.initialInvestment}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-6 rounded-lg border border-blue-500/20 shadow-lg">
                  <h3 className="text-xl font-semibold mb-3 text-blue-400">Breakeven Point</h3>
                  <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                    {analysis.financialProjections.breakevenPoint}
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-6 text-teal-400 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Revenue Streams
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {analysis.financialProjections.revenueStreams.map((stream, idx) => (
                    <div key={idx} className="bg-gray-800/70 p-5 rounded-lg border border-gray-700 hover:border-teal-500/30 transition-all group">
                      <p className="group-hover:text-white text-gray-300">{stream}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-8">
              <Button 
                onClick={handleContinue}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Continue to Detailed Roadmap
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AnalysisPage;