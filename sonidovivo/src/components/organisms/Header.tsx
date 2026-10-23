import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Guitar, LogOut, ShoppingCart } from 'lucide-react';
import type { Role } from '../../types';

interface HeaderProps {
  role: Role;
  cartCount: number;
  onCart: () => void;
  logout: () => void;
}

export default function Header({ role, cartCount, onCart, logout }: HeaderProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <div className="topbar">
        <span>SONIDO VIVO</span>
        <span>
          Sesión: <b>{role}</b>
        </span>
      </div>

      <header className="navbar">
        <Link to="/" className="brand">
          <Guitar />
          <span>
            SONIDO VIVO
            <small>Viña del Mar</small>
          </span>
        </Link>

        <nav>
          <NavLink to="/">Inicio</NavLink>
          <NavLink to="/catalogo">Catálogo</NavLink>
          <NavLink to="/tienda">Tienda y retiros</NavLink>
          <NavLink to="/pedidos">Mis pedidos</NavLink>
          
          {role !== 'CLIENTE' && (
            <NavLink to="/stock">Control de stock</NavLink>
          )}
          
          {role === 'ADMIN' && (
            <NavLink to="/usuarios">Usuarios</NavLink>
          )}
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            className="cart-button"
            onClick={onCart}
            aria-label="Abrir carrito"
          >
            <ShoppingCart size={19} />
            <span>{cartCount}</span>
          </button>

          <button type="button" className="logout" onClick={handleLogout}>
            <LogOut size={16} />
            Salir
          </button>
        </div>
      </header>
    </>
  );
}