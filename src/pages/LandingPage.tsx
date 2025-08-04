import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Target, 
  BookOpen, 
  Users, 
  TrendingUp, 
  FileText, 
  Brain,
  Rocket,
  CheckCircle,
  Compass
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Smart Resume Analysis",
      description: "AI-powered analysis of your resume against job requirements with detailed match scoring."
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Personalized Learning Roadmap",
      description: "Get customized learning paths with resources, projects, and timelines based on your goals."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Role Recommendations",
      description: "Discover career opportunities that align with your skills and experience."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Market Insights",
      description: "Understand current job market trends and how your profile fits in the landscape."
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Cover Letter Generation",
      description: "AI-generated cover letters tailored to specific job descriptions and your experience."
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Interview Preparation",
      description: "Practice with AI-generated behavioral and technical questions for your target roles."
    }
  ];

  const benefits = [
    "Identify skill gaps and improvement areas",
    "Get personalized certification recommendations",
    "Build a portfolio of relevant projects",
    "Understand your competitive advantage",
    "Receive actionable career advice"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            <span>AI-Powered Career Intelligence</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Unlock Your Career
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}Potential
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Get personalized career insights, skill analysis, and learning roadmaps powered by advanced AI. 
            Upload your resume and job description to receive comprehensive career guidance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/analyze"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Start Analysis
            </Link>
            <button className="bg-white text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-200">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Career Success
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI analyzes your profile and provides comprehensive insights to accelerate your career growth.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Why Choose Career Copilot?
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Make data-driven career decisions with AI-powered insights that help you stand out 
                in today's competitive job market.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-white">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-2xl">
              <div className="text-center">
                <Rocket className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
                <p className="text-gray-600 mb-6">
                  Join thousands of professionals who have accelerated their careers with AI-powered insights.
                </p>
                <Link
                  to="/analyze"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 inline-block"
                >
                  Start Your Analysis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Career Copilot</span>
          </div>
          <p className="text-gray-400">
            Empowering careers with AI-driven insights and personalized guidance.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;