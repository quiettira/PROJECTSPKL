// src/components/NoteCard.js
import Link from "next/link";

export default function NoteCard({ note, onDelete }) {
  return (
    <div className="bg-white rounded shadow-sm p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg truncate">{note.title}</h3>
        <div className="text-sm text-gray-400">{note.created_at?.split(" ")[0]}</div>
      </div>
      <p className="text-sm text-gray-600 mt-2 line-clamp-3">{note.content}</p>

      <div className="mt-3 flex gap-2">
        <Link href={`/notes/${note.id}`}>
          <button className="text-sky-600 px-3 py-1 rounded hover:bg-sky-50">Detail</button>
        </Link>
        <Link href={`/notes/${note.id}`}>
          <button className="text-yellow-600 px-3 py-1 rounded hover:bg-yellow-50">Edit</button>
        </Link>
        <button onClick={() => onDelete(note.id)} className="ml-auto text-red-600 px-3 py-1 rounded hover:bg-red-50">Delete</button>
      </div>
    </div>
  );
}
