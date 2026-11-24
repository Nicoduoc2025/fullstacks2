package cl.sonidovivo.usuarios;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import cl.sonidovivo.usuarios.dto.*;
import cl.sonidovivo.usuarios.service.UsuarioService;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:usuarios;MODE=MySQL;DB_CLOSE_DELAY=-1",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "eureka.client.register-with-eureka=false",
        "eureka.client.fetch-registry=false",
        "seguridad.jwt.secreto=sonido-vivo-clave-jwt-pruebas-integracion-123456789"
})
class UsuarioIntegrationTest {

    @Autowired
    private UsuarioService usuarioService;

    @Test
    void iniciarSesionAdminDevuelveRolYTokens() {
        RespuestaAutenticacion respuesta = usuarioService.iniciarSesion(
                new SolicitudInicioSesion("admin@sonidovivo.cl", "admin123"));

        assertEquals("ADMIN", respuesta.usuario().rol());
        assertNotNull(respuesta.tokenAcceso());
        assertNotNull(respuesta.tokenRenovacion());
    }

    @Test
    void registroNuevoCreaClienteConTokens() {
        RespuestaAutenticacion respuesta = usuarioService.registrarCliente(
                new SolicitudRegistroCliente("cliente_nuevo", "nuevo@correo.cl", "cliente123"));

        assertEquals("CLIENTE", respuesta.usuario().rol());
        assertEquals("Activo", respuesta.usuario().estado());
        assertNotNull(respuesta.tokenAcceso());
    }

    @Test
    void tokenDeRenovacionGeneraUnaSesionNueva() {
        RespuestaAutenticacion inicio = usuarioService.iniciarSesion(
                new SolicitudInicioSesion("cliente@gmail.com", "cliente123"));

        RespuestaAutenticacion renovada = usuarioService.renovarToken(
                new SolicitudRenovacionToken(inicio.tokenRenovacion()));

        assertEquals(inicio.usuario().id(), renovada.usuario().id());
        assertNotNull(renovada.tokenAcceso());
    }

    @Test
    void datosInicialesIncluyenTresUsuarios() {
        assertTrue(usuarioService.listar().size() >= 3);
    }
}
