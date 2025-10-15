"use client";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [token, setToken] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [currentUserName, setCurrentUserName] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Load user data from localStorage on client-side only
    setToken(localStorage.getItem("token"));
    setCurrentUserEmail(localStorage.getItem("email"));
    setCurrentUserName(localStorage.getItem("name"));
  }, []);

  useEffect(() => {
    if (token) {
      fetchNotes();
    }
  }, [token]);

  async function fetchNotes() {
    try {
      const res = await apiRequest("/notes", "GET", null, token);
      setNotes(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("❌ Error GET notes:", err);
      setNotes([]);
    }
  }

  async function createNote(e) {
    e.preventDefault();
    if (!newNote.title.trim()) return;
    
    setLoading(true);
    try {
      await apiRequest("/notes", "POST", newNote, token);
      setNewNote({ title: "", content: "" });
      setShowForm(false);
      fetchNotes();
    } catch (err) {
      alert("❌ Gagal menambah note: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteNote(id) {
    if (!confirm("Hapus note ini?")) return;
    try {
      await apiRequest(`/notes/${id}`, "DELETE", null, token);
      fetchNotes();
    } catch (err) {
      alert("❌ Gagal hapus note: " + err.message);
    }
  }

  function handleLogout() {
    localStorage.clear();
    router.push("/login");
  }

  const myNotes = notes.filter(n => n.user_email === currentUserEmail);
  const sharedNotes = notes.filter(n => n.user_email !== currentUserEmail);

  // Show loading while checking authentication
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F5F0' }}>
        <p style={{ color: '#8B7355' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F0' }}>
      {/* Header */}
      <div className="border-b shadow-sm" style={{ backgroundColor: 'white', borderColor: '#E6D8C3' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E6D8C3' }}>
              <svg className="w-6 h-6" style={{ color: '#8B7355' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: '#4A4A4A' }}>Notes Sharing</h1>
              <p className="text-xs" style={{ color: '#8B7355' }}>Share your thoughts with everyone</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium" style={{ color: '#4A4A4A' }}>{currentUserName}</p>
              <p className="text-xs" style={{ color: '#8B7355' }}>{currentUserEmail}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm rounded-lg transition"
              style={{ color: '#8B7355' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#F5F5F0'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Create Note */}
          <div className="lg:col-span-1">
            <div className="rounded-xl shadow-sm p-6 sticky top-6" style={{ backgroundColor: 'white', border: '1px solid #E6D8C3' }}>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#4A4A4A' }}>
                <svg className="w-6 h-6" style={{ color: '#8B7355' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Create New Note
              </h2>
              
              <form onSubmit={createNote} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Note title..."
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition"
                    style={{ backgroundColor: '#F5F5F0', border: '1px solid #E6D8C3', color: '#4A4A4A' }}
                    required
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Write your note content here..."
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    rows="4"
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 resize-none transition"
                    style={{ backgroundColor: '#F5F5F0', border: '1px solid #E6D8C3', color: '#4A4A4A' }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !newNote.title.trim()}
                  className="w-full py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md hover:shadow-lg"
                  style={{ backgroundColor: '#E6D8C3', color: '#4A4A4A' }}
                  onMouseEnter={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#D4C5B0')}
                  onMouseLeave={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#E6D8C3')}
                >
                  {loading ? "Creating..." : "Create Note"}
                </button>
              </form>

              <div className="mt-6 pt-6" style={{ borderTop: '1px solid #E6D8C3' }}>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: '#8B7355' }}>Total Notes</span>
                  <span className="font-semibold" style={{ color: '#4A4A4A' }}>{notes.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span style={{ color: '#8B7355' }}>Your Notes</span>
                  <span className="font-semibold" style={{ color: '#8B7355' }}>{myNotes.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span style={{ color: '#8B7355' }}>Shared Notes</span>
                  <span className="font-semibold" style={{ color: '#8B7355' }}>{sharedNotes.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Notes List */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Notes Section */}
            {myNotes.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#4A4A4A' }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#8B7355' }}></span>
                  Your Notes ({myNotes.length})
                </h2>
                <div className="space-y-3">
                  {myNotes.map((n) => (
                    <div
                      key={n.id}
                      className="rounded-xl p-5 shadow-sm hover:shadow-md transition group"
                      style={{ backgroundColor: '#E6D8C3', border: '1px solid #D4C5B0' }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2" style={{ color: '#4A4A4A' }}>{n.title}</h3>
                          <p className="text-sm leading-relaxed mb-3" style={{ color: '#6B5D4F' }}>{n.content}</p>
                          <div className="flex items-center gap-4 text-xs" style={{ color: '#8B7355' }}>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              {n.user_name}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {n.created_at}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() => router.push(`/notes/${n.id}`)}
                            className="p-2 rounded-lg transition"
                            style={{ color: '#8B7355' }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#D4C5B0'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            title="View Details"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteNote(n.id)}
                            className="p-2 rounded-lg transition"
                            style={{ color: '#C17767' }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#D4C5B0'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shared Notes Section */}
            {sharedNotes.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#4A4A4A' }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#A89F91' }}></span>
                  Shared by Others ({sharedNotes.length})
                </h2>
                <div className="space-y-3">
                  {sharedNotes.map((n) => (
                    <div
                      key={n.id}
                      className="rounded-xl p-5 shadow-sm hover:shadow-md transition group cursor-pointer"
                      style={{ backgroundColor: 'white', border: '1px solid #E6D8C3' }}
                      onClick={() => router.push(`/notes/${n.id}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2" style={{ color: '#4A4A4A' }}>{n.title}</h3>
                          <p className="text-sm leading-relaxed mb-3" style={{ color: '#6B5D4F' }}>{n.content}</p>
                          <div className="flex items-center gap-4 text-xs" style={{ color: '#8B7355' }}>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              {n.user_name}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              {n.user_email}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {n.created_at}
                            </span>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition ml-4">
                          <svg className="w-5 h-5" style={{ color: '#8B7355' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {notes.length === 0 && (
              <div className="rounded-xl p-12 text-center" style={{ backgroundColor: 'white', border: '1px solid #E6D8C3' }}>
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#F5F5F0' }}>
                  <svg className="w-10 h-10" style={{ color: '#A89F91' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#4A4A4A' }}>No notes yet</h3>
                <p className="text-sm" style={{ color: '#8B7355' }}>Create your first note to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
