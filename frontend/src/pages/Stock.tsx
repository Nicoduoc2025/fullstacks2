import { useState } from 'react';
import type { Producto, Rol } from '../types';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import Boton from '../components/atoms/Button';

interface PropiedadesInventario {
  productos: Producto[];
  alReabastecer: (codigo: string) => Promise<void>;
  alCrear: (producto: Producto) => Promise<string | null>;
  alActualizar: (codigo: string, producto: Producto) => Promise<string | null>;
  alEliminar: (codigo: string) => Promise<string | null>;
  rol: Rol;
}

const productoVacio: Producto = {
  Codigo: '',
  Categoria: '',
  Nombre: '',
  Marca: '',
  Modelo: '',
  Stock: 0,
  Precio: 0,
  Imagen: '',
  Activo: true,
};

export default function Inventario({
  productos,
  alReabastecer,
  alCrear,
  alActualizar,
  alEliminar,
  rol,
}: PropiedadesInventario) {
  const [formulario, establecerFormulario] = useState<Producto>(productoVacio);
  const [codigoEditando, establecerCodigoEditando] = useState<string | null>(null);
  const [mensaje, establecerMensaje] = useState('');
  const [procesando, establecerProcesando] = useState(false);

  function cambiar<K extends keyof Producto>(campo: K, valor: Producto[K]) {
    establecerFormulario((actual) => ({ ...actual, [campo]: valor }));
  }

  function limpiarFormulario() {
    establecerFormulario(productoVacio);
    establecerCodigoEditando(null);
  }

  async function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    establecerMensaje('');
    establecerProcesando(true);

    const productoNormalizado: Producto = {
      ...formulario,
      Codigo: formulario.Codigo.trim().toUpperCase(),
      Categoria: formulario.Categoria.trim(),
      Nombre: formulario.Nombre.trim(),
      Marca: formulario.Marca.trim(),
      Modelo: formulario.Modelo.trim(),
      Imagen: formulario.Imagen.trim(),
      Stock: Number(formulario.Stock),
      Precio: Number(formulario.Precio),
      Activo: formulario.Activo ?? true,
    };

    const error = codigoEditando
      ? await alActualizar(codigoEditando, productoNormalizado)
      : await alCrear(productoNormalizado);

    establecerProcesando(false);

    if (error) {
      establecerMensaje(error);
      return;
    }

    establecerMensaje(codigoEditando ? 'Producto actualizado en la base de datos.' : 'Producto agregado a la base de datos.');
    limpiarFormulario();
  }

  function editar(producto: Producto) {
    establecerCodigoEditando(producto.Codigo);
    establecerFormulario({ ...producto });
    establecerMensaje('');
  }

  async function eliminar(codigo: string) {
    const error = await alEliminar(codigo);
    establecerMensaje(error ?? 'Producto eliminado de la base de datos.');
    if (!error && codigoEditando === codigo) limpiarFormulario();
  }

  return (
    <main className="pagina container py-4">
      <section className="encabezado-pagina">
        <span className="etiqueta-superior">MICROSERVICIO DE PRODUCTOS</span>
        <h1>Control de inventario</h1>
        <p>
          {rol === 'ADMIN'
            ? 'Administrador: puedes crear, revisar, editar, eliminar y reabastecer productos.'
            : 'Vendedor: puedes gestionar y reabastecer el inventario mediante la API REST.'}
        </p>
      </section>

      <form className="formulario-inventario row g-3" onSubmit={enviar}>
        <div className="col-12 col-md-4 col-lg-2">
          <label htmlFor="stock-code">Código</label>
          <input id="stock-code" className="form-control" value={formulario.Codigo} disabled={Boolean(codigoEditando)} onChange={(evento) => cambiar('Codigo', evento.target.value)} required />
        </div>
        <div className="col-12 col-md-8 col-lg-4">
          <label htmlFor="stock-name">Producto</label>
          <input id="stock-name" className="form-control" value={formulario.Nombre} onChange={(evento) => cambiar('Nombre', evento.target.value)} required />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <label htmlFor="stock-brand">Marca</label>
          <input id="stock-brand" className="form-control" value={formulario.Marca} onChange={(evento) => cambiar('Marca', evento.target.value)} required />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <label htmlFor="stock-model">Modelo</label>
          <input id="stock-model" className="form-control" value={formulario.Modelo} onChange={(evento) => cambiar('Modelo', evento.target.value)} required />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <label htmlFor="stock-category">Categoría</label>
          <input id="stock-category" className="form-control" value={formulario.Categoria} onChange={(evento) => cambiar('Categoria', evento.target.value)} required />
        </div>
        <div className="col-6 col-md-3 col-lg-2">
          <label htmlFor="stock-price">Precio</label>
          <input id="stock-price" className="form-control" type="number" min="0" value={formulario.Precio} onChange={(evento) => cambiar('Precio', Number(evento.target.value))} required />
        </div>
        <div className="col-6 col-md-3 col-lg-2">
          <label htmlFor="stock-qty">Stock</label>
          <input id="stock-qty" className="form-control" type="number" min="0" value={formulario.Stock} onChange={(evento) => cambiar('Stock', Number(evento.target.value))} required />
        </div>
        <div className="col-12 col-lg-4">
          <label htmlFor="stock-image">Imagen</label>
          <input id="stock-image" className="form-control" value={formulario.Imagen} onChange={(evento) => cambiar('Imagen', evento.target.value)} placeholder="/img/producto.webp" required />
        </div>
        <div className="col-12 d-flex flex-wrap gap-2">
          <Boton type="submit" disabled={procesando}>{codigoEditando ? 'Guardar cambios' : 'Agregar producto'}</Boton>
          {codigoEditando && (
            <Boton type="button" className="secundario" onClick={limpiarFormulario}>Cancelar</Boton>
          )}
        </div>
        {mensaje && <p className="col-12 mensaje-inventario" role="status">{mensaje}</p>}
      </form>

      <div className="contenedor-tabla table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Código</th><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Estado</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.Codigo}>
                <td>{producto.Codigo}</td>
                <td>{producto.Nombre} <small className="texto-secundario">{producto.Marca}</small></td>
                <td>{producto.Categoria}</td>
                <td>{producto.Precio.toLocaleString('es-CL')} CLP</td>
                <td>{producto.Stock}</td>
                <td><span className={producto.Stock ? 'estado-disponible' : 'estado-agotado'}>{producto.Stock ? 'Disponible' : 'Agotado'}</span></td>
                <td>
                  <div className="d-flex flex-wrap gap-2">
                    <Boton className="pequeno" onClick={() => void alReabastecer(producto.Codigo)}><Plus size={15} /> +1</Boton>
                    <Boton className="pequeno secundario" onClick={() => editar(producto)}><Pencil size={15} /> Editar</Boton>
                    <Boton className="pequeno secundario" onClick={() => void eliminar(producto.Codigo)}><Trash2 size={15} /> Eliminar</Boton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
