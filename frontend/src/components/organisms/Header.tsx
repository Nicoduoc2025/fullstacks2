import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Bell, Guitar, LogIn, LogOut, ShoppingCart, UserPlus } from 'lucide-react';
import type { Rol, Sesion } from '../../types';

interface PropiedadesEncabezado {
  sesion: Sesion | null;
  rol: Rol;
  cantidadCarrito: number;
  notificacionesNoLeidas: number;
  alAbrirCarrito: () => void;
  alAbrirNotificaciones: () => void;
  cerrarSesion: () => void;
}

export default function Encabezado({
  sesion,
  rol,
  cantidadCarrito,
  notificacionesNoLeidas,
  alAbrirCarrito,
  alAbrirNotificaciones,
  cerrarSesion,
}: PropiedadesEncabezado) {
  const navegar = useNavigate();

  const manejarCierreSesion = () => {
    cerrarSesion();
    navegar('/');
  };

  return (
    <>
      <div className="barra-superior">
        <span>SONIDO VIVO</span>
        <span>
          {sesion ? (
            <>Sesión: <b>{sesion.nombreUsuario}</b> · {rol}</>
          ) : (
            <>Navegando como <b>CLIENTE</b></>
          )}
        </span>
      </div>

      <header className="barra-navegacion d-flex flex-column flex-lg-row">
        <Link to="/" className="marca">
          <Guitar />
          <span>
            SONIDO VIVO
            <small>Viña del Mar</small>
          </span>
        </Link>

        <nav className="d-flex flex-wrap justify-content-center">
          <NavLink to="/">Inicio</NavLink>
          <NavLink to="/catalogo">Catálogo</NavLink>
          <NavLink to="/tienda">Tienda y retiros</NavLink>

          {sesion && <NavLink to="/pedidos">{rol === 'CLIENTE' ? 'Mis pedidos' : 'Pedidos'}</NavLink>}
          {sesion && rol !== 'CLIENTE' && <NavLink to="/stock">Control de stock</NavLink>}
          {sesion && rol === 'ADMIN' && <NavLink to="/usuarios">Usuarios</NavLink>}
        </nav>

        <div className="acciones-navegacion">
          {sesion && (
            <button
              type="button"
              className="boton-carrito"
              onClick={alAbrirNotificaciones}
              aria-label="Abrir notificaciones"
            >
              <Bell size={18} />
              <span>{notificacionesNoLeidas}</span>
            </button>
          )}

          <button
            type="button"
            className="boton-carrito"
            onClick={alAbrirCarrito}
            aria-label="Abrir carrito"
          >
            <ShoppingCart size={19} />
            <span>{cantidadCarrito}</span>
          </button>

          {sesion ? (
            <button type="button" className="cerrar-sesion" onClick={manejarCierreSesion}>
              <LogOut size={16} />
              Cerrar sesión
            </button>
          ) : (
            <>
              <Link className="accion-cuenta" to="/registro">
                <UserPlus size={16} />
                Registrarse
              </Link>
              <Link className="accion-cuenta" to="/login">
                <LogIn size={16} />
                Iniciar sesión
              </Link>
            </>
          )}
        </div>
      </header>
    </>
  );
}
