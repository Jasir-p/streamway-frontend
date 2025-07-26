import { useState } from "react";
import { FileText,Trash } from "lucide-react";
import { useSelector } from "react-redux";
import { validateNotes } from "../../../../../../utils/ValidateFunctions";

const NotesDescription = ({ notes, onAddNote,dealId,onDeleteNote }) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const userId = useSelector((state) =>state.profile.id)
  const role = useSelector((state) =>state.auth.role)

  const handleSubmit = () => {
    const worderror = validateNotes(inputValue)
    if (worderror) {
      setError(worderror);
      return;
    }
    setError("");
    const addData = {
        notes:inputValue.trim(),
        created_by:role !=='owner' ? userId : null ,
        deal: dealId
    }
    onAddNote(addData);
    setInputValue("");
  };

  const handleDelete = (id) => {
    onDeleteNote(id);
    };


  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5" />
        Notes & Description
      </h2>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
  {notes.length > 0 ? (
        notes.map((note) => (
      <div key={note.id} className="flex items-start justify-between mb-4 last:mb-0">
        <div>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {note.notes}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(note.created_at).toLocaleString()}
          </p>
        </div>
        <button
          className="text-red-400 hover:text-red-500"
          onClick={() => handleDelete(note.id)}
        >
          <Trash className="h-5 w-5" />
        </button>
      </div>
    ))

  ) : (
    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
      No notes added yet.
    </p>
  )}
</div>


      <div>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add new notes (at least 5 words)..."
          rows={4}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        ></textarea>
        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}
        <button
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={handleSubmit}
        >
          Add Note
        </button>
      </div>
    </div>
  );
};

export default NotesDescription;
