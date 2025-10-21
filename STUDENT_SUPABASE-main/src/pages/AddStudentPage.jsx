import { useState, useEffect, useRef } from 'react';
import { User, BookOpen, Hash } from 'lucide-react';
import supabase from '../utils/supabase';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router';

export default function AddStudentPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    yearLevel: '',
    course: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const confettiRef = useRef(null);
  const navigate = useNavigate(); // ✅ added

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const studentData = {
      ...formData,
      yearLevel: parseInt(formData.yearLevel),
    };

    const { error } = await supabase.from('students').insert([studentData]); 

    if (error) {
      console.error(error);
      toast.error('❌ Failed to save student');
    } else {
      toast.success('✅ Student registered successfully!');
      navigate('/'); 

      if (confettiRef.current) {
        confettiRef.current.addConfetti({
          confettiColors: ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#eab308', '#22c55e'],
          confettiRadius: 6,
          confettiNumber: 500,
        });
      }

      setFormData({
        firstName: '',
        lastName: '',
        yearLevel: '',
        course: '',
      });
    }

    setIsSubmitting(false);
  };


	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4">
			<div className="max-w-2xl mx-auto">
				<div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
					<div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
						<h1 className="text-3xl font-bold text-center">Student Form</h1>
						<p className="text-center text-indigo-100 mt-2">
							Complete the form to register a new student
						</p>
					</div>

					<div className="p-8">
						<div className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="relative">
									<label className="block text-sm font-semibold text-gray-700 mb-2">
										First Name
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<User size={20} className="text-gray-400" />
										</div>
										<input
											type="text"
											name="firstName"
											value={formData.firstName}
											onChange={handleChange}
											className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
											placeholder="Enter first name"
										/>
									</div>
								</div>

								<div className="relative">
									<label className="block text-sm font-semibold text-gray-700 mb-2">
										Last Name
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<User size={20} className="text-gray-400" />
										</div>
										<input
											type="text"
											name="lastName"
											value={formData.lastName}
											onChange={handleChange}
											className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
											placeholder="Enter last name"
										/>
									</div>
								</div>
							</div>

							<div className="relative">
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Year Level
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<Hash size={20} className="text-gray-400" />
									</div>
									<input
										type="number"
										name="yearLevel"
										value={formData.yearLevel}
										onChange={handleChange}
										min="1"
										max="5"
										className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
										placeholder="Enter year level (1-5)"
									/>
								</div>
							</div>

							<div className="relative">
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Course
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<BookOpen size={20} className="text-gray-400" />
									</div>
									<input
										type="text"
										name="course"
										value={formData.course}
										onChange={handleChange}
										className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
										placeholder="e.g., BS-IT, BS-CS, BS-BA"
									/>
								</div>
							</div>

							<button
								onClick={handleSubmit}
								disabled={isSubmitting}
								className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all transform hover:scale-105 ${
									isSubmitting
										? 'bg-gray-400 cursor-not-allowed'
										: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
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
										Registering...
									</span>
								) : (
									'Register Student'
								)}
							</button>
						</div>

						<div className="mt-8 pt-6 border-t border-gray-200">
							<div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
								<p className="text-sm text-gray-600 text-center">
									<span className="font-semibold text-indigo-600">
										Sample Student:
									</span>{' '}
									Jazee Kyl Abregondo • Year 3 • BS-IT
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-6 text-center">
					<p className="text-white text-sm opacity-90">
						© 2025 Student Management System
					</p>
				</div>
			</div>
			<Toaster />
		</div>
	);
}
