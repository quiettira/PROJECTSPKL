"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiRequest("/register", "POST", form);
      if (res.message) {
        alert("✅ Register berhasil! Silakan login sekarang.");
        router.push("/login"); // ⬅️ otomatis pindah ke halaman login
      } else {
        alert(res.error || "Gagal register");
      }
    } catch (err) {
      alert("Gagal register: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F5F5F0' }}>
      {/* Left Side - Welcome Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12" style={{ backgroundColor: '#E6D8C3' }}>
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full" style={{ backgroundColor: '#D4C5B0', transform: 'translate(30%, -30%)' }}></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full" style={{ backgroundColor: '#D4C5B0', transform: 'translate(-30%, 30%)' }}></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8 shadow-md" style={{ backgroundColor: 'white' }}>
            <svg className="w-8 h-8" style={{ color: '#8B7355' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          
          <h1 className="text-5xl font-bold mb-4" style={{ color: 'white' }}>
            Join Us<br />Today!
          </h1>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2" style={{ color: '#4A4A4A' }}>Sign Up</h2>
              <p className="text-sm" style={{ color: '#8B7355' }}>Create your account to get started.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#4A4A4A' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition"
                  style={{ 
                    backgroundColor: '#F5F5F0',
                    border: '1px solid #E6D8C3',
                    color: '#4A4A4A'
                  }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#4A4A4A' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition"
                  style={{ 
                    backgroundColor: '#F5F5F0',
                    border: '1px solid #E6D8C3',
                    color: '#4A4A4A'
                  }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#4A4A4A' }}>
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition"
                  style={{ 
                    backgroundColor: '#F5F5F0',
                    border: '1px solid #E6D8C3',
                    color: '#4A4A4A'
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white py-3 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md hover:shadow-lg"
                style={{ 
                  backgroundColor: '#E6D8C3',
                  color: '#4A4A4A'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#D4C5B0'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#E6D8C3'}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-sm" style={{ color: '#8B7355' }}>
                Already have an account?{" "}
                <button
                  onClick={() => router.push("/login")}
                  className="font-semibold transition"
                  style={{ color: '#8B7355' }}
                  onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
