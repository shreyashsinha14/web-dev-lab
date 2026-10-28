const { useEffect, useMemo, useState } = React;
const STORAGE_KEY = "shreyash-react-notes-v1";

function NotesApp() {
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const visibleNotes = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return notes;
    return notes.filter(note =>
      note.title.toLowerCase().includes(query) ||
      note.body.toLowerCase().includes(query)
    );
  }, [notes, search]);

  function resetEditor() {
    setEditingId(null);
    setTitle("");
    setBody("");
    setError("");
  }

  function saveNote(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    const cleanBody = body.trim();
    if (!cleanTitle || !cleanBody) {
      setError("Please enter both a title and some note text.");
      return;
    }
    if (editingId !== null) {
      setNotes(current => current.map(note =>
        note.id === editingId
          ? { ...note, title: cleanTitle, body: cleanBody, updatedAt: new Date().toISOString() }
          : note
      ));
    } else {
      setNotes(current => [{
        id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()),
        title: cleanTitle,
        body: cleanBody,
        updatedAt: new Date().toISOString()
      }, ...current]);
    }
    resetEditor();
  }

  function editNote(note) {
    setEditingId(note.id);
    setTitle(note.title);
    setBody(note.body);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteNote(id) {
    if (window.confirm("Delete this note?")) {
      setNotes(current => current.filter(note => note.id !== id));
      if (editingId === id) resetEditor();
    }
  }

  function formatDate(value) {
    return new Date(value).toLocaleDateString(undefined, {
      month: "short", day: "numeric", year: "numeric"
    });
  }

  return (
    <main className="app">
      <header>
        <div className="brand">
          <h1>My Notes</h1>
          <p>Capture ideas, keep them organised.</p>
        </div>
        <div className="profile">Shreyash Sinha · Experiment 7</div>
      </header>

      <form className="editor" onSubmit={saveNote}>
        <h2>{editingId !== null ? "Edit note" : "Create a note"}</h2>
        {error && <p className="notice" role="alert">{error}</p>}
        <input
          aria-label="Note title"
          placeholder="Note title"
          value={title}
          onChange={event => setTitle(event.target.value)}
          maxLength="100"
        />
        <textarea
          aria-label="Note text"
          placeholder="Write your note here..."
          value={body}
          onChange={event => setBody(event.target.value)}
          rows="4"
        />
        <div className="editor-actions">
          {editingId !== null && <button className="secondary" type="button" onClick={resetEditor}>Cancel</button>}
          <button className="primary" type="submit">{editingId !== null ? "Update note" : "Save note"}</button>
        </div>
      </form>

      <div className="toolbar">
        <input
          className="search"
          aria-label="Search notes"
          placeholder="Search by title or text..."
          value={search}
          onChange={event => setSearch(event.target.value)}
        />
        <button className="primary" type="button" onClick={() => {
          resetEditor();
          document.querySelector(".editor input")?.focus();
        }}>+ New note</button>
      </div>

      <section className="notes-grid" aria-live="polite">
        {visibleNotes.length === 0 ? (
          <div className="empty">
            <h2>{search ? "No matching notes" : "No notes yet"}</h2>
            <p>{search ? "Try a different search term." : "Create your first note using the form above."}</p>
          </div>
        ) : visibleNotes.map(note => (
          <article className="note" key={note.id}>
            <h2>{note.title}</h2>
            <p>{note.body}</p>
            <footer>
              <span>Updated {formatDate(note.updatedAt)}</span>
              <div className="note-actions">
                <button type="button" onClick={() => editNote(note)}>Edit</button>
                <button type="button" className="delete" onClick={() => deleteNote(note.id)}>Delete</button>
              </div>
            </footer>
          </article>
        ))}
      </section>
    </main>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<NotesApp />);
