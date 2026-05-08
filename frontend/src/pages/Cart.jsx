import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(data);
  }, []);

  const removeItem = (index) => {
    let newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);

  if (cart.length === 0)
    return <h3 className="text-center mt-5">Keranjang kosong 🛒</h3>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Keranjang Belanja</h2>

      {cart.map((item, index) => (
        <div key={index} className="card mb-3 p-3 d-flex flex-row align-items-center">
          <img src={"http://localhost:5000" + item.image} width="80" />
          <div className="ms-3 flex-grow-1">
            <h5>{item.name}</h5>
            <p>Rp {item.price}</p>
          </div>
          <button className="btn btn-danger" onClick={() => removeItem(index)}>
            Hapus
          </button>
        </div>
      ))}

      <h4>Total: Rp {totalPrice}</h4>

      <button className="btn btn-success mt-3" onClick={() => navigate("/checkout")}>
        Checkout
      </button>
    </div>
  );
}

export default Cart;