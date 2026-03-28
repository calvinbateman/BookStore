import { useNavigate, useLocation } from 'react-router-dom';
import type { CartItem } from '../App';

type Props = {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
};

function Cart({ cart, setCart }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  // the page state BookList passed when navigating here — used to return to the right spot
  const returnState = location.state;

  const updateQuantity = (bookId: number, delta: number) => {
    setCart(prev =>
      prev
        .map(item => item.bookId === bookId ? { ...item, quantity: item.quantity + delta } : item)
        .filter(item => item.quantity > 0) // remove item if quantity reaches 0
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Your Cart</h2>

      {cart.length === 0 ? (
        <p className="text-muted">Your cart is empty.</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {cart.map(item => (
              <tr key={item.bookId}>
                <td>{item.title}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => updateQuantity(item.bookId, -1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => updateQuantity(item.bookId, 1)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="text-end fw-bold">Total:</td>
              <td className="fw-bold">${total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      )}

      {/* returns the user to whichever page they were on when they navigated to the cart */}
      <button
        className="btn btn-primary mt-2"
        onClick={() => navigate('/', { state: returnState })}
      >
        Continue Shopping
      </button>
    </div>
  );
}

export default Cart;
