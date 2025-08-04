import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  FileText, 
  Mail, 
  Clock, 
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

const WEBHOOK_URL = '/webhook/career-copilot';

interface FormData {
  email: string;
  jobDescription: string;
  resume: File | null;
  timeDuration: string;
}

const AnalysisForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    jobDescription: '',
    resume: null,
    timeDuration: '6 weeks'
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const timeOptions = [
    '2 weeks',
    '4 weeks',
    '6 weeks',
    '2 months',
    '3 months',
    '6 months'
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

    const handleFileUpload = (file?: File) => {
    if (!file) return;
    if (file.type === 'application/pdf') {
      // set resume and auto-advance to next step
      setFormData(prev => ({ ...prev, resume: file }));
      setCurrentStep(prev => Math.max(prev, 4));
    } else {
      alert('Please upload a PDF file');
    }
  };


  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append('email', formData.email);
      payload.append('jobDescription', formData.jobDescription);
      payload.append('timeDuration', formData.timeDuration);
      if (formData.resume) {
        payload.append('resume', formData.resume);
      }

      // send to n8n
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: payload
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      // Safely parse JSON or fallback
      const text = await response.text();
      let data: any;
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (parseErr) {
          console.warn('Response JSON parse error, falling back to form data', parseErr);
          data = { stored: true, ...JSON.parse(localStorage.getItem('analysisData') || '{}') };
        }
      } else {
        console.warn('Empty response from server, using stored form data');
        data = { stored: true, ...JSON.parse(localStorage.getItem('analysisData') || '{}') };
      }

      // store result for dashboard
      localStorage.setItem('analysisResults', JSON.stringify(data));

      // advance or navigate
      setCurrentStep(prev => prev + 1);
      if (currentStep === 4) {
        navigate('/results');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.email.includes('@') && formData.email.includes('.');
      case 2:
        return formData.jobDescription.length > 50;
      case 3:
        return formData.resume !== null;
      case 4:
        return formData.timeDuration !== '';
      default:
        return false;
    }
  };

  const canProceed = isStepValid(currentStep);
  const isLastStep = currentStep === 4;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Career Analysis Form
          </h1>
          <p className="text-lg text-gray-600">
            Provide your details to get personalized career insights
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                  step <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step < currentStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  step
                )}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Email */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Email</h2>
                  <p className="text-gray-600">We'll send your analysis results here</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Job Description */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Description</h2>
                  <p className="text-gray-600">Paste the job description you're interested in</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description
                  </label>
                  <textarea
                    required
                    value={formData.jobDescription}
                    onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[200px] resize-none"
                    placeholder="Paste the complete job description here..."
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    {formData.jobDescription.length} characters (minimum 50 required)
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Resume Upload */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Resume</h2>
                  <p className="text-gray-600">Upload your resume in PDF format</p>
                </div>
                
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                    dragActive
                      ? 'border-blue-500 bg-blue-50'
                      : formData.resume
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {formData.resume ? (
                    <div className="space-y-2">
                      <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                      <p className="text-green-600 font-medium">{formData.resume.name}</p>
                      <p className="text-sm text-gray-500">
                        {(formData.resume.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-medium text-gray-900">
                          Drop your resume here, or click to browse
                        </p>
                        <p className="text-sm text-gray-500">PDF files only, max 10MB</p>
                      </div>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Time Duration */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Learning Timeline</h2>
                  <p className="text-gray-600">How much time can you dedicate to upskilling?</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {timeOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleInputChange('timeDuration', option)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        formData.timeDuration === option
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8">
              <button
                type="button"
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  currentStep === 1
                    ? 'invisible'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Previous
              </button>
              
              {isLastStep ? (
                <button
                  type="submit"
                  disabled={!canProceed || isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <span>Start Analysis</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  disabled={!canProceed}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AnalysisForm;