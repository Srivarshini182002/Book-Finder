
import { FaHeart } from "react-icons/fa";

export default function BookCard({ book, onToggleSave, isSaved }) {
  const imageUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : "https://via.placeholder.com/320x480?text=No+Cover";

  return (
    <div className="col-6 col-md-4 col-lg-3 mb-4" data-aos="zoom-in">
      <div className="card book-card border-0 h-100 shadow-sm position-relative">
        {/* ❤️ Save Icon */}
        <button
          className={`save-btn ${isSaved ? "saved" : ""}`}
          onClick={() => onToggleSave(book)}
          title={isSaved ? "Remove from Saved" : "Save Book"}
        >
          <FaHeart />
        </button>

        <div className="img-wrap">
          <img src={imageUrl} alt={book.title} className="card-img-top" />
        </div>
        <div className="card-body text-center">
          <h6 className="fw-semibold text-truncate" title={book.title}>
            {book.title}
          </h6>
          <p
            className="text-muted small mb-0 text-truncate"
            title={book.author_name?.[0]}
          >
            {book.author_name ? book.author_name[0] : "Unknown Author"}
          </p>
        </div>
      </div>
    </div>
  );
}
