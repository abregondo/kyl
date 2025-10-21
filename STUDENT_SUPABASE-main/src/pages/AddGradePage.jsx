import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { Award, User, BookOpen, Calendar, Clock } from "lucide-react";
import supabase from "../utils/supabase";

export default function AddGradePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const passedStudentId = location.state?.studentId || "";
  const passedStudentName = location.state?.studentName || "";

  const [formData, setFormData] = useState({
    student_id: passedStudentId,
    subject_id: "",
    grade: "",
    semester: "",
    period: "",
  });

  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const confettiRef = useRef(null);

  // ✅ Load confetti & fetch data
  useEffect(() => {
    if (!window.JSConfetti) {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/js-confetti@latest/dist/js-confetti.browser.js";
      script.async = true;
      script.onload = () => {
        confettiRef.current = new window.JSConfetti();
      };
      document.body.appendChild(script);
    } else {
      confettiRef.current = new window.JSConfetti();
    }

    fetchStudentsAndSubjects();
  }, []);

  // ✅ Fetch students and subjects
  const fetchStudentsAndSubjects = async () => {
    setLoading(true);

    const { data: studentsData, error: studentError } = await supabase
      .from("students")
      .select("id, firstName, lastName")
      .order("firstName", { ascending: true });

    const { data: subjectsData, error: subjectError } = await supabase
      .from("subjects")
      .select("id, subjectcode, subjectname")
      .order("subjectcode", { ascending: true });

    if (studentError) console.error("Error fetching students:", studentError);
    if (subjectError) console.error("Error fetching subjects:", subjectError);

    setStudents(studentsData || []);
    setSubjects(subjectsData || []);
    setLoading(false);
  };

  // ✅ Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Submit form
  const handleSubmit = async () => {
    if (
      !formData.student_id ||
      !formData.subject_id ||
      !formData.grade ||
      !formData.semester ||
      !formData.period
    ) {
      alert("⚠️ Please fill in all fields before submitting.");
      return;
    }

    const studentId = parseInt(formData.student_id);
    const subjectId = parseInt(formData.subject_id);
    const gradeValue = parseFloat(formData.grade);

    if (isNaN(studentId) || isNaN(subjectId)) {
      alert("⚠️ Invalid student or subject ID.");
      return;
    }

    if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 100) {
      alert("⚠️ Grade must be between 0 and 100.");
      return;
    }

    setIsSubmitting(true);

    const gradeData = {
      student_id: studentId,
      subject_id: subjectId,
      grade: gradeValue,
      semester: formData.semester,
      period: formData.period,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("grades").insert([gradeData]);

    setIsSubmitting(false);

    if (error) {
      console.error("Error adding grade:", error);
      alert(`❌ Failed to add grade: ${error.message}`);
      return;
    }

    // 🎉 Confetti animation
    if (confettiRef.current) {
      confettiRef.current.addConfetti({
        confettiColors: [
          "#10b981",
          "#14b8a6",
          "#06b6d4",
          "#3b82f6",
          "#8b5cf6",
          "#ec4899",
        ],
        confettiRadius: 5,
        confettiNumber: 400,
      });
    }

    alert("✅ Grade recorded successfully!");

    setFormData({
      student_id: passedStudentId,
      subject_id: "",
      grade: "",
      semester: "",
      period: "",
    });

    // ✅ Redirect to StudentsPage with studentId
    setTimeout(() => {
      navigate("/students", {
        state: { updatedStudentId: studentId, fromAddGrade: true },
      });
    }, 1500);
  };

  // ✅ Loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500">
        <h1 className="text-white text-2xl font-semibold">
          Loading student and subject data...
        </h1>
      </div>
    );
  }

  // ✅ Page layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white text-center">
            <h1 className="text-3xl font-bold mb-2 flex justify-center items-center gap-2">
              <Award className="w-7 h-7" /> Add Student Grade
            </h1>
            <p className="text-emerald-100">Record a new grade for a student</p>
          </div>

          <div className="p-8 space-y-6">
            {/* Student Select */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <User className="inline mr-2 w-4 h-4" />
                Select Student <span className="text-red-500">*</span>
              </label>
              <select
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
                disabled={!!passedStudentId}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 bg-gray-100"
              >
                <option value="">Choose a student...</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.firstName} {student.lastName}
                  </option>
                ))}
              </select>

              {passedStudentName && (
                <p className="text-sm text-gray-600 mt-1 italic">
                  Selected student: <b>{passedStudentName}</b>
                </p>
              )}
            </div>

            {/* Subject Select */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <BookOpen className="inline mr-2 w-4 h-4" />
                Select Subject <span className="text-red-500">*</span>
              </label>
              <select
                name="subject_id"
                value={formData.subject_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Choose a subject...</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.subjectcode} - {subject.subjectname}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester & Period */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="inline mr-2 w-4 h-4" />
                  Semester <span className="text-red-500">*</span>
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select semester...</option>
                  <option value="1st Semester">1st Semester</option>
                  <option value="2nd Semester">2nd Semester</option>
                  <option value="Summer">Summer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Clock className="inline mr-2 w-4 h-4" />
                  Period <span className="text-red-500">*</span>
                </label>
                <select
                  name="period"
                  value={formData.period}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select period...</option>
                  <option value="PRELIM">PRELIM</option>
                  <option value="MIDTERM">MIDTERM</option>
                  <option value="SEMI-FINAL">SEMI-FINAL</option>
                  <option value="FINAL">FINAL</option>
                </select>
              </div>
            </div>

            {/* Grade Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Grade (0–100) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.01"
                placeholder="Enter grade"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              }`}
            >
              {isSubmitting ? "Recording Grade..." : "Record Grade"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
