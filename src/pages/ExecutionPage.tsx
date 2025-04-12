
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Calendar, CheckCircle, Clock, FileText, Lightbulb, LineChart, List, Rocket, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const growthData = [
  { month: 'Jan', progress: 10, target: 15 },
  { month: 'Feb', progress: 23, target: 25 },
  { month: 'Mar', progress: 35, target: 35 },
  { month: 'Apr', progress: 48, target: 45 },
  { month: 'May', progress: 62, target: 55 },
  { month: 'Jun', progress: 70, target: 65 },
  { month: 'Jul', progress: 85, target: 75 },
  { month: 'Aug', progress: 92, target: 85 },
];

// Mock tasks data
const tasks = [
  { id: 1, name: "Set up business entity (LLC)", category: "Legal", completed: true, dueDate: "2025-04-15" },
  { id: 2, name: "Register domain name", category: "Setup", completed: true, dueDate: "2025-04-17" },
  { id: 3, name: "Create initial wireframes", category: "Product", completed: false, dueDate: "2025-04-20" },
  { id: 4, name: "Interview 5 potential users", category: "Research", completed: false, dueDate: "2025-04-25" },
  { id: 5, name: "Outline technical requirements", category: "Product", completed: false, dueDate: "2025-04-27" },
  { id: 6, name: "Research payment processors", category: "Finance", completed: false, dueDate: "2025-05-01" },
  { id: 7, name: "Draft privacy policy", category: "Legal", completed: false, dueDate: "2025-05-05" },
  { id: 8, name: "Create logo and brand guidelines", category: "Marketing", completed: false, dueDate: "2025-05-10" },
];

// Mock investors data
const investors = [
  {
    name: "Sprout Ventures",
    focus: "AgTech, Food Supply Chain",
    stage: "Seed, Series A",
    investmentRange: "$250K - $2M",
    portfolio: ["FarmLink", "HarvestHub", "GreenGrowth"],
    match: 92
  },
  {
    name: "Local Food Fund",
    focus: "Sustainable Food Systems",
    stage: "Pre-seed, Seed",
    investmentRange: "$50K - $500K",
    portfolio: ["FreshRoute", "Urban Harvest", "EcoEats"],
    match: 87
  },
  {
    name: "Digital Harvest Capital",
    focus: "Food Tech, Marketplaces",
    stage: "Seed, Series A",
    investmentRange: "$500K - $3M",
    portfolio: ["FarmDirect", "LocalTable", "ProducePro"],
    match: 81
  },
  {
    name: "Sustainable Future Fund",
    focus: "Climate Tech, Sustainability",
    stage: "Seed",
    investmentRange: "$100K - $1M",
    portfolio: ["GreenCart", "EcoLogistics", "CleanHarvest"],
    match: 74
  }
];

const ExecutionPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tasks");
  const [taskList, setTaskList] = useState(tasks);
  
  const completeTask = (taskId: number) => {
    setTaskList(taskList.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };
  
  const completedTasksCount = taskList.filter(task => task.completed).length;
  const progress = (completedTasksCount / taskList.length) * 100;

  return (
    <div className="min-h-screen flex flex-col gradient-bg">
      <Navbar />
      <div className="flex-1 pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-venture-light dark:bg-venture-accent/20 text-venture-accent mb-4">
              <Rocket className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Step 3: Execute Your Plan</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Execution Dashboard</h1>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Track your progress, manage tasks, and watch your business grow.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="card-gradient animate-fade-in" style={{ animationDelay: "100ms" }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Project Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{Math.round(progress)}%</div>
                <Progress value={progress} className="h-2 mb-2" />
                <p className="text-sm text-muted-foreground">
                  {completedTasksCount} of {taskList.length} tasks completed
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-gradient animate-fade-in" style={{ animationDelay: "150ms" }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Time Remaining</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center">
                <Clock className="h-10 w-10 text-venture-primary mr-4" />
                <div>
                  <div className="text-3xl font-bold mb-1">24 days</div>
                  <p className="text-sm text-muted-foreground">Until next milestone</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-gradient animate-fade-in" style={{ animationDelay: "200ms" }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Potential Funding</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center">
                <Users className="h-10 w-10 text-venture-accent mr-4" />
                <div>
                  <div className="text-3xl font-bold mb-1">4</div>
                  <p className="text-sm text-muted-foreground">Matched investors</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in" style={{ animationDelay: "250ms" }}>
            <TabsList className="grid grid-cols-1 md:grid-cols-4 mb-6">
              <TabsTrigger value="tasks" className="flex items-center">
                <List className="h-4 w-4 mr-2" />
                Tasks
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Calendar
              </TabsTrigger>
              <TabsTrigger value="growth" className="flex items-center">
                <LineChart className="h-4 w-4 mr-2" />
                Growth Tracking
              </TabsTrigger>
              <TabsTrigger value="funding" className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Funding
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="tasks">
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle>Task Management</CardTitle>
                  <CardDescription>
                    Track and complete tasks to move your business forward
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-2">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Current Tasks</h3>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Add Task
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {taskList.map((task) => (
                          <div 
                            key={task.id} 
                            className="flex items-start p-3 rounded-lg border border-border hover:bg-background/50 transition-colors"
                          >
                            <Checkbox 
                              checked={task.completed} 
                              onCheckedChange={() => completeTask(task.id)}
                              className="mt-1 mr-3"
                            />
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                                  {task.name}
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <span className="bg-venture-light dark:bg-venture-accent/10 px-2 py-0.5 rounded-full mr-2">
                                    {task.category}
                                  </span>
                                  <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-4">Categories</h3>
                      <div className="space-y-3">
                        {['Legal', 'Setup', 'Product', 'Research', 'Finance', 'Marketing'].map((category) => {
                          const categoryTasks = taskList.filter(task => task.category === category);
                          const categoryCompleted = categoryTasks.filter(task => task.completed).length;
                          const categoryProgress = categoryTasks.length > 0 
                            ? (categoryCompleted / categoryTasks.length) * 100 
                            : 0;
                            
                          return (
                            <div key={category} className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{category}</span>
                                <span className="text-xs text-muted-foreground">
                                  {categoryCompleted}/{categoryTasks.length}
                                </span>
                              </div>
                              <Progress value={categoryProgress} className="h-1.5" />
                            </div>
                          );
                        })}
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <h3 className="font-semibold mb-4">Next Milestones</h3>
                      <div className="space-y-3">
                        <div className="rounded-lg border p-3">
                          <div className="flex items-center text-xs text-muted-foreground mb-1">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>In 24 days</span>
                          </div>
                          <h4 className="font-medium">Complete MVP Design</h4>
                          <div className="text-xs text-muted-foreground mt-1">5 tasks remaining</div>
                        </div>
                        <div className="rounded-lg border p-3">
                          <div className="flex items-center text-xs text-muted-foreground mb-1">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>In 45 days</span>
                          </div>
                          <h4 className="font-medium">Initial User Testing</h4>
                          <div className="text-xs text-muted-foreground mt-1">8 tasks remaining</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="calendar">
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle>Project Calendar</CardTitle>
                  <CardDescription>
                    View and manage your schedule and important dates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Calendar Coming Soon</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      We're working on implementing a full-featured calendar to help you manage your project timeline.
                    </p>
                    <Button variant="outline">Notify Me When Ready</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="growth">
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle>Business Growth Tracking</CardTitle>
                  <CardDescription>
                    Monitor your progress and key metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <h3 className="font-semibold mb-4">Project Progress vs Target</h3>
                      <div className="h-80 border rounded-lg p-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={growthData}
                            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Area 
                              type="monotone" 
                              dataKey="target" 
                              stroke="#8B5CF6" 
                              strokeWidth={2}
                              strokeDasharray="5 5"
                              fill="#8B5CF620" 
                              name="Target"
                            />
                            <Area 
                              type="monotone" 
                              dataKey="progress" 
                              stroke="#9b87f5" 
                              strokeWidth={3}
                              fill="#9b87f540" 
                              name="Actual Progress"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-4">Key Metrics</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 rounded-lg border">
                            <div>
                              <div className="text-sm font-medium">Completion Rate</div>
                              <div className="text-xs text-muted-foreground">Tasks completed on time</div>
                            </div>
                            <div className="text-xl font-bold text-venture-primary">92%</div>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 rounded-lg border">
                            <div>
                              <div className="text-sm font-medium">Research Progress</div>
                              <div className="text-xs text-muted-foreground">User interviews complete</div>
                            </div>
                            <div className="text-xl font-bold text-venture-accent">40%</div>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 rounded-lg border">
                            <div>
                              <div className="text-sm font-medium">Budget Utilization</div>
                              <div className="text-xs text-muted-foreground">Of initial allocation</div>
                            </div>
                            <div className="text-xl font-bold text-emerald-500">25%</div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-4">Next Steps to Growth</h3>
                        <div className="space-y-2">
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-venture-accent mr-2 mt-0.5 shrink-0" />
                            <div className="text-sm">Complete user research interviews to validate assumptions</div>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-venture-accent mr-2 mt-0.5 shrink-0" />
                            <div className="text-sm">Finalize MVP feature list based on research findings</div>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-venture-accent mr-2 mt-0.5 shrink-0" />
                            <div className="text-sm">Begin outreach to potential early adopters</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="funding">
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle>Investor Matching</CardTitle>
                  <CardDescription>
                    Connect with investors interested in ventures like yours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <h3 className="font-semibold mb-4">Top Matching Investors</h3>
                    <div className="space-y-4">
                      {investors.map((investor, i) => (
                        <div key={i} className="border rounded-lg overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            <div className="bg-venture-light dark:bg-venture-accent/10 p-4 md:w-1/4 flex flex-col justify-center items-center text-center">
                              <div className="text-2xl font-bold text-venture-accent mb-1">{investor.match}%</div>
                              <div className="text-sm text-muted-foreground">Match</div>
                            </div>
                            <div className="p-4 flex-1">
                              <h4 className="font-medium text-lg mb-2">{investor.name}</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                                <div>
                                  <span className="font-medium text-muted-foreground">Focus: </span>
                                  {investor.focus}
                                </div>
                                <div>
                                  <span className="font-medium text-muted-foreground">Stage: </span>
                                  {investor.stage}
                                </div>
                                <div>
                                  <span className="font-medium text-muted-foreground">Investment: </span>
                                  {investor.investmentRange}
                                </div>
                                <div>
                                  <span className="font-medium text-muted-foreground">Notable Investments: </span>
                                  {investor.portfolio.join(", ")}
                                </div>
                              </div>
                              <div className="mt-4 flex justify-end">
                                <Button variant="outline" size="sm">
                                  View Profile
                                </Button>
                                <Button className="ml-2 bg-venture-accent hover:bg-venture-accent/90 text-white" size="sm">
                                  Request Intro
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Prepare for Funding</h3>
                    <div className="card-gradient rounded-lg p-4">
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <div className="w-7 h-7 rounded-full bg-venture-light dark:bg-venture-accent/20 flex items-center justify-center mr-3 shrink-0">
                            <span className="font-medium text-venture-accent">1</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Create a Pitch Deck</h4>
                            <p className="text-sm text-muted-foreground">
                              Develop a compelling presentation that explains your business vision, market opportunity, and growth plan.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="w-7 h-7 rounded-full bg-venture-light dark:bg-venture-accent/20 flex items-center justify-center mr-3 shrink-0">
                            <span className="font-medium text-venture-accent">2</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Prepare Financial Projections</h4>
                            <p className="text-sm text-muted-foreground">
                              Create detailed financial forecasts showing revenue growth, expenses, and funding requirements.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="w-7 h-7 rounded-full bg-venture-light dark:bg-venture-accent/20 flex items-center justify-center mr-3 shrink-0">
                            <span className="font-medium text-venture-accent">3</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Develop a Prototype or MVP</h4>
                            <p className="text-sm text-muted-foreground">
                              Investors want to see tangible progress. Complete your MVP to demonstrate traction.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <Button className="bg-venture-primary hover:bg-venture-primary/90">
                          Start Pitch Preparation
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ExecutionPage;
