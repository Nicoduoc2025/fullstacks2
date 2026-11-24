import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import type { Notificacion, Producto, Sesion, Usuario } from './types';
import Encabezado from './components/organisms/Header';
import InicioSesion from './pages/Login';
import Registro from './pages/Register';
import Inicio from './pages/Home';
import Catalogo from './pages/Catalog';
import Tienda from './pages/Store';
import Pedidos from './pages/Orders';
import Inventario from './pages/Stock';
import Usuarios from './pages/Users';
import DetalleProducto from './pages/ProductDetail';
import Boton from './components/atoms/Button';
import {
  cerrarSesionGuardada,
  notificacionesApi,
  obtenerSesionGuardada,
  pedidosApi,
  productosApi,
  usuariosApi,
} from './services/api';

export default function Aplicacion() {
  const [sesion, establecerSesion] = useState<Sesion | null>(() => obtenerSesionGuardada());
  const [productos, establecerProductos] = useState<Producto[]>([]);
  const [usuarios, establecerUsuarios] = useState<Usuario[]>([]);
  const [carrito, establecerCarrito] = useState<{ producto: Producto; cantidad: number }[]>([]);
  const [carritoAbierto, establecerCarritoAbierto] = useState(false);
  const [notificaciones, establecerNotificaciones] = useState<Notificacion[]>([]);
  const [notificacionesAbiertas, establecerNotificacionesAbiertas] = useState(false);
  const [errorBackend, establecerErrorBackend] = useState('');
  const navegar = useNavigate();

  async function cargarProductos() {
    try {
      establecerProductos(await productosApi.listar());
      establecerErrorBackend('');
    } catch (error) {
      establecerErrorBackend(error instanceof Error ? error.message : 'No se pudieron cargar los productos.');
    }
  }

  async function cargarUsuarios() {
    if (sesion?.rol !== 'ADMIN') return;
    try {
      establecerUsuarios(await usuariosApi.listar());
    } catch {
      establecerUsuarios([]);
    }
  }

  async function cargarNotificaciones() {
    if (!sesion) {
      establecerNotificaciones([]);
      return;
    }

    try {
      establecerNotificaciones(await notificacionesApi.listarPorUsuario(sesion.id));
    } catch {
      establecerNotificaciones([]);
    }
  }

  useEffect(() => {
    void cargarProductos();
  }, []);

  useEffect(() => {
    if (!sesion) return;

    void usuariosApi.validarSesion()
      .then((usuario) => establecerSesion(usuario))
      .catch(() => {
        cerrarSesionGuardada();
        establecerSesion(null);
      });
  }, []);

  useEffect(() => {
    void cargarNotificaciones();
  }, [sesion?.id]);

  useEffect(() => {
    if (sesion?.rol === 'ADMIN') void cargarUsuarios();
    else establecerUsuarios([]);
  }, [sesion?.rol]);

  async function iniciarSesion(correo: string, contrasena: string): Promise<string | null> {
    try {
      const usuario = await usuariosApi.iniciarSesion(correo, contrasena);
      establecerSesion(usuario);
      establecerErrorBackend('');
      return null;
    } catch (error) {
      return error instanceof Error ? error.message : 'No se pudo iniciar sesión.';
    }
  }

  async function registrarCliente(
    nombreUsuario: string,
    correo: string,
    contrasena: string,
  ): Promise<string | null> {
    try {
      const usuario = await usuariosApi.registrarCliente(nombreUsuario, correo, contrasena);
      establecerSesion(usuario);
      establecerErrorBackend('');
      return null;
    } catch (error) {
      return error instanceof Error ? error.message : 'No se pudo completar el registro.';
    }
  }

  function cerrarSesion() {
    cerrarSesionGuardada();
    establecerSesion(null);
    establecerNotificaciones([]);
    establecerNotificacionesAbiertas(false);
  }

  function agregarAlCarrito(producto: Producto) {
    if (producto.Stock < 1) return;

    establecerCarrito((anterior) => {
      const encontrado = anterior.find((elemento) => elemento.producto.Codigo === producto.Codigo);

      if (encontrado) {
        if (encontrado.cantidad >= producto.Stock) {
          alert('Límite de stock alcanzado.');
          return anterior;
        }

        return anterior.map((elemento) =>
          elemento.producto.Codigo === producto.Codigo
            ? { ...elemento, cantidad: elemento.cantidad + 1 }
            : elemento,
        );
      }

      return [...anterior, { producto, cantidad: 1 }];
    });
  }

  function cambiarCantidad(codigo: string, cambio: number) {
    establecerCarrito((anterior) =>
      anterior
        .map((elemento) => {
          if (elemento.producto.Codigo !== codigo) return elemento;
          const nuevaCantidad = elemento.cantidad + cambio;
          const limitada = Math.min(nuevaCantidad, elemento.producto.Stock);
          return { ...elemento, cantidad: limitada };
        })
        .filter((elemento) => elemento.cantidad > 0),
    );
  }

  function quitarDelCarrito(codigo: string) {
    establecerCarrito((anterior) =>
      anterior.filter((elemento) => elemento.producto.Codigo !== codigo),
    );
  }

  async function reabastecer(codigo: string) {
    try {
      await productosApi.reabastecer(codigo, 1);
      await cargarProductos();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'No se pudo reabastecer el producto.');
    }
  }

  async function crearProducto(producto: Producto): Promise<string | null> {
    try {
      await productosApi.crear(producto);
      await cargarProductos();
      return null;
    } catch (error) {
      return error instanceof Error ? error.message : 'No se pudo agregar el producto.';
    }
  }

  async function actualizarProducto(codigo: string, producto: Producto): Promise<string | null> {
    try {
      await productosApi.actualizar(codigo, producto);
      await cargarProductos();
      return null;
    } catch (error) {
      return error instanceof Error ? error.message : 'No se pudo actualizar el producto.';
    }
  }

  async function eliminarProducto(codigo: string): Promise<string | null> {
    try {
      await productosApi.eliminar(codigo);
      quitarDelCarrito(codigo);
      await cargarProductos();
      return null;
    } catch (error) {
      return error instanceof Error ? error.message : 'No se pudo eliminar el producto.';
    }
  }

  async function cambiarEstadoUsuario(id: number) {
    const usuario = usuarios.find((actual) => actual.id === id);
    if (!usuario) return;

    try {
      const nuevoEstado = usuario.estado === 'Activo' ? 'Inactivo' : 'Activo';
      await usuariosApi.cambiarEstado(id, nuevoEstado);
      await cargarUsuarios();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'No se pudo cambiar el estado.');
    }
  }

  async function confirmarPedido() {
    if (!carrito.length) return;

    if (!sesion) {
      establecerCarritoAbierto(false);
      alert('Para confirmar la compra debes registrarte o iniciar sesión.');
      navegar('/registro');
      return;
    }

    try {
      const pedido = await pedidosApi.crear(
        sesion.id,
        carrito.map((elemento) => ({
          productoCodigo: elemento.producto.Codigo,
          cantidad: elemento.cantidad,
        })),
      );

      establecerCarrito([]);
      establecerCarritoAbierto(false);
      await cargarProductos();
      await cargarNotificaciones();
      alert(`Pedido confirmado. Código: ${pedido.codigoPedido}`);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'No se pudo confirmar el pedido.');
      await cargarProductos();
    }
  }

  async function marcarNotificacionLeida(id: number) {
    if (!sesion) return;
    try {
      await notificacionesApi.marcarLeida(id, sesion.id);
      await cargarNotificaciones();
    } catch {
      // La interfaz mantiene la notificación si el servidor no respondió.
    }
  }

  async function marcarTodasLeidas() {
    if (!sesion) return;
    try {
      await notificacionesApi.marcarTodasLeidas(sesion.id);
      await cargarNotificaciones();
    } catch {
      // Sin cambios si falla la API.
    }
  }

  const cantidadCarrito = carrito.reduce((total, elemento) => total + elemento.cantidad, 0);
  const totalCarrito = carrito.reduce(
    (total, elemento) => total + elemento.cantidad * elemento.producto.Precio,
    0,
  );
  const noLeidas = notificaciones.filter((notificacion) => !notificacion.leida).length;
  const rol = sesion?.rol ?? 'CLIENTE';

  return (
    <>
      <Encabezado
        sesion={sesion}
        rol={rol}
        cantidadCarrito={cantidadCarrito}
        notificacionesNoLeidas={noLeidas}
        alAbrirCarrito={() => establecerCarritoAbierto(true)}
        alAbrirNotificaciones={() => establecerNotificacionesAbiertas(true)}
        cerrarSesion={cerrarSesion}
      />

      {errorBackend && (
        <div className="alert alert-danger m-3" role="alert">
          {errorBackend}
        </div>
      )}

      <Routes>
        <Route
          path="/login"
          element={sesion ? <Navigate to="/" replace /> : <InicioSesion alIniciarSesion={iniciarSesion} />}
        />
        <Route
          path="/registro"
          element={sesion ? <Navigate to="/" replace /> : <Registro alRegistrar={registrarCliente} />}
        />
        <Route path="/" element={<Inicio />} />
        <Route path="/catalogo" element={<Catalogo productos={productos} alAgregar={agregarAlCarrito} />} />
        <Route path="/producto/:codigo" element={<DetalleProducto productos={productos} alAgregar={agregarAlCarrito} />} />
        <Route path="/tienda" element={<Tienda />} />
        <Route
          path="/pedidos"
          element={
            sesion ? <Pedidos rol={rol} usuarioId={sesion.id} /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/stock"
          element={
            sesion && (rol === 'ADMIN' || rol === 'VENDEDOR') ? (
              <Inventario
                productos={productos}
                alReabastecer={reabastecer}
                alCrear={crearProducto}
                alActualizar={actualizarProducto}
                alEliminar={eliminarProducto}
                rol={rol}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/usuarios"
          element={
            sesion && rol === 'ADMIN' ? (
              <Usuarios usuarios={usuarios} alCambiarEstado={cambiarEstadoUsuario} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {carritoAbierto && (
        <div className="fondo-modal" onClick={() => establecerCarritoAbierto(false)}>
          <section className="modal-carrito carrito-completo" onClick={(evento) => evento.stopPropagation()}>
            <div className="encabezado-carrito">
              <div>
                <h2>Carrito de compras</h2>
                <small>{cantidadCarrito} producto(s) seleccionado(s)</small>
              </div>
              <button onClick={() => establecerCarritoAbierto(false)} aria-label="Cerrar carrito">✕</button>
            </div>

            {carrito.length === 0 ? (
              <p className="texto-secundario vacio">Tu carrito está vacío.</p>
            ) : (
              <div className="lista-carrito-completa">
                {carrito.map((elemento) => (
                  <article className="producto-carrito" key={elemento.producto.Codigo}>
                    <img
                      src={elemento.producto.Imagen}
                      alt={elemento.producto.Nombre}
                      className="imagen-producto-carrito"
                    />

                    <div className="datos-producto-carrito">
                      <span className="categoria-producto-carrito">{elemento.producto.Categoria}</span>
                      <h3>{elemento.producto.Nombre}</h3>
                      <p>{elemento.producto.Marca} · {elemento.producto.Modelo}</p>
                      <small>Código: {elemento.producto.Codigo}</small>
                      <strong>{elemento.producto.Precio.toLocaleString('es-CL')} CLP c/u</strong>
                    </div>

                    <div className="acciones-producto-carrito">
                      <div className="selector-cantidad" aria-label={`Cantidad de ${elemento.producto.Nombre}`}>
                        <button
                          type="button"
                          onClick={() => cambiarCantidad(elemento.producto.Codigo, -1)}
                          aria-label="Disminuir cantidad"
                        >
                          −
                        </button>
                        <span>{elemento.cantidad}</span>
                        <button
                          type="button"
                          disabled={elemento.cantidad >= elemento.producto.Stock}
                          onClick={() => cambiarCantidad(elemento.producto.Codigo, 1)}
                          aria-label="Aumentar cantidad"
                        >
                          +
                        </button>
                      </div>

                      <b>{(elemento.cantidad * elemento.producto.Precio).toLocaleString('es-CL')} CLP</b>
                      <button
                        type="button"
                        className="quitar-producto"
                        onClick={() => quitarDelCarrito(elemento.producto.Codigo)}
                      >
                        Quitar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="resumen-carrito">
              <span>Total de la compra</span>
              <b>{totalCarrito.toLocaleString('es-CL')} CLP</b>
            </div>

            {!sesion && carrito.length > 0 && (
              <p className="aviso-registro-carrito">
                Puedes revisar tu carrito sin iniciar sesión, pero para confirmar la compra debes registrarte o ingresar con tu cuenta.
              </p>
            )}

            <Boton className="ancho-completo" disabled={!carrito.length} onClick={() => void confirmarPedido()}>
              {sesion ? 'Confirmar pedido' : 'Registrarse para comprar'}
            </Boton>
          </section>
        </div>
      )}

      {sesion && notificacionesAbiertas && (
        <div className="fondo-modal" onClick={() => establecerNotificacionesAbiertas(false)}>
          <section className="modal-notificaciones" onClick={(evento) => evento.stopPropagation()}>
            <div className="encabezado-carrito">
              <div>
                <h2>Notificaciones</h2>
                <small>{noLeidas} sin leer</small>
              </div>
              <button onClick={() => establecerNotificacionesAbiertas(false)}>✕</button>
            </div>

            {notificaciones.length === 0 ? (
              <p className="texto-secundario vacio">No tienes notificaciones.</p>
            ) : (
              <div className="lista-notificaciones">
                {notificaciones.map((notificacion) => (
                  <button
                    type="button"
                    key={notificacion.id}
                    className={`notificacion-item ${notificacion.leida ? 'leida' : ''}`}
                    onClick={() => void marcarNotificacionLeida(notificacion.id)}
                  >
                    <b>{notificacion.titulo}</b>
                    <span>{notificacion.mensaje}</span>
                    <small>{new Date(notificacion.fechaCreacion).toLocaleString('es-CL')}</small>
                  </button>
                ))}
              </div>
            )}

            {noLeidas > 0 && (
              <Boton className="ancho-completo secundario" onClick={() => void marcarTodasLeidas()}>
                Marcar todas como leídas
              </Boton>
            )}
          </section>
        </div>
      )}
    </>
  );
}
