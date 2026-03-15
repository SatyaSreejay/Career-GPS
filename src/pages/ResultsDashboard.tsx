import React, { useState, useEffect,useRef } from 'react';
import { 
  BarChart3, 
  Target, 
  BookOpen, 
  Users,  
  Award,
  TrendingUp,
  Code,
  MessageSquare,
  Lightbulb,
  ExternalLink,
  Download,
  Star,
  AlertTriangle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// ← point this at the same n8n webhook you posted to from the form
//const API_URL = "https://satyasreejay.app.n8n.cloud/webhook-test/career-copilot";

interface AnalysisResults {
  match_score: number;
  missing_skills: string[];
  improvement_suggestions: string[];
  suggested_roles: Array<{
    title: string;
    justification: string;
  }>;
  learning_roadmap: Array<{
    phase: string;
    focus: string;
    resources: string[];
    projects: string[];
  }>;
  cover_letter: string;
  certifications_and_courses: Array<{
    title: string;
    platform: string;
  }>;
  job_market_fit_score: {
    score: number;
    demand_insight: string;
  };
  mini_portfolio_projects: Array<{
    title: string;
    description: string;
    tech_stack: string[];
    deployment: string;
  }>;
  mock_interview_questions: {
    behavioral: Array<{
      question: string;
      ideal_answer_hint: string;
    }>;
    technical: Array<{
      question: string;
      ideal_answer_hint: string;
    }>;
  };
  role_targeting_assistant: {
    goal_alignment: string;
    recommended_roadmap: string[];
    ideal_companies: string[];
  };
}

const ResultsDashboard: React.FC = () => {
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const exportRef = useRef<HTMLDivElement>(null);

useEffect(() => {
    setLoading(true);
    const raw = JSON.parse(localStorage.getItem('analysisResults') || 'null');
    if (raw) {
      const payload = Array.isArray(raw) ? raw[0] : raw;

      // Normalize match_score: fraction -> percentage, or use as-is (cap at 100)
      const rawMatch = payload['match_score '] ?? payload.match_score ?? 0;
      let matchPct = rawMatch <= 1 ? rawMatch * 100 : rawMatch;
      matchPct = Math.min(Math.round(matchPct), 100);

      // Normalize job market fit similarly
      const jmRaw = payload['job_market_score '] ?? payload.job_market_score ?? { score: 0, demand_insight: '' };
      let marketPct = jmRaw.score <= 1 ? jmRaw.score * 100 : jmRaw.score;
      marketPct = Math.min(Math.round(marketPct), 100);

      // Build parsed object matching AnalysisResults interface
      const parsed: AnalysisResults = {
        match_score: matchPct,
        missing_skills: payload['missing_skills '] ?? payload.missing_skills ?? [],
        improvement_suggestions: payload.improvement_suggestions ?? [],
        suggested_roles: payload['suggested_roles '] ?? payload.suggested_roles ?? [],
        learning_roadmap: payload['roadmap '] ?? payload.learning_roadmap ?? [],
        cover_letter: payload['cover_letter '] ?? payload.cover_letter ?? '',
        certifications_and_courses: payload.certifications_and_courses ?? [],
        job_market_fit_score: {
          score: marketPct,
          demand_insight: jmRaw.demand_insight
        },
        mini_portfolio_projects: payload['portfolio_projects '] ?? payload.mini_portfolio_projects ?? [],
        mock_interview_questions: payload['mock_questions '] ?? payload.mock_interview_questions ?? { behavioral: [], technical: [] },
        role_targeting_assistant: payload['role_assistant'] ?? payload.role_targeting_assistant ?? { goal_alignment: '', recommended_roadmap: [], ideal_companies: [] }
      };

      setResults(parsed);
    } else {
      setResults(null);
    }
    setLoading(false);
  }, []);

const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  const handleExportPdf = async () => {
    if (!exportRef.current) return;
    const element = exportRef.current;
    // Expand all sections for export
    const originalTab = activeTab;
    setActiveTab('all');
    await new Promise(r => setTimeout(r, 300));
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    let pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    let position = 0;
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    while (pdfHeight > pdf.internal.pageSize.getHeight()) {
      position -= pdf.internal.pageSize.getHeight();
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      pdfHeight -= pdf.internal.pageSize.getHeight();
    }
    pdf.save('career_analysis.pdf');
    setActiveTab(originalTab);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Your Profile</h2>
          <p className="text-gray-600">This may take a few moments...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Error</h2>
          <p className="text-gray-600">Unable to load results. Please try again.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'skills', label: 'Skills', icon: <Target className="w-4 h-4" /> },
    { id: 'roadmap', label: 'Learning Path', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'roles', label: 'Roles', icon: <Users className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <Code className="w-4 h-4" /> },
    { id: 'interview', label: 'Interview', icon: <MessageSquare className="w-4 h-4" /> }
  ];
  const renderSection = (id: string) => {
    switch (id) {
      case 'overview': return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
  {/* Match Score */}
  <div className="bg-white p-6 rounded-xl shadow-sm border">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Match Score</h3>
      <Target className="w-6 h-6 text-blue-600" />
    </div>
    <div className="text-center">
      <div className={`text-4xl font-bold ${getScoreColor(results.match_score)} mb-2`}>
        {results.match_score}%
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${getScoreBgColor(results.match_score)}`}
          style={{ width: `${results.match_score}%` }}
        />
      </div>
    </div>
  </div>

  {/* Market Fit */}
  <div className="bg-white p-6 rounded-xl shadow-sm border">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Market Fit</h3>
      <TrendingUp className="w-6 h-6 text-green-600" />
    </div>
    <div className="text-center">
      <div className={`text-4xl font-bold ${getScoreColor(results.job_market_fit_score.score)} mb-2`}>
        {results.job_market_fit_score.score}%
      </div>
      <p className="text-sm text-gray-600">
        {results.job_market_fit_score.demand_insight}
      </p>
    </div>
  </div>

  {/* Skills to Learn */}
  <div className="bg-white p-6 rounded-xl shadow-sm border">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Skills to Learn</h3>
      <Lightbulb className="w-6 h-6 text-yellow-600" />
    </div>
    <div className="text-center">
      <div className="text-4xl font-bold text-yellow-600 mb-2">
        {results.missing_skills.length}
      </div>
      <p className="text-sm text-gray-600">Areas for improvement</p>
    </div>
  </div>

  {/* Improvement Suggestions */}
  <div className="bg-white p-6 rounded-xl shadow-sm border md:col-span-2 lg:col-span-3">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
      Key Improvement Areas
    </h3>
    <div className="grid md:grid-cols-2 gap-4">
      {results.improvement_suggestions.map((s, i) => (
        <div key={i} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
            {i + 1}
          </div>
          <p className="text-gray-700">{s}</p>
        </div>
      ))}
    </div>
  </div>
</div>);
      case 'skills':    return <>
  {/* Missing Skills */}
  <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
    <h3 className="text-xl font-semibold text-gray-900 mb-4">Missing Skills</h3>
    <div className="flex flex-wrap gap-2">
      {results.missing_skills.map((skill, i) => (
        <span
          key={i}
          className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
        >
          {skill}
        </span>
      ))}
    </div>
  </div>

  {/* Recommended Certifications */}
  <div className="bg-white p-6 rounded-xl shadow-sm border">
    <h3 className="text-xl font-semibold text-gray-900 mb-4">
      Recommended Certifications
    </h3>
    <div className="grid md:grid-cols-2 gap-4">
      {results.certifications_and_courses.map((cert, i) => (
        <div
          key={i}
          className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50"
        >
          <Award className="w-6 h-6 text-yellow-600" />
          <div>
            <p className="font-medium text-gray-900">{cert.title}</p>
            <p className="text-sm text-gray-600">{cert.platform}</p>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
        </div>
      ))}
    </div>
  </div>
</>;
      case 'roadmap':   return <div className="space-y-6">
  {results.learning_roadmap.map((phase, i) => (
    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
          {i + 1}
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{phase.phase}</h3>
      </div>
      <p className="text-gray-700 mb-4">{phase.focus}</p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Resources */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Resources</h4>
          <ul className="space-y-2">
            {phase.resources.map((r, idx) => (
              <li key={idx} className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700">{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Projects */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Projects</h4>
          <ul className="space-y-2">
            {phase.projects.map((p, idx) => (
              <li key={idx} className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ))}
</div>;
      case 'roles':     return <>
  {/* Suggested Roles */}
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
    {results.suggested_roles.map((role, i) => (
      <div key={i} className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{role.title}</h3>
        <p className="text-gray-600 mb-4">{role.justification}</p>
        <div className="flex items-center space-x-2 text-sm text-blue-600">
          <Star className="w-4 h-4" />
          <span>Recommended</span>
        </div>
      </div>
    ))}
  </div>

  {/* Role Targeting + Cover Letter */}
  <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
    <h3 className="text-xl font-semibold text-gray-900 mb-4">Role Targeting Strategy</h3>
    <div className="space-y-4">
      <div>
        <h4 className="font-medium text-gray-900 mb-2">Goal Alignment</h4>
        <p className="text-gray-700">{results.role_targeting_assistant.goal_alignment}</p>
      </div>
      <div>
        <h4 className="font-medium text-gray-900 mb-2">Recommended Roadmap</h4>
        <ul className="space-y-2">
          {results.role_targeting_assistant.recommended_roadmap.map((step, idx) => (
            <li key={idx} className="flex items-start space-x-2">
              <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                {idx + 1}
              </div>
              <span className="text-gray-700">{step}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-medium text-gray-900 mb-2">Ideal Company Types</h4>
        <div className="flex flex-wrap gap-2">
          {results.role_targeting_assistant.ideal_companies.map((c, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>

  {/* Cover Letter */}
  <div className="bg-white p-6 rounded-xl shadow-sm border">
    <h3 className="text-xl font-semibold text-gray-900 mb-4">Cover Letter</h3>
    <div className="bg-gray-50 p-4 rounded-lg">
      <pre className="whitespace-pre-wrap text-gray-700 font-sans">
        {results.cover_letter}
      </pre>
    </div>
  </div>
</>;
      case 'projects':  return <div className="grid md:grid-cols-2 gap-6">
  {results.mini_portfolio_projects.map((project, i) => (
    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
      <p className="text-gray-600 mb-4">{project.description}</p>
      <div className="space-y-3">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Tech Stack</h4>
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.map((t, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Deployment</h4>
          <span className="text-sm text-gray-600">{project.deployment}</span>
        </div>
      </div>
    </div>
  ))}
</div>;
      case 'interview': return <div className="space-y-6">
  {/* Behavioral */}
  <div className="bg-white p-6 rounded-xl shadow-sm border">
    <h3 className="text-xl font-semibold text-gray-900 mb-4">Behavioral Questions</h3>
    <div className="space-y-4">
      {results.mock_interview_questions.behavioral.map((q, i) => (
        <div key={i} className="border-l-4 border-blue-500 pl-4">
          <h4 className="font-medium text-gray-900 mb-2">{q.question}</h4>
          <p className="text-sm text-gray-600">{q.ideal_answer_hint}</p>
        </div>
      ))}
    </div>
  </div>

  {/* Technical */}
  <div className="bg-white p-6 rounded-xl shadow-sm border">
    <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Questions</h3>
    <div className="space-y-4">
      {results.mock_interview_questions.technical.map((q, i) => (
        <div key={i} className="border-l-4 border-green-500 pl-4">
          <h4 className="font-medium text-gray-900 mb-2">{q.question}</h4>
          <p className="text-sm text-gray-600">{q.ideal_answer_hint}</p>
        </div>
      ))}
    </div>
  </div>
</div>;
      case 'all':       return tabs.map(t => <React.Fragment key={t.id}>{renderSection(t.id)}</React.Fragment>);
      default:          return null;
    }
  };

  return (
    <div ref={exportRef} className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Career Analysis Results</h1>
              <p className="text-gray-600 mt-2">Your personalized career insights powered by AI</p>
            </div>
            <div className="flex space-x-3">
              <button
            onClick={handleExportPdf}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          <div className="space-y-6">
            {renderSection(activeTab)}
          </div>

          {/* Roles Tab */}
          
          {/* Projects Tab */}
          

          {/* Interview Tab */}
          
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;