import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { BookOpen, Hash, FileText } from 'lucide-react';
import supabase from '../utils/supabase';

export default function AddSubjectPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subjectCode: '',
    subjectName: '',
    units: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const confettiRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/js-confetti@latest/dist/js-confetti.browser.js';
    script.async = true;
    script.onload = () => {
      confettiRef.current = new window.JSConfetti();
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.subjectCode || !formData.subjectName || !formData.units) {
      alert('Please fill in all required fields (Subject Code, Name, and Units)');
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await supabase
      .from('subjects')
      .insert([
        {
          subjectCode: formData.subjectCode.toUpperCase(),
          subjectName: formData.subjectName,
          units: parseInt(formData.units),
          description: formData.description || null,
        }
      ])
      .select();

    setIsSubmitting(false);

    if (error) {
      console.error('Error adding subject:', error);
      alert('Error adding subject. Please try again.');
      return;
    }

    // Trigger confetti
    if (confettiRef.current) {
      confettiRef.current.addConfetti({
        confettiColors: [
          '#3b82f6',
          '#06b6d4',
          '#14b8a6',
          '#10b981',
          '#22c55e',
          '#84cc16',
        ],
        confettiRadius: 6,
        confettiNumber: 500,
      });
    }

    setFormData({
      subjectCode: '',
      subjectName: '',
      units: '',
      description: '',
    });

    setTimeout(() => {
      navigate('/Subjects');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8 text-white">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/2232/2232688.png" 
                  alt="Subject"
                  className="w-12 h-12"
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-center">Add New Subject</h1>
            <p className="text-center text-blue-100 mt-2">
              Complete the form to add a new subject
            </p>
          </div>

          <div className="p-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject Code <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Hash size={20} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="subjectCode"
                      value={formData.subjectCode}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all uppercase"
                      placeholder="e.g., CS101, MATH201"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Units <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Hash size={20} className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="units"
                      value={formData.units}
                      onChange={handleChange}
                      min="1"
                      max="10"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      placeholder="Enter units (1-10)"
                    />
                  </div>
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BookOpen size={20} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="subjectName"
                    value={formData.subjectName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="e.g., Introduction to Programming"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                    <FileText size={20} className="text-gray-400" />
                  </div>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
                    placeholder="Enter subject description (optional)"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/Subjects')}
                  className="flex-1 py-4 rounded-xl font-bold text-gray-700 text-lg transition-all border-2 border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`flex-1 py-4 rounded-xl font-bold text-white text-lg transition-all transform hover:scale-105 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-3"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Adding Subject...
                    </span>
                  ) : (
                    'Add Subject'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-white text-sm opacity-90">
            © 2025 Student Grade Management System
          </p>
        </div>
      </div>
    </div>
  );
}