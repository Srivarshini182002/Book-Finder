import React, { useState, useEffect, useCallback, useRef } from "react";
import { FaSun, FaMoon, FaBook, FaSearch, FaHeart, FaBars, FaHome } from "react-icons/fa";

export default function Navbar({
  query,
  setQuery,
  onSearch,
  loading,
  darkMode,
  toggleDarkMode,
  setShowSaved,    // ✅ pass the real state setter
  showSaved,
  setSearched,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [liveSuggestions, setLiveSuggestions] = useState([]);
  const debounceRef = useRef(null);
// 📚 Explore categories (book-accurate)
// 📚 Curated Explore Categories
const categories = [
  { name: "Fiction", emoji: "📖", img: "https://cdn-icons-png.flaticon.com/512/2232/2232688.png" },
  { name: "Non-Fiction", emoji: "📚", img: "https://cdn-icons-png.flaticon.com/512/3199/3199881.png" },
  { name: "Science & Technology", emoji: "🧬", img: "https://cdn-icons-png.flaticon.com/512/1048/1048945.png" },
  { name: "History", emoji: "🏺", img: "https://cdn-icons-png.flaticon.com/512/1828/1828415.png" },
  { name: "Fantasy", emoji: "🧙‍♂️", img: "https://cdn-icons-png.flaticon.com/512/4149/4149678.png" },
  { name: "Romance", emoji: "💞", img: "https://cdn-icons-png.flaticon.com/512/833/833300.png" },
  { name: "Mystery & Thriller", emoji: "🕵️‍♀️", img: "https://cdn-icons-png.flaticon.com/512/753/753318.png" },
  { name: "Children’s Books", emoji: "🧒", img: "https://cdn-icons-png.flaticon.com/512/2748/2748588.png" },
  { name: "Art & Design", emoji: "🎨", img: "https://cdn-icons-png.flaticon.com/512/2921/2921822.png" },
  { name: "Poetry & Literature", emoji: "✒️", img: "https://cdn-icons-png.flaticon.com/512/3406/3406923.png" },
  { name: "Philosophy", emoji: "💭", img: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png" },
  { name: "Comics & Graphic Novels", emoji: "💥", img: "https://cdn-icons-png.flaticon.com/512/2907/2907683.png" },
];





  const loadSuggestions = useCallback(async (text) => {
    if (!text || text.length < 2) {
      setLiveSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(text)}&limit=7`
      );
      const data = await res.json();
      if (Array.isArray(data.docs)) {
        const titles = data.docs
          .map((d) => d.title)
          .filter((v, i, a) => v && a.indexOf(v) === i);
        setLiveSuggestions(titles.slice(0, 7));
      }
    } catch (err) {
      console.error("Suggestion fetch error:", err);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length > 1) {
      debounceRef.current = setTimeout(() => loadSuggestions(query), 400);
    } else {
      setLiveSuggestions([]);
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, loadSuggestions]);

  // Shared search flow
  const doSearch = (searchText) => {
    setQuery(searchText);
    setSearched(true);
    setShowSuggestions(false);
    setShowSaved(false);     // ✅ explicitly hide Saved
    onSearch(searchText);
  };

  const submit = (e) => {
    e.preventDefault();
    if (query.trim() !== "") doSearch(query);
  };

  const handleSuggestionClick = (title) => doSearch(title);

  const handleExploreClick = (category) => {
    doSearch(category);
    const dropdown = document.getElementById("exploreDropdown");
    if (dropdown) dropdown.classList.remove("show");
  };

  const handleHomeClick = () => {
    setQuery("");
    setSearched(false);
    setShowSuggestions(false);
    setShowSaved(false);   // ✅ ensure we leave Saved mode
    onSearch("");          // clear results
  };

  return (
    <nav className={`navbar navbar-expand-lg sticky-top shadow-sm ${darkMode ? "navbar-dark bg-dark glass-nav" : "navbar-dark glass-nav"}`}>
      <div className="container-fluid px-4 d-flex align-items-center justify-content-between">
        {/* Logo */}
        <div className="d-flex align-items-center">
          <FaBook className="me-2 text-light fs-4" />
          <span className="navbar-brand fw-bold fs-5 text-white">Book Finder</span>
        </div>

        {/* Mobile Menu */}
        <button
          className="navbar-toggler border-0 text-white"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FaBars />
        </button>

        {/* Menu Items */}
        <div className={`collapse navbar-collapse justify-content-end ${menuOpen ? "show" : ""}`}>
          <ul className="navbar-nav align-items-center gap-3">
            {/* 🏠 Home */}
            <li className="nav-item">
              <button
                className="btn btn-outline-light rounded-pill fw-semibold d-flex align-items-center gap-2"
                onClick={handleHomeClick}
              >
                <FaHome /> Home
              </button>
            </li>

            {/* 📚 Explore */}
            <li className="nav-item dropdown">
              <button
                className="btn nav-link dropdown-toggle text-white fw-semibold"
                id="exploreDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Explore
              </button>
   <ul className="dropdown-menu dropdown-menu-end explore-grid shadow-lg border-0 rounded-4 p-3">
  <h6 className="fw-bold text-secondary px-2 mb-2">📚 Explore by Category</h6>
  <div className="explore-grid-container">
    {categories.map((cat) => (
      <button
        key={cat.name}
        className="explore-item d-flex align-items-center gap-3"
        onClick={() => handleExploreClick(cat.name)}
      >
        <span className="emoji-badge">{cat.emoji}</span>
        <span className="category-text">{cat.name}</span>
      </button>
    ))}
  </div>
</ul>


            </li>

            {/* ❤️ Saved */}
            <li className="nav-item">
              <button
                className={`btn ${showSaved ? "btn-warning text-dark" : "btn-outline-light"
                  } rounded-pill fw-semibold d-flex align-items-center gap-2`}
                onClick={() => {
                  setShowSuggestions(false);
                  if (!showSaved) {
                    // enabling Saved view
                    setQuery("");
                    setSearched(false);
                    setShowSaved(true);   // ✅ set explicitly
                    onSearch("");         // clear results list
                  } else {
                    // leaving Saved view
                    setShowSaved(false);
                    setQuery("");
                    setSearched(false);
                    onSearch("");         // clear results
                  }
                }}
              >
                <FaHeart /> Saved
              </button>
            </li>

            {/* 🔍 Search */}
            <li className="nav-item position-relative">
              <form className="d-flex align-items-center search-form" onSubmit={submit}>
                <div className="search-input-group">
                  <FaSearch className="search-icon" />
                  <input
                    className="form-control rounded-pill"
                    type="search"
                    placeholder="Search books..."
                    aria-label="Search books"
                    value={query}
                    onFocus={() => {
                      setShowSuggestions(true);
                      setShowSaved(false);    // ✅ leave Saved when typing
                    }}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setShowSuggestions(true);
                      setShowSaved(false);    // ✅ leave Saved immediately on change
                    }}
                  />
                </div>
                <button className="btn btn-light rounded-pill fw-semibold ms-2" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                      Searching
                    </>
                  ) : (
                    "Search"
                  )}
                </button>
              </form>

              {/* 💡 Live Suggestions */}
              {showSuggestions && liveSuggestions.length > 0 && (
                <ul className="suggestion-list shadow-sm">
                  {liveSuggestions.map((title, idx) => (
                    <li
                      key={idx}
                      className="suggestion-item"
                      onMouseDown={() => handleSuggestionClick(title)}
                    >
                      <FaSearch className="me-2 text-muted" />
                      {title}
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* 🌗 Dark Mode */}
            <li className="nav-item ms-2">
              <button
                onClick={toggleDarkMode}
                className={`theme-toggle-btn ${darkMode ? "dark" : "light"}`}
                aria-label="Toggle Dark Mode"
              >
                <div className="icon-wrapper">
                  <FaSun className="sun-icon" />
                  <FaMoon className="moon-icon" />
                </div>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
