import { useEffect, useState } from 'react';
import { PackageCheck, Search } from 'lucide-react';
import Boton from '../components/atoms/Button';
import type { Pedido, Rol } from '../types';
import { pedidosApi } from '../services/api';

interface PropiedadesPedidos {
  rol: Rol;
  usuarioId: number;
}

const estados = ['CONFIRMADO', 'EN_PREPARACION', 'LISTO', 'ENTREGADO', 'CANCELADO'];

export default function Pedidos({ rol, usuarioId }: PropiedadesPedidos) {
  const [pedidos, establecerPedidos] = useState<Pedido[]>([]);
  const [codigo, establecerCodigo] = useState('');
  const [resultado, establecerResultado] = useState<Pedido | null>(null);
  const [mensaje, establecerMensaje] = useState('');
  const [cargando, establecerCargando] = useState(true);

  async function cargar() {
    establecerCargando(true);
    try {
      establecerPedidos(rol === 'CLIENTE' ? await pedidosApi.mios(usuarioId) : await pedidosApi.todos());
      establecerMensaje('');
    } catch (error) {
      establecerMensaje(error instanceof Error ? error.message : 'No se pudieron cargar los pedidos.');
    } finally {
      establecerCargando(false);
    }
  }

  useEffect(() => {
    void cargar();
  }, [rol, usuarioId]);

  async function buscar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const normalizado = codigo.trim().toUpperCase();
    if (!normalizado) return;

    if (rol === 'CLIENTE') {
      const encontrado = pedidos.find((pedido) => pedido.codigoPedido.toUpperCase() === normalizado) ?? null;
      establecerResultado(encontrado);
      establecerMensaje(encontrado ? '' : 'Pedido no encontrado entre tus pedidos.');
      return;
    }

    try {
      establecerResultado(await pedidosApi.buscarPorCodigo(normalizado));
      establecerMensaje('');
    } catch (error) {
      establecerResultado(null);
      establecerMensaje(error instanceof Error ? error.message : 'Pedido no encontrado.');
    }
  }

  async function cambiarEstado(pedido: Pedido, estado: string) {
    try {
      await pedidosApi.actualizarEstado(pedido.id, estado);
      await cargar();
      if (resultado?.id === pedido.id) {
        establecerResultado(await pedidosApi.buscarPorCodigo(pedido.codigoPedido));
      }
    } catch (error) {
      establecerMensaje(error instanceof Error ? error.message : 'No se pudo actualizar el pedido.');
    }
  }

  const listaVisible = resultado ? [resultado] : pedidos;

  return (
    <main className="pagina">
      <section className="encabezado-pagina">
        <span className="etiqueta-superior">MICROSERVICIO DE PEDIDOS</span>
        <h1>{rol === 'CLIENTE' ? 'Mis pedidos' : 'Gestión de pedidos'}</h1>
        <p>
          {rol === 'CLIENTE'
            ? 'Consulta los pedidos guardados en la base de datos.'
            : 'Revisa pedidos y actualiza su estado. Cada cambio genera una notificación al cliente.'}
        </p>
      </section>

      <form className="formulario-seguimiento" onSubmit={buscar}>
        <input
          placeholder="Ej. SV-12AB34CD"
          value={codigo}
          onChange={(evento) => establecerCodigo(evento.target.value)}
        />
        <Boton type="submit"><Search size={17} /> Buscar por código</Boton>
        {resultado && (
          <Boton type="button" className="secundario" onClick={() => establecerResultado(null)}>
            Ver todos
          </Boton>
        )}
      </form>

      {mensaje && <p className="mensaje-inventario" role="status">{mensaje}</p>}
      {cargando && <p className="texto-secundario">Cargando pedidos...</p>}

      {!cargando && listaVisible.length === 0 && (
        <p className="texto-secundario">No hay pedidos registrados.</p>
      )}

      <div className="lista-pedidos">
        {listaVisible.map((pedido) => (
          <article className="resultado-pedido pedido-real" key={pedido.id}>
            <PackageCheck />
            <div className="pedido-contenido">
              <div className="pedido-cabecera">
                <div>
                  <h2>{pedido.codigoPedido}</h2>
                  <small>{new Date(pedido.fechaCreacion).toLocaleString('es-CL')}</small>
                </div>
                <strong>{Number(pedido.total).toLocaleString('es-CL')} CLP</strong>
              </div>

              <p><b>Estado:</b> {pedido.estado.replace(/_/g, ' ')}</p>

              <ul className="detalle-pedido-lista">
                {pedido.detalles.map((detalle) => (
                  <li key={detalle.id}>
                    {detalle.cantidad} × {detalle.productoNombre}
                    <span>{Number(detalle.subtotal).toLocaleString('es-CL')} CLP</span>
                  </li>
                ))}
              </ul>

              {rol !== 'CLIENTE' && (
                <label className="control-estado-pedido">
                  Cambiar estado
                  <select
                    value={pedido.estado}
                    onChange={(evento) => void cambiarEstado(pedido, evento.target.value)}
                  >
                    {estados.map((estado) => (
                      <option key={estado} value={estado}>{estado.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                </label>
              )}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
