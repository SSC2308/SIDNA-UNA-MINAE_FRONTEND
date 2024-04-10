package resources;

import com.fasterxml.jackson.databind.deser.impl.CreatorCandidate;
import data.Database;
import data.UsuarioDao;
import jakarta.ws.rs.core.Response;
import logic.Usuario;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.sql.SQLException;
import java.util.Base64;
import java.util.List;


@Path("/usuarios")
public class Usuarios {
    private static final String CLAVE_SECRETA = "1SafDOD+iJ7V2wMciWCJGQ==";
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Usuario> getAllUsuarios() {
        try {
            Database db = new Database();
            UsuarioDao usuarioDao = new UsuarioDao(db);
            return usuarioDao.getAllUsuarios();
        } catch (Exception e) {
            throw new InternalServerErrorException(e);
        }
    }

    private String descifrarCedula(String cedulaCifrada) {
        try {
            byte[] cedulaCifradaBytes = Base64.getDecoder().decode(cedulaCifrada);
            byte[] claveBytes = CLAVE_SECRETA.getBytes("UTF-8");

            SecretKeySpec claveSecreta = new SecretKeySpec(claveBytes, "AES");

            Cipher cifrador = Cipher.getInstance("AES");
            cifrador.init(Cipher.DECRYPT_MODE, claveSecreta);

            byte[] cedulaDescifradaBytes = cifrador.doFinal(cedulaCifradaBytes);

            return new String(cedulaDescifradaBytes, "UTF-8");
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private String cifrarCedula(String cedula) {
        try {
            byte[] claveBytes = CLAVE_SECRETA.getBytes("UTF-8");
            SecretKeySpec claveSecreta = new SecretKeySpec(claveBytes, "AES");

            Cipher cifrador = Cipher.getInstance("AES");
            cifrador.init(Cipher.ENCRYPT_MODE, claveSecreta);

            byte[] cedulaCifradaBytes = cifrador.doFinal(cedula.getBytes("UTF-8"));

            return Base64.getEncoder().encodeToString(cedulaCifradaBytes);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUsuarioByCedula(String cedula) {
        try {
            String cedulaDes = descifrarCedula(cedula);
            if (cedulaDes == null) {
                return Response.status(Response.Status.BAD_REQUEST).build();
            }
            Database db = new Database();
            UsuarioDao usuarioDao = new UsuarioDao(db);
            Usuario usuario = usuarioDao.read(cedulaDes);
            if (usuario != null) {
                String cedulaCifrada = cifrarCedula(usuario.getCedula());
                usuario.setCedula(cedulaCifrada);

                if (usuario.getContrasena().equals("MINAE")) {
                    usuario.setContrasena("debeCambiar");
                } else {
                    usuario.setContrasena("");
                }

                return Response.ok(usuario).build();
            } else {
                return Response.status(Response.Status.NOT_FOUND).build();
            }
        } catch (Exception e) {
            throw new InternalServerErrorException(e);
        }
    }

    @DELETE
    @Path("/delete/{id}")
    public Response eliminarUsuario(@PathParam("id") String id) {
        try {
            Database db = new Database();
            UsuarioDao usuarioDao = new UsuarioDao(db);
            usuarioDao.deleteUsuario(id);
            return Response.ok().build();

        } catch (Exception e) {
            throw new InternalServerErrorException(e);
        }
    }

    @POST
    @Path("/crearUsuario")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createUser(Usuario usuario){
        try {
            Database db = new Database();
            UsuarioDao usuarioDao = new UsuarioDao(db);
            usuarioDao.createUsuario(usuario);
            return Response.ok().build();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PUT
    @Path("/restablecerpassword/{id}")
    public Response restablecerContrasena(@PathParam("id") String id){
        try{
            Database db = new Database();
            UsuarioDao usuarioDao = new UsuarioDao(db);
            usuarioDao.modificiarContrasenaUsuario(id);
            return Response.ok().build();

        }catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PUT
    @Path("/editarUsuario")
    public Response editarUsuario(Usuario usuario){
        try{
            Database db = new Database();
            UsuarioDao usuarioDao = new UsuarioDao(db);
            usuarioDao.updateUsuario(usuario);
            return Response.ok().build();
        }catch (Exception e) {
            throw new RuntimeException(e);
        }
    }



}
