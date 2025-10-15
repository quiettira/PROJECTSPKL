// src/components/Navbar.js
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const path = usePathname();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold text-sky-600">NotesApp</div>
          <div className="text-sm text-gray-500 hidden sm:block">Simple notes dashboard</div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/notes">
            <button className={`px-3 py-1 rounded ${path.startsWith("/notes") ? "bg-sky-100 text-sky-700" : "text-gray-600 hover:bg-gray-50"}`}>Notes</button>
          </Link>
          <Link href="/admin/logs"><button className="px-3 py-1 rounded text-gray-600 hover:bg-gray-50">Logs</button></Link>
          <div className="ml-4">
            <button id="logoutBtn" className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
          </div>
        </div>
      </div>
    </header>
  );
}
