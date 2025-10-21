import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Trash2, RefreshCw, Users, Plus, Eye, X } from "lucide-react";
import supabase from "../utils/supabase";

export default function StudentsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showViewGradesModal, setShowViewGradesModal] = useState(false);
  const [studentGrades, setStudentGrades] = useState([]);

  // ✅ Fetch all students
  const getStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("students").select();
    if (error) console.error("Error fetching students:", error);
    setStudents(data || []);
    setLoading(false);
  };

  // ✅ Fetch student grades (FIXED: Using 'subjects' as the relation name)
  const getStudentGrades = async (studentId) => {
    // 1. (Safety Check): Ensures the ID is a string before proceeding
    if (typeof studentId !== 'string' || studentId.length === 0) {
      console.error("Error: studentId must be a non-empty string UUID.");
      setStudentGrades([]);
      return;
    }
    
    try {
      // CRITICAL FIX: Revert to 'subjects' as the relation name, based on the latest error hint.
      const relationName = 'subjects'; 

      const { data, error } = await supabase
        .from("grades")
        .select(`
          id, 
          student_id, 
          grade, 
          semester, 
          created_at, 
          period,
          ${relationName} ( subjectCode, subjectName, units ) 
        `) 
        .eq("student_id", studentId);

      if (error) {
        console.error("Error fetching grades:", error);
        setStudentGrades([]); 
        return;
      }

      setStudentGrades(data || []); 
    } catch (err) {
      console.error("Unexpected error fetching grades:", err);
    }
  };


  // ✅ Delete student
  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) console.error("Error deleting student:", error);
    if (!error) setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  // ✅ View Grades (FIXED: Relaxed ID check to allow numbers and cast to string)
  const handleViewGrades = async (student) => {
    // CRITICAL FIX: Allow both string UUIDs OR non-zero numbers for the ID
    const isValidId = (
      (typeof student?.id === 'string' && student.id.length > 0) || 
      (typeof student?.id === 'number' && student.id > 0)
    );

    if (!student || !isValidId) {
      console.error("Cannot view grades: Student object or ID is invalid.", student);
      return; 
    }
    
    setSelectedStudent(student);
    setShowViewGradesModal(true); 
    // IMPORTANT: Convert ID to string for the Supabase call
    await getStudentGrades(String(student.id)); 
  };

  // ✅ Delete Grade
  const deleteGrade = async (gradeId) => {
    if (!window.confirm("Are you sure you want to delete this grade?")) return;
    const { error } = await supabase.from("grades").delete().eq("id", gradeId);
    if (error) console.error("Error deleting grade:", error);
    if (!error) {
      setStudentGrades((prev) => prev.filter((g) => g.id !== gradeId));
    }
  };

  // ✅ Grade color logic
  const getGradeColor = (grade) => {
    if (grade >= 90) return "bg-green-100 text-green-800";
    if (grade >= 80) return "bg-blue-100 text-blue-800";
    if (grade >= 75) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  // ✅ GPA calculation
  const calculateGPA = (grades) => {
    if (!grades || grades.length === 0) return "0.00";
    const total = grades.reduce((sum, g) => sum + (g.grade || 0), 0);
    return (total / grades.length).toFixed(2);
  };

  useEffect(() => {
    getStudents();
  }, []);

  // ✅ Handle navigation state (e.g., returning from AddGrade)
  useEffect(() => {
    if (location.state?.updatedStudentId) {
      const studentId = location.state.updatedStudentId;

      const student = students.find((s) => s.id === studentId);
      
      if (student) {
        setSelectedStudent(student);
        setShowViewGradesModal(true); 
        // Convert to string here as well
        getStudentGrades(String(studentId)); 
      } else {
        setShowViewGradesModal(true);
        getStudentGrades(String(studentId)); 
      }

      // Clear the location state to prevent re-running on refresh
      navigate("/students", { replace: true, state: {} }); 
    }
  }, [location.state, students, navigate]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Users size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Students Directory</h1>
                <p className="text-indigo-100 mt-1">
                  Total: {students.length} student{students.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/AddStudent")}
                className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-xl transition-all font-semibold flex items-center space-x-2 shadow-lg"
              >
                <Plus size={20} />
                <span>Add Student</span>
              </button>
              <button
                onClick={getStudents}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 p-3 rounded-xl transition-all"
              >
                <RefreshCw size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* STUDENTS TABLE */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-12">
                <Users size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No students found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-indigo-100">
                      <th className="text-left py-4 px-4 font-bold text-indigo-900 text-sm uppercase tracking-wide">ID</th>
                      <th className="text-left py-4 px-4 font-bold text-indigo-900 text-sm uppercase tracking-wide">Name</th>
                      <th className="text-left py-4 px-4 font-bold text-indigo-900 text-sm uppercase tracking-wide">Year</th>
                      <th className="text-left py-4 px-4 font-bold text-indigo-900 text-sm uppercase tracking-wide">Course</th>
                      <th className="text-left py-4 px-4 font-bold text-indigo-900 text-sm uppercase tracking-wide">Date Created</th>
                      <th className="text-center py-4 px-4 font-bold text-indigo-900 text-sm uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-indigo-50 transition-all">
                        <td className="py-4 px-4 text-gray-600 font-medium">
                          {/* FIX: Ensure student.id is a string before using substring/display */}
                          {`#${String(student.id || '').substring(0, 8)}...`}
                        </td>
                        <td className="py-4 px-4 capitalize font-semibold text-gray-800">
                          {student.firstName} {student.lastName}
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800">
                            Year {student.yearLevel}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800">
                            {student.course}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {new Date(student.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => handleViewGrades(student)}
                            className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 mx-1"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => deleteStudent(student.id)}
                            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 mx-1"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ✅ View Grades Modal */}
        {showViewGradesModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Student Grades</h2>
                  <p className="mt-2 capitalize">
                    {selectedStudent?.firstName} {selectedStudent?.lastName} • Year {selectedStudent?.yearLevel}
                  </p>
                  <p className="text-sm mt-1">
                    GPA: <span className="font-bold text-white">{calculateGPA(studentGrades)}</span>
                  </p>
                </div>
                <button onClick={() => setShowViewGradesModal(false)} className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                {studentGrades.length === 0 ? (
                  <div className="text-center py-12">
                    <Eye size={64} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">No grades recorded yet</p>
                    <button
                      onClick={() => {
                        setShowViewGradesModal(false);
                        navigate("/AddGrade", {
                          state: {
                            studentId: selectedStudent.id,
                            studentName: `${selectedStudent.firstName} ${selectedStudent.lastName}`,
                          },
                        });
                      }}
                      className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add First Grade
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {studentGrades.map((grade) => (
                      <div
                        key={grade.id}
                        className="border-2 border-gray-200 rounded-xl p-4 hover:border-indigo-300 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            {/* CRITICAL FIX: Access nested subject data via 'subjects' */}
                            <p className="font-bold text-gray-800">{grade.subjects?.subjectCode || 'N/A'}</p>
                            <p className="text-sm text-gray-600">{grade.subjects?.subjectName || 'Subject Deleted'}</p>
                            <p className="text-xs text-gray-500">
                              {grade.subjects?.units || '?'} units • {grade.semester} • {grade.period}
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`px-4 py-2 rounded-lg text-xl font-bold ${getGradeColor(grade.grade)}`}>
                              {grade.grade}
                            </span>
                            <button
                              onClick={() => deleteGrade(grade.id)}
                              className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}