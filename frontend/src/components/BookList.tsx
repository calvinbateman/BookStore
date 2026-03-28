import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { CartItem } from '../App';

type Book = {
  bookId: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  price: number;
};

// the state shape we pass to /cart and receive back from it
type PageState = {
  pageNum: number;
  pageSize: number;
  sortOrder: string;
  selectedCategories: string[];
};

type Props = {
  cart: CartItem[];
  addToCart: (book: { bookId: number; title: string; price: number }) => void;
};

function BookList({ cart, addToCart }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  // if the user hit "Continue Shopping" from the cart, restore their previous position
  const returnState = location.state as PageState | null;

  const [books, setBooks] = useState<Book[]>([]);
  const [pageNum, setPageNum] = useState(returnState?.pageNum ?? 1);
  const [pageSize, setPageSize] = useState(returnState?.pageSize ?? 5);
  const [sortOrder, setSortOrder] = useState(returnState?.sortOrder ?? 'asc');
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    returnState?.selectedCategories ?? []
  );
  const [showToast, setShowToast] = useState(false);
  const [toastTitle, setToastTitle] = useState('');

  const totalPages = Math.ceil(totalCount / pageSize);
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // fetch the list of categories once on mount for the filter sidebar
  useEffect(() => {
    fetch('http://localhost:5134/api/books/categories')
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  // re-fetch books whenever page, size, sort, or category filter changes
  useEffect(() => {
    const params = new URLSearchParams({
      pageNum: String(pageNum),
      pageSize: String(pageSize),
      sortOrder,
    });
    selectedCategories.forEach(c => params.append('categories', c));

    fetch(`http://localhost:5134/api/books?${params}`)
      .then(res => res.json())
      .then(data => {
        setBooks(data.books);
        setTotalCount(data.totalCount);
      });
  }, [pageNum, pageSize, sortOrder, selectedCategories]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
    // reset to page 1 so we don't land on a nonexistent page after filtering
    setPageNum(1);
  };

  const handleAddToCart = (book: Book) => {
    addToCart({ bookId: book.bookId, title: book.title, price: book.price });
    setToastTitle(book.title);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // pass current page state to the cart so "Continue Shopping" can return here
  const goToCart = () => {
    navigate('/cart', { state: { pageNum, pageSize, sortOrder, selectedCategories } });
  };

  return (
    <div className="container mt-4">

      {/* Bootstrap Toast — bottom-right corner, auto-dismisses after 3s */}
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div className={`toast ${showToast ? 'show' : ''}`} role="alert" aria-live="assertive">
          <div className="toast-header">
            <strong className="me-auto">Added to Cart</strong>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowToast(false)}
            />
          </div>
          <div className="toast-body">
            "{toastTitle}" was added to your cart.
          </div>
        </div>
      </div>

      <div className="row">

        {/* category filter sidebar */}
        <div className="col-md-2">
          <h6 className="fw-bold mb-3">Categories</h6>
          {categories.map(cat => (
            <div className="form-check" key={cat}>
              <input
                className="form-check-input"
                type="checkbox"
                id={cat}
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              <label className="form-check-label" htmlFor={cat}>
                {cat}
              </label>
            </div>
          ))}
        </div>

        {/* main content area */}
        <div className="col-md-10">

          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Bookstore</h2>

            {/* cart summary button with Bootstrap Badge showing item count */}
            <button className="btn btn-outline-dark position-relative" onClick={goToCart}>
              Cart
              <span className="badge bg-primary rounded-pill ms-2">
                {totalCartItems}
              </span>
            </button>
          </div>

          {/* page size and sort controls */}
          <div className="d-flex gap-3 mb-3 align-items-center">
            <div>
              <label className="me-2">Results per page:</label>
              <select
                className="form-select d-inline w-auto"
                value={pageSize}
                onChange={e => { setPageSize(Number(e.target.value)); setPageNum(1); }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
            </div>
            <div>
              <label className="me-2">Sort by title:</label>
              <select
                className="form-select d-inline w-auto"
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value)}
              >
                <option value="asc">A → Z</option>
                <option value="desc">Z → A</option>
              </select>
            </div>
          </div>

          {/* book table */}
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Publisher</th>
                <th>ISBN</th>
                <th>Category</th>
                <th>Pages</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.bookId}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.publisher}</td>
                  <td>{book.isbn}</td>
                  <td>{book.category}</td>
                  <td>{book.pageCount}</td>
                  <td>${book.price.toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleAddToCart(book)}
                    >
                      Add to Cart
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* pagination */}
          <div className="d-flex justify-content-between align-items-center">
            <span>Page {pageNum} of {totalPages}</span>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-primary"
                disabled={pageNum === 1}
                onClick={() => setPageNum(p => p - 1)}
              >
                Previous
              </button>
              <button
                className="btn btn-outline-primary"
                disabled={pageNum === totalPages}
                onClick={() => setPageNum(p => p + 1)}
              >
                Next
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default BookList;
