import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BookCard from "./components/BookCard";
import AOS from "aos";
import "aos/dist/aos.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [savedBooks, setSavedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedBooks") || "[]");
    setSavedBooks(saved);
  }, []);

  const handleSearch = async (q) => {
    const qSafe = (q ?? query).trim();

    if (!qSafe) {
      setSearched(false);
      setBooks([]);
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(qSafe)}&limit=24`
      );
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      setBooks(Array.isArray(data.docs) ? data.docs : []);
    } catch {
      setError("Something went wrong. Please try again.");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveBook = (book) => {
    const isAlreadySaved = savedBooks.some((b) => b.key === book.key);
    let updated;

    if (isAlreadySaved) {
      updated = savedBooks.filter((b) => b.key !== book.key);
    } else {
      updated = [...savedBooks, book];
    }

    setSavedBooks(updated);
    localStorage.setItem("savedBooks", JSON.stringify(updated));
  };

  const booksToDisplay = showSaved ? savedBooks : books;

  return (
    <>
      <Navbar
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
        loading={loading}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        setShowSaved={setShowSaved}   // ✅ pass setter, not a toggler
        showSaved={showSaved}
        setSearched={setSearched}
      />

      <main className="container-fluid p-0">
        {!searched && !showSaved && (
          <div className="hero-section text-center text-white">
            <div className="hero-overlay">
              <div className="hero-content">
                <h1 className="fw-bold mb-3">Discover Your Next Favorite Book 📖</h1>
                <p className="lead mb-4">
                  Search through millions of titles from the <strong>Open Library</strong>.
                </p>
                <button
                  className="btn btn-light btn-lg fw-semibold shadow-sm"
                  onClick={() => {
                    setQuery("Harry Potter");
                    handleSearch("Harry Potter");
                  }}
                >
                  Try “Harry Potter”
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="container py-4">
          {showSaved && (
            <h4 className="fw-bold mb-4 text-center">
              ❤️ Your Saved Books ({savedBooks.length})
            </h4>
          )}

          {error && <div className="alert alert-danger">{error}</div>}

          {loading && (
            <div className="d-flex justify-content-center align-items-center py-5">
              <div className="spinner-border" role="status"></div>
              <span className="ms-2">Searching…</span>
            </div>
          )}

          {!loading && searched && booksToDisplay.length === 0 && !error && (
            <div className="text-center text-muted py-5">
              <h6>No results found</h6>
              <p className="small">Try a different keyword or spelling.</p>
            </div>
          )}

          {!loading && booksToDisplay.length > 0 && (
            <div className="row">
              {booksToDisplay.map((book, idx) => (
                <BookCard
                  key={`${book.key || idx}`}
                  book={book}
                  onToggleSave={toggleSaveBook}
                  isSaved={savedBooks.some((b) => b.key === book.key)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
