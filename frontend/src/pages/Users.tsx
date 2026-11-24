import type { Usuario } from '../types';
import Boton from '../components/atoms/Button';

interface PropiedadesUsuarios {
  usuarios: Usuario[];
  alCambiarEstado: (id: number) => Promise<void>;
}

export default function Usuarios({ usuarios, alCambiarEstado }: PropiedadesUsuarios) {
  return (
    <main className="pagina">
      <section className="encabezado-pagina">
        <span className="etiqueta-superior">SOLO ADMINISTRADOR · MICROSERVICIO DE USUARIOS</span>
        <h1>Gestión de usuarios</h1>
        <p>Las cuentas se consultan y modifican desde el microservicio de usuarios. Esta vista solo se muestra al administrador.</p>
      </section>

      <div className="contenedor-tabla">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Usuario</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.nombreUsuario}</td>
                <td>{usuario.correo}</td>
                <td><span className="etiqueta-rol">{usuario.rol}</span></td>
                <td className={usuario.estado === 'Activo' ? 'estado-disponible' : 'estado-agotado'}>
                  {usuario.estado}
                </td>
                <td>
                  <Boton className="pequeno secundario" onClick={() => void alCambiarEstado(usuario.id)}>
                    {usuario.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                  </Boton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
