import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BookList from './components/BookList';
import Cart from './components/Cart';
import AdminBooks from './components/AdminBook'

// shape of a single cart item — exported so BookList and Cart can use it
export type CartItem = {
  bookId: number;
  title: string;
  price: number;
  quantity: number;
};

function App() {
  // initialize cart from sessionStorage so it survives page navigation
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = sessionStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // keep sessionStorage in sync whenever cart changes
  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (book: { bookId: number; title: string; price: number }) => {
    setCart(prev => {
      const existing = prev.find(item => item.bookId === book.bookId);
      if (existing) {
        // already in cart — just bump the quantity
        return prev.map(item =>
          item.bookId === book.bookId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...book, quantity: 1 }];
    });
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BookList cart={cart} addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
        <Route path="/adminbooks" element={<AdminBooks/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
