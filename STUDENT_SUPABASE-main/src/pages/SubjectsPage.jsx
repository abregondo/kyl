import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Trash2, RefreshCw, BookOpen, Plus, Edit } from "lucide-react";
import supabase from "../utils/supabase";

export default function SubjectsPage() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const getSubjects = async () => {
    setLoading(true);
    const { data } = await supabase.from("subjects").select();
    setSubjects(data || []);
    setLoading(false);
  };

  const deleteSubject = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this subject?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("subjects")
      .delete()
      .eq("id", id);
    
    if (!error) {
      setSubjects(prev => prev.filter(subject => subject.id !== id));
    }
  };

  useEffect(() => {
    getSubjects();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white bg-opacity-20 p-4 rounded-full">
                  <BookOpen size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Subjects Directory</h1>
                  <p className="text-blue-100 mt-1">
                    Total: {subjects.length} subject{subjects.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/AddSubject')}
                  className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl transition-all font-semibold flex items-center space-x-2 shadow-lg"
                >
                  <Plus size={20} />
                  <span>Add Subject</span>
                </button>
                <button
                  onClick={getSubjects}
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : subjects.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No subjects found</p>
                <button
                  onClick={() => navigate('/AddSubject')}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Your First Subject
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-blue-100">
                      <th className="text-left py-4 px-4 font-bold text-blue-900 text-sm uppercase tracking-wide">
                        Code
                      </th>
                      <th className="text-left py-4 px-4 font-bold text-blue-900 text-sm uppercase tracking-wide">
                        Subject Name
                      </th>
                      <th className="text-left py-4 px-4 font-bold text-blue-900 text-sm uppercase tracking-wide">
                        Units
                      </th>
                      <th className="text-left py-4 px-4 font-bold text-blue-900 text-sm uppercase tracking-wide">
                        Description
                      </th>
                      <th className="text-left py-4 px-4 font-bold text-blue-900 text-sm uppercase tracking-wide">
                        Date Created
                      </th>
                      <th className="text-center py-4 px-4 font-bold text-blue-900 text-sm uppercase tracking-wide">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {subjects.map((subject) => (
                      <tr
                        key={subject.id}
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200"
                      >
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold bg-blue-100 text-blue-800">
                            {subject.subjectCode}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold">
                              {subject.subjectName?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">
                                {subject.subjectName}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800">
                            {subject.units} {subject.units === 1 ? 'unit' : 'units'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-600 max-w-xs truncate">
                            {subject.description || 'No description'}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600">
                            <p className="font-medium">
                              {new Date(subject.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(subject.created_at).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => deleteSubject(subject.id)}
                              className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                              title="Delete subject"
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