import { useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import type { Product, Role, User } from './types';
import { initialProducts } from './data/Products';
import Header from './components/organisms/Header';
import Login from './pages/Login';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Store from './pages/Store';
import Orders from './pages/Orders';
import Stock from './pages/Stock';
import Users from './pages/Users';
import Button from './components/atoms/Button';
import { initialUsers } from './data/Usuarios';

export default function App() {
  const [session, setSession] = useState<{ role: Role; email: string } | null>(null);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();

  function login(
  email: string,
  password: string
): string | null {
  const usuario = users.find(
    (u) =>
      u.email.toLowerCase() ===
        email.trim().toLowerCase() &&
      u.password === password,
  );

  if (!usuario) {
    return 'Correo o contrase├▒a incorrectos.';
  }

  if (usuario.status !== 'Activo') {
    return 'Esta cuenta est├í inactiva.';
  }

  setSession({
    role: usuario.role,
    email: usuario.email,
  });

  return null;
}

  function logout() {
    setSession(null);
    setCart([]);
  }

  function add(p: Product) {
    if (p.Stock < 1) return;

    setCart((old) => {
      const found = old.find((i) => i.product.Codigo === p.Codigo);

      if (found) {
        if (found.qty >= p.Stock) {
          alert('L├¡mite de stock alcanzado.');
          return old;
        }

        return old.map((i) =>
          i.product.Codigo === p.Codigo ? { ...i, qty: i.qty + 1 } : i,
        );
      }

      return [...old, { product: p, qty: 1 }];
    });
  }

  function restock(code: string) {
    setProducts((old) =>
      old.map((p) => (p.Codigo === code ? { ...p, Stock: p.Stock + 1 } : p)),
    );
  }

  function checkout() {
    if (!cart.length) return;

    const insufficient = cart.some(
      (i) => products.find((p) => p.Codigo === i.product.Codigo)!.Stock < i.qty,
    );

    if (insufficient) {
      alert('El stock cambi├│. Revisa tu carrito.');
      return;
    }

    const code = 'SV-' + Math.floor(1000 + Math.random() * 9000);

    setProducts((old) =>
      old.map((p) => {
        const item = cart.find((i) => i.product.Codigo === p.Codigo);
        return item ? { ...p, Stock: p.Stock - item.qty } : p;
      }),
    );

    setCart([]);
    setCartOpen(false);
    alert(`Pedido confirmado (demo). C├│digo: ${code}`);
  }

  const count = cart.reduce((n, i) => n + i.qty, 0);
  const isLogin = location.pathname === '/login';

  if (!session && !isLogin) return <Navigate to="/login" replace />;
  if (session && isLogin) return <Navigate to="/" replace />;

  const role = session?.role || 'CLIENTE';

  return (
    <>
      {session && (
        <Header
          role={role}
          cartCount={count}
          onCart={() => setCartOpen(true)}
          logout={logout}
        />
      )}

      <Routes>
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalog products={products} onAdd={add} />} />
        <Route path="/tienda" element={<Store />} />
        <Route path="/pedidos" element={<Orders />} />
        <Route
          path="/stock"
          element={
            role === 'ADMIN' || role === 'VENDEDOR' ? (
              <Stock products={products} onRestock={restock} role={role} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/usuarios"
          element={
            role === 'ADMIN' ? (
              <Users
                users={users}
                onToggle={(id) =>
                  setUsers((old) =>
                    old.map((u) =>
                      u.id === id
                        ? { ...u, status: u.status === 'Activo' ? 'Inactivo' : 'Activo' }
                        : u,
                    ),
                  )
                }
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {cartOpen && (
        <div className="modal-backdrop" onClick={() => setCartOpen(false)}>
          <section className="cart-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cart-head">
              <h2>Carrito de compras</h2>
              <button onClick={() => setCartOpen(false)}>Ô£ò</button>
            </div>

            {cart.length === 0 ? (
              <p className="muted empty">Tu carrito est├í vac├¡o.</p>
            ) : (
              cart.map((i) => (
                <div className="cart-line" key={i.product.Codigo}>
                  <span>
                    {i.product.Nombre}
                    <small>
                      {i.qty} ├ù {i.product.Precio.toLocaleString('es-CL')} CLP
                    </small>
                  </span>
                  <b>{(i.qty * i.product.Precio).toLocaleString('es-CL')} CLP</b>
                  <button
                    onClick={() =>
                      setCart((old) =>
                        old.filter((x) => x.product.Codigo !== i.product.Codigo),
                      )
                    }
                  >
                    Quitar
                  </button>
                </div>
              ))
            )}

            <div className="cart-total">
              <span>Total</span>
              <b>
                {cart
                  .reduce((n, i) => n + i.qty * i.product.Precio, 0)
                  .toLocaleString('es-CL')}{' '}
                CLP
              </b>
            </div>

            <Button className="full" disabled={!cart.length} onClick={checkout}>
              Confirmar pedido
            </Button>
          </section>
        </div>
      )}
    </>
  );
}
