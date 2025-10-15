// src/components/Sidebar.js
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-72 bg-white border-r hidden md:block">
      <div className="p-4">
        <div className="text-lg font-semibold mb-4">Quick lists</div>

        <nav className="space-y-2">
          <Link href="/notes">
            <a className="block px-3 py-2 rounded hover:bg-gray-50">All Notes</a>
          </Link>
          <Link href="/notes/create">
            <a className="block px-3 py-2 rounded hover:bg-gray-50">+ Create Note</a>
          </Link>
          <div className="mt-6 text-sm text-gray-500">Categories</div>
          <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-50">Personal</button>
          <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-50">Work</button>
        </nav>
      </div>
    </aside>
  );
}
