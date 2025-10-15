"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

export default function NoteDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [note, setNote] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });
  const [token, setToken] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);

  useEffect(() => {
    // Load user data from localStorage on client-side only
    setToken(localStorage.getItem("token"));
    setCurrentUserEmail(localStorage.getItem("email"));
  }, []);

  useEffect(() => {
    if (id && token) fetchNote();
  }, [id, token]);

  async function fetchNote() {
    try {
      const res = await apiRequest(`/notes/${id}`, "GET", null, token);
      console.log("📝 Note data:", res);
      console.log("👤 Current user email:", currentUserEmail);
      console.log("✅ Is owner?", res.user_email === currentUserEmail);
      setNote(res);
      setForm({ title: res.title, content: res.content });
    } catch (err) {
      alert("❌ Gagal ambil detail note: " + err.message);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      await apiRequest(`/notes/${id}`, "PUT", form, token);
      alert("✅ Note berhasil diperbarui!");
      setEditMode(false);
      fetchNote();
    } catch (err) {
      alert("❌ Gagal update note: " + err.message);
    }
  }

  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F5F0' }}>
        <p style={{ color: '#8B7355' }}>Memuat data...</p>
      </div>
    );
  }

  const isOwner = note.user_email === currentUserEmail;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F0' }}>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/notes")}
          className="mb-6 flex items-center gap-2 px-4 py-2 rounded-lg transition"
          style={{ color: '#8B7355' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#E6D8C3'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Notes
        </button>

        {/* Note Content */}
        <div className="rounded-2xl shadow-lg p-8" style={{ backgroundColor: 'white', border: '1px solid #E6D8C3' }}>
          {editMode ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#4A4A4A' }}>
                  Title
                </label>
                <input
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition"
                  style={{ backgroundColor: '#F5F5F0', border: '1px solid #E6D8C3', color: '#4A4A4A' }}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#4A4A4A' }}>
                  Content
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 resize-none transition"
                  style={{ backgroundColor: '#F5F5F0', border: '1px solid #E6D8C3', color: '#4A4A4A' }}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows="10"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg font-medium transition shadow-md hover:shadow-lg"
                  style={{ backgroundColor: '#E6D8C3', color: '#4A4A4A' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#D4C5B0'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#E6D8C3'}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="px-6 py-3 rounded-lg font-medium transition"
                  style={{ backgroundColor: '#F5F5F0', color: '#8B7355', border: '1px solid #E6D8C3' }}
                  onClick={() => setEditMode(false)}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#E6D8C3'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#F5F5F0'}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-4" style={{ color: '#4A4A4A' }}>{note.title}</h1>
              <div className="mb-6 pb-4" style={{ borderBottom: '1px solid #E6D8C3' }}>
                <div className="flex items-center gap-4 text-sm" style={{ color: '#8B7355' }}>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {note.user_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {note.user_email}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {note.created_at}
                  </span>
                </div>
              </div>
              <p className="text-base leading-relaxed mb-6 whitespace-pre-wrap" style={{ color: '#6B5D4F' }}>
                {note.content}
              </p>
              {isOwner && (
                <div className="flex gap-3">
                  <button
                    className="px-6 py-3 rounded-lg font-medium transition shadow-md hover:shadow-lg"
                    style={{ backgroundColor: '#E6D8C3', color: '#4A4A4A' }}
                    onClick={() => setEditMode(true)}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#D4C5B0'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#E6D8C3'}
                  >
                    Edit Note
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
