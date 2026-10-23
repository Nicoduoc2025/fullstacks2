import type { User } from '../types';
import Button from '../components/atoms/Button';

interface UsersProps {
  users: User[];
  onToggle: (id: number) => void;
}

export default function Users({ users, onToggle }: UsersProps) {
  return (
    <main className="page">
      <section className="page-heading">
        <span className="eyebrow">SOLO ADMINISTRADOR</span>
        <h1>Gestión de usuarios</h1>
        <p>Revisa las cuentas de ejemplo y cambia su estado.</p>
      </section>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>
                  <span className="role-pill">{u.role}</span>
                </td>
                <td className={u.status === 'Activo' ? 'stock' : 'out'}>
                  {u.status}
                </td>
                <td>
                  <Button className="small secondary" onClick={() => onToggle(u.id)}>
                    {u.status === 'Activo' ? 'Desactivar' : 'Activar'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}