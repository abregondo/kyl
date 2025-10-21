import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Trash2, RefreshCw, Award, Plus, TrendingUp } from "lucide-react";
import supabase from "../utils/supabase";

export default function GradesPage() {
  const navigate = useNavigate();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  const getGrades = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("grades")
      .select(`
        *,
        students (firstName, lastName),
        subjects (subjectCode, subjectName)
      `);
    setGrades(data || []);
    setLoading(false);
  };

  const deleteGrade = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this grade?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("grades")
      .delete()
      .eq("id", id);
    
    if (!error) {
      setGrades(prev => prev.filter(grade => grade.id !== id));
    }
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'bg-green-100 text-green-800';
    if (grade >= 80) return 'bg-blue-100 text-blue-800';
    if (grade >= 75) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getGradeLabel = (grade) => {
    if (grade >= 90) return 'Excellent';
    if (grade >= 80) return 'Good';
    if (grade >= 75) return 'Passing';
    return 'Failed';
  };

  useEffect(() => {
    getGrades();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white bg-opacity-20 p-4 rounded-full">
                  <Award size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Grades Management</h1>
                  <p className="text-emerald-100 mt-1">
                    Total: {grades.length} grade{grades.length !== 1 ? 's' : ''} recorded
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/AddGrade')}
                  className="bg-white text-emerald-600 hover:bg-emerald-50 px-6 py-3 rounded-xl transition-all font-semibold flex items-center space-x-2 shadow-lg"
                >
                  <Plus size={20} />
                  <span>Add Grade</span>
                </button>
                <button
                  onClick={getGrades}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 p-3 rounded-xl transition-all"
                >
                  <RefreshCw size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              </div>
            ) : grades.length === 0 ? (
              <div className="text-center py-12">
                <Award size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No grades found</p>
                <button
                  onClick={() => navigate('/AddGrade')}
                  className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Add Your First Grade
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-emerald-100">
                      <th className="text-left py-4 px-4 font-bold text-emerald-900 text-sm uppercase tracking-wide">
                        Student
                      </th>
                      <th className="text-left py-4 px-4 font-bold text-emerald-900 text-sm uppercase tracking-wide">
                        Subject
                      </th>
                      <th className="text-left py-4 px-4 font-bold text-emerald-900 text-sm uppercase tracking-wide">
                        Semester
                      </th>
                      <th className="text-left py-4 px-4 font-bold text-emerald-900 text-sm uppercase tracking-wide">
                        Grade
                      </th>
                      <th className="text-left py-4 px-4 font-bold text-emerald-900 text-sm uppercase tracking-wide">
                        Status
                      </th>
                      <th className="text-left py-4 px-4 font-bold text-emerald-900 text-sm uppercase tracking-wide">
                        Date Recorded
                      </th>
                      <th className="text-center py-4 px-4 font-bold text-emerald-900 text-sm uppercase tracking-wide">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {grades.map((grade) => (
                      <tr
                        key={grade.id}
                        className="hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-200"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold">
                              {grade.students?.firstName?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 capitalize">
                                {grade.students?.firstName} {grade.students?.lastName}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-bold text-sm text-emerald-700">
                              {grade.subjects?.subjectCode}
                            </p>
                            <p className="text-xs text-gray-600">
                              {grade.subjects?.subjectName}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                            {grade.semester}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-4 py-2 rounded-lg text-lg font-bold ${getGradeColor(grade.grade)}`}>
                              {grade.grade}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getGradeColor(grade.grade)}`}>
                            {getGradeLabel(grade.grade)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600">
                            <p className="font-medium">
                              {new Date(grade.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(grade.created_at).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => deleteGrade(grade.id)}
                              className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                              title="Delete grade"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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