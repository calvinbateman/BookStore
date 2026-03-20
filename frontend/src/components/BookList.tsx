import { useEffect, useState } from 'react';

// shape of a book object returned from the API
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

function BookList() {
  // state for the list of books and pagination/sort controls
  const [books, setBooks] = useState<Book[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortOrder, setSortOrder] = useState('asc');
  const [totalCount, setTotalCount] = useState(0);

  // total number of pages based on how many books are in the DB
  const totalPages = Math.ceil(totalCount / pageSize);

  // re-fetch whenever page, page size, or sort order changes
  useEffect(() => {
    fetch(`http://localhost:5134/api/books?pageNum=${pageNum}&pageSize=${pageSize}&sortOrder=${sortOrder}`)
      .then(res => res.json())
      .then(data => {
        setBooks(data.books);
        setTotalCount(data.totalCount);
      });
  }, [pageNum, pageSize, sortOrder]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Bookstore</h2>

      {/* controls for page size and sort order */}
      <div className="d-flex gap-3 mb-3 align-items-center">
        <div>
          <label className="me-2">Results per page:</label>
          {/* reset to page 1 when page size changes so we don't land on a nonexistent page */}
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
            </tr>
          ))}
        </tbody>
      </table>

      {/* pagination controls */}
      <div className="d-flex justify-content-between align-items-center">
        <span>Page {pageNum} of {totalPages}</span>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-primary"
            disabled={pageNum === 1}
            onClick={() => setPageNum(p => p - 1)}
          >Previous</button>
          <button
            className="btn btn-outline-primary"
            disabled={pageNum === totalPages}
            onClick={() => setPageNum(p => p + 1)}
          >Next</button>
        </div>
      </div>
    </div>
  );
}

export default BookList;
