package cl.sonidovivo.pedidos.client;

import cl.sonidovivo.pedidos.dto.UsuarioInternoResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "usuario-service")
public interface UsuarioClient {
    @GetMapping("/api/usuarios/interno/{id}")
    UsuarioInternoResponse buscarInterno(@PathVariable("id") Long id);
}
