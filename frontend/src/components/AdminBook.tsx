import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Book } from './BookList';


function AdminBooks() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    classification: '',
    category: '',
    pageCount: 0,
    price: 0,
  });

  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortOrder, setSortOrder] = useState('asc');
  const [totalCount, setTotalCount] = useState(0);
  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    const params = new URLSearchParams({
      pageNum: String(pageNum),
      pageSize: String(pageSize),
      sortOrder,
    });
    fetch(`http://localhost:5134/api/books?${params}`)
      .then(res => res.json())
      .then(data => {
        setBooks(data.books);
        setTotalCount(data.totalCount);
      });
  }, [pageNum, pageSize, sortOrder]);

  const handleEdit = (book : Book) => {
    setSelectedBook(book);
    setFormData({...book});
  };

  const handleDelete = (bookId : number) => {
        fetch(`http://localhost:5134/api/books/${bookId}` , {
                method: 'DELETE',
            }).then(() => {
                setBooks(prev => prev.filter(b => b.bookId !== bookId));
            });
    } 

    const handleSubmit = () => {
        const params = new URLSearchParams({
          pageNum: String(pageNum),
          pageSize: String(pageSize),
          sortOrder,
        });
        if (selectedBook !== null) {
            fetch(`http://localhost:5134/api/books/${selectedBook.bookId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
            }).then(() => {
            fetch(`http://localhost:5134/api/books?${params}`)
                .then(res => res.json())
                .then(data => { setBooks(data.books); setTotalCount(data.totalCount); });
            setSelectedBook(null);
            });
        } else {
            fetch('http://localhost:5134/api/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
            }).then(res => res.json())
            .then(newBook => setBooks(prev => [...prev, newBook]));
        }
        };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };




  return (
  <div className="container mt-4">

    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2>Admin - Manage Books</h2>
      <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>
        Back to Store
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
            <td className="d-flex gap-2">
              <button
                className="btn btn-sm btn-warning"
                onClick={() => handleEdit(book)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(book.bookId)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* pagination */}
    <div className="d-flex justify-content-between align-items-center mb-4">
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

    {/* add/edit form */}
    <h4>{selectedBook ? 'Edit Book' : 'Add New Book'}</h4>
    <div className="row g-3">
      <div className="col-md-6">
        <input className="form-control" placeholder="Title" name="title"
          value={formData.title} onChange={handleFormChange} />
      </div>
      <div className="col-md-6">
        <input className="form-control" placeholder="Author" name="author"
          value={formData.author} onChange={handleFormChange} />
      </div>
      <div className="col-md-6">
        <input className="form-control" placeholder="Publisher" name="publisher"
          value={formData.publisher} onChange={handleFormChange} />
      </div>
      <div className="col-md-6">
        <input className="form-control" placeholder="ISBN" name="isbn"
          value={formData.isbn} onChange={handleFormChange} />
      </div>
      <div className="col-md-6">
        <input className="form-control" placeholder="Classification" name="classification"
          value={formData.classification} onChange={handleFormChange} />
      </div>
      <div className="col-md-6">
        <input className="form-control" placeholder="Category" name="category"
          value={formData.category} onChange={handleFormChange} />
      </div>
      <div className="col-md-6">
        <input className="form-control" placeholder="Page Count" name="pageCount"
          value={formData.pageCount} onChange={handleFormChange} />
      </div>
      <div className="col-md-6">
        <input className="form-control" placeholder="Price" name="price"
          value={formData.price} onChange={handleFormChange} />
      </div>
      <div className="col-12">
        <button className="btn btn-primary" onClick={handleSubmit}>
          {selectedBook ? 'Update Book' : 'Add Book'}
        </button>
        {selectedBook && (
          <button
            className="btn btn-secondary ms-2"
            onClick={() => setSelectedBook(null)}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  </div>
);

}


export default AdminBooks;