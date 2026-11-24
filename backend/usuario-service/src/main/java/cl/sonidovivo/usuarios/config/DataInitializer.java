package cl.sonidovivo.usuarios.config;

import cl.sonidovivo.usuarios.model.*;
import cl.sonidovivo.usuarios.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository repository;
    private final PasswordEncoder encoder;

    public DataInitializer(UsuarioRepository repository, PasswordEncoder encoder) {
        this.repository = repository;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) return;

        crear("admin_general", "admin@sonidovivo.cl", "admin123", Rol.ADMIN);
        crear("vendedor_vina", "vendedor1@sonidovivo.cl", "vendedor123", Rol.VENDEDOR);
        crear("cliente_demo", "cliente@gmail.com", "cliente123", Rol.CLIENTE);
    }

    private void crear(String nombre, String correo, String contrasena, Rol rol) {
        Usuario usuario = new Usuario();
        usuario.setNombreUsuario(nombre);
        usuario.setCorreo(correo);
        usuario.setContrasenaHash(encoder.encode(contrasena));
        usuario.setRol(rol);
        usuario.setEstado(EstadoUsuario.ACTIVO);
        repository.save(usuario);
    }
}
