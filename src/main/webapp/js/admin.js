const version = "1.0.8";
class Admin {
    dom;

    modal;

    state;

    constructor() {
        this.state = {'entities': new Array(), 'entity': this.emptyEntity(), 'mode': 'A', usuarios: []};
        this.dom = this.render();
        this.modalEditarUsuario = new bootstrap.Modal(this.dom.querySelector('#modalEditarUsuario'));
        this.modalAgregarUsuario = new bootstrap.Modal(this.dom.querySelector('#modalAgregarUsuario'));
        this.modalConfirmar = new bootstrap.Modal(this.dom.querySelector('#modalConfirmacion'));
        this.modalConfirmarPass = new bootstrap.Modal(this.dom.querySelector('#modalConfirmacionPass'));
        this.modalBorrarUsuario = new bootstrap.Modal(this.dom.querySelector('#modalborrarusuario'));
        this.modalExitoGenerico = new bootstrap.Modal(this.dom.querySelector('#modalExitoGenerico'));
        this.modalErrorGenerico = new bootstrap.Modal(this.dom.querySelector('#modalErrorGenerico'));
        this.dom.querySelector("#admin #modalborrarusuario #confirmarb").addEventListener('click', this.deleteUser.bind(this));
        this.dom.querySelector("#admin #modalAgregarUsuario #guardarUsuarioBtn").addEventListener('click', this.addUser.bind(this));
        this.dom.querySelector("#admin #modalConfirmacionPass #confirmarBtn").addEventListener('click', this.restablecerPassword.bind(this));
        this.dom.querySelector("#admin #modalEditarUsuario #guardarCambiosBtn").addEventListener('click', this.editUser.bind(this));

        const agregarBtn = this.dom.querySelector("#agregarUsuarioBtn");
        const actualizarBtn = this.dom.querySelector("#actualizarBtn");
        agregarBtn.addEventListener('click', () => {
            this.modalAgregarUsuario.show();
        });
        actualizarBtn.addEventListener('click', () => {
            document.getElementById("progress-bar-container").style.display = "block";
            this.actualizar();
        });
        setTimeout(() => {
            this.cargarUsuarios();
        }, 100);

    }

    render = () => {
        const html = `
            ${this.renderBody()}
            ${this.renderModalEditar()}
            ${this.renderModalAgregar()}
            ${this.renderModalConfirmacion()}
            ${this.renderModalConfirmacionPass()}
            ${this.renderModalBorrarUsuario()}
            ${this.renderModalErrorGenerico()}
            ${this.renderModalExitoGenerico()}
        `;
        const rootContent = document.createElement('div');
        rootContent.id = 'admin';
        rootContent.innerHTML = html;
        return rootContent;
    }

    renderBody = () => {
        const body = `
        <div class="linea-azul"></div>
        <div class="linea-amarilla"></div>
        <div class="linea-verde"></div>
        <div class="container" style="margin-top: 40px;">
        <div id="progress-bar-container">
          <div id="progress-bar"></div>
        </div>
        <button class="btn btn-custom-outline-success2 agregarUsuarioBtn" id="agregarUsuarioBtn" style="width: 190px; background-color: #4CAF50 ; color: #ffffff; border-color: #4CAF50; margin-bottom: 50px;">
               <i class="fa-solid fa-plus"></i> <span class="texto-agregar">Agregar Usuario</span>
                </button>
                <button class="btn btn-custom-outline-success4" id="actualizarBtn" style="width: 250px; margin-bottom: 50px; margin-left: 10px">
               <i class="fa-solid fa-download"></i> <span class="texto-agregar">Actualizar Sistema</span>
                </button>
            <table id="usuariosTable" class="table">
                <thead>
                    <tr>
                        <th  style="text-align: center; vertical-align: middle;">Cédula</th>
                        <th  style="text-align: center; vertical-align: middle;">Nombre Completo</th>
                        <th  style="text-align: center; vertical-align: middle;">Email</th>
                        <th  style="text-align: center; vertical-align: middle;">Rol</th>
                        <th  style="text-align: center; vertical-align: middle;">Departamento</th>
                        <th  style="text-align: center; vertical-align: middle;">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                  
                </tbody>
            </table>
            <div class="spinner-border" role="status" style="color: #cdab68;margin-left: 50%;margin-top: 10%;display: none;">
                  <span class="visually-hidden">Loading...</span>
         </div>
        </div>
    `;
        return body;
    }

    async cargarUsuarios() {
        const spinner = document.querySelector('.spinner-border');
        spinner.style.display = 'block';
        try {
            const response = await fetch(`${backend}/usuarios`);
            const data = await response.json();
            this.state.usuarios = data;
            this.renderTable();
        } catch (error) {
            console.log('Error al cargar la lista de usuarios:', error);
        }
    }

    async renderTable() {
        const spinner = document.querySelector('.spinner-border');
        spinner.style.display = 'none';
        const table = document.getElementById('usuariosTable');
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = '';
        this.state.usuarios.forEach((usuario) => {
            const { cedula, nombre, primerApellido, segundoApellido, email, rol,departamento } = usuario;
            const row = document.createElement('tr');
            row.innerHTML = `
            <td style="text-align: center; vertical-align: middle;">${cedula}</td>
            <td style="text-align: center; vertical-align: middle;">${nombre} ${primerApellido} ${segundoApellido}</td>
            <td style="text-align: center; vertical-align: middle;">${email}</td>
            <td style="text-align: center; vertical-align: middle;">${rol.descripcion}</td>
            <td style="text-align: center; vertical-align: middle;">${departamento.nombre}</td>
            <td style="text-align: center; vertical-align: middle;">
                <button class="btn btn-custom-outline-success2 editarUsuarioBtn" id="editarUsuarioBtn" style="width: 90px; color: #ef8929; border-color: #ef8929;">
                    <i class="fas fa-edit"></i> <span class="texto-agregar">Editar</span>
                </button>
                <button class="btn btn-custom-outline-success eliminarUsuarioBtn" id="eliminarUsuarioBtn"  style="width: 110px; color: #D32F2F; border-color: #D32F2F;">
                    <i class="fas fa-trash-alt"></i> <span class="texto-agregar">Eliminar</span>
                </button>
                <button class="btn btn-custom-outline-success restablecerUsuarioBtn" id="restablecerUsuarioBtn" style="width: 200px; color: #2196F3; border-color: #2196F3;">
                    <i class="fas fa-undo"></i> <span class="texto-agregar">Restablecer password</span>
                </button>
            </td>
        `;

            const editarBtn = row.querySelector('.editarUsuarioBtn');
            editarBtn.addEventListener('click', () => {
                this.modalEditarUsuario.show();
                const nombreInput = document.querySelector('#nombreEditar');
                const primerApellidoInput = document.querySelector('#primerApellidoEditar');
                const segundoApellidoInput = document.querySelector('#segundoApellidoEditar');
                const emailInput = document.querySelector('#emailEditar');
                const rolSelect = document.querySelector('#rolEditar');
                const departamentoSelect = document.querySelector('#departamentoEditar');
                const cedulaInput = this.dom.querySelector('#cedulaEditar');
                cedulaInput.value = cedula;
                nombreInput.value = nombre;
                primerApellidoInput.value = primerApellido;
                segundoApellidoInput.value = segundoApellido;
                emailInput.value = email;
                const rolID = rol.id.toString();
                const departamentoID = departamento.id.toString();
                for (let i = 0; i < rolSelect.options.length; i++) {
                    if (rolSelect.options[i].value === rolID) {
                        rolSelect.options[i].selected = true;
                        break;
                    }
                }
                for (let i = 0; i < departamentoSelect.options.length; i++) {
                    if (departamentoSelect.options[i].value === departamentoID) {
                        departamentoSelect.options[i].selected = true;
                        break;
                    }
                }
            });

            const eliminarBtn = row.querySelector('.eliminarUsuarioBtn');
            eliminarBtn.addEventListener('click', () => {
                document.getElementById('modalConfirmarMensaje').innerHTML = `¿Estás seguro de que deseas eliminar a este usuario?<br>${nombre} ${primerApellido} ${segundoApellido}`;
                const usuario = localStorage.getItem('usuarioNomb');
                const nomb = `${nombre}`;
                if(usuario === nomb ){
                    this.showModalErrorGenerico("No puedes eliminar al usuario que está actualmente activo.");
                }else{
                    this.showModalBorrar(cedula);
                }
            });

            const restablecerBtn = row.querySelector('.restablecerUsuarioBtn');
            restablecerBtn.addEventListener('click', () => {
                document.getElementById('modalConfirmarMensajePass').innerHTML = `<span style="font-size: smaller;">¿Estás seguro de que deseas restablecer el password a este usuario?</span><br>${nombre} ${primerApellido} ${segundoApellido}`;
                this.showmodalConfirmarPass(cedula);
            });

            tbody.appendChild(row);

        });
    }

    renderModalEditar() {
        return `
            <div class="modal fade" id="modalEditarUsuario" tabindex="-1" aria-labelledby="modalEditarUsuarioLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title justify-content-center" id="modalEditarUsuarioLabel">Editar Usuario</h5>
                    </div>
                    <div class="modal-body">
                        <form id="formEditarUsuario" autocomplete="em33">
                    <div class="mb-3">
                        <legend id="cedulaEditarLabel" style="font-size: 15px; color:black;font-family: Verdana">Cédula</legend>
                        <input type="text" class="form-control" id="cedulaEditar" disabled>
                    </div>
                    <div class="row mb-3">
                        <div class="col">
                            <legend id="nombreEditarLabel" style="font-size: 15px; color:black;font-family: Verdana">Nombre</legend>
                            <input type="text" class="form-control" id="nombreEditar" autocomplete="em33">
                        </div>
                        <div class="col">
                            <legend id="primerApellidoEditarLabel" style="font-size: 15px; color:black;font-family: Verdana">Primer Apellido</legend>
                            <input type="text" class="form-control" id="primerApellidoEditar" autocomplete="em33">
                        </div>
                        <div class="col">
                            <legend id="segundoApellidoEditarLabel" style="font-size: 15px; color:black;font-family: Verdana">Segundo Apellido</legend>
                            <input type="text" class="form-control" id="segundoApellidoEditar" autocomplete="em33">
                        </div>
                    </div>
                    <div class="mb-3">
                        <legend id="emailEditarLabel" style="font-size: 15px; color:black;font-family: Verdana">Email</legend>
                        <input class="form-control" id="emailEditar" autocomplete="em33">
                    </div>
                    <div class="mb-3">
                        <legend style="font-size: 15px; color:black;font-family: Verdana">Rol</legend>
                        <select class="form-select" id="rolEditar">
                            <option value="1">Analista</option>
                            <option value="2">Administrador</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <legend style="font-size: 15px; color:black;font-family: Verdana">Departamento</legend>
                        <select class="form-select" id="departamentoEditar">
                            <option value="1">Departamento de Comunicación</option>
                            <option value="2">Departamento de TI</option>
                        </select>
                    </div>
                </>
            </div>
            <div class="modal-footer justify-content-center">
                <button type="button" class="btn btn-custom-outline-success5" id="guardarCambiosBtn" style="width: 190px; ">Guardar</button>
                <button type="button" class="btn btn-custom-outline-success6" data-bs-dismiss="modal" style="width: 190px;">Cancelar</button>
                    </div>
                </div>
            </div>
            </div>`;
    }


    renderModalAgregar() {
        return `
<div class="modal fade" id="modalAgregarUsuario" tabindex="-1" aria-labelledby="modalAgregarUsuarioLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title justify-content-center" id="modalAgregarUsuarioLabel">Agregar Usuario</h5>
            </div>
            <div class="modal-body">
                <form id="formAgregarUsuario">
                    <div class="mb-3">
                    <legend id="cedulaLabel"  style="font-size: 15px; color:black;font-family: Verdana">Cédula</legend>                     
                    <input type="text" class="form-control" id="cedula" name="cedula" autocomplete="off">
                    </div>
                    <div class="row mb-3">
                        <div class="col">
                            <legend id="nombreLabel" style="font-size: 15px; color:black;font-family: Verdana">Nombre</legend>
                            <input type="text" class="form-control" id="nombre" autocomplete="chrome-off">
                        </div>
                        <div class="col">
                            <legend id="primerApellidoLabel" style="font-size: 15px; color:black;font-family: Verdana">Primer Apellido</legend>
                            <input type="text" class="form-control" id="primerApellido" autocomplete="chrome-off">
                        </div>
                        <div class="col">
                            <legend id="segundoApellidoLabel" style="font-size: 15px; color:black;font-family: Verdana">Segundo Apellido</legend>
                            <input type="text" class="form-control" id="segundoApellido" autocomplete="chrome-off">
                        </div>
                    </div>
                    <div class="mb-3">
                        <legend id="correoLabel" style="font-size: 15px; color:black;font-family: Verdana">Email</legend>
                        <input class="form-control" id="correo" autocomplete="off">
                    </div>
                    <div class="mb-3">
                        <legend " style="font-size: 15px; color:black;font-family: Verdana">Rol</legend>
                        <select class="form-select" id="rol">
                            <option value="1">Analista</option>
                            <option value="2">Administrador</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <legend style="font-size: 15px; color:black;font-family: Verdana">Departamento</legend>
                        <select class="form-select" id="departamento">
                            <option value="1">Departamento de Comunicación</option>
                            <option value="2">Departamento de TI</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer justify-content-center">
                <button type="button" class="btn btn-custom-outline-success5" id="guardarUsuarioBtn" style="width: 190px;">Guardar</button>
                <button type="button" class="btn btn-custom-outline-success6" data-bs-dismiss="modal" style="width: 190px;">Cancelar</button>
            </div>
        </div>
    </div>
</div>`;
    }

    renderModalConfirmacion = () => {
        return `
    <div id="modalConfirmacion" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" id="cancelModal" data-bs-dismiss="modal" class="close d-flex align-items-center justify-content-center" aria-label="Close" style="font-size: 36px; width: 50px; height: 50px; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5); border: 2px solid #ccc; border-radius: 50%;">
                        <span aria-hidden="true" class="ion-ios-close"></span>
                    </button>
                </div>
                <div class="modal-body p-2 py-3 p-md-5">
                    <div class="text-center">
                        <img src="images/Minae.png" class="w-50 mx-auto d-block mb-4" alt="...">
                    </div>
                    <h4 id="modalConfirmarMensaje1" class="text-center mb-2 mt-2"> </h4>
                    <ul class="ftco-footer-social p-0 text-center">
                    </ul>
                     
                    <div class="modal-footer justify-content-center">
                    <button type="button" class="btn btn-custom-outline-success5" id="confirmarPassBtn" style="width: 110px; ">Aceptar</button>
                    <button type="button" class="btn btn-custom-outline-success6" data-bs-dismiss="modal" style="width: 110px; ">Cancelar</button>
                </div>
                </div>
            </div>
        </div>
    </div>
`;
    }

    renderModalConfirmacionPass = () => {
        return `
        <div id="modalConfirmacionPass" class="modal fade" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" id="cancelModal" data-bs-dismiss="modal" class="close d-flex align-items-center justify-content-center" aria-label="Close" style="font-size: 36px; width: 50px; height: 50px; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5); border: 2px solid #ccc; border-radius: 50%;">
                            <span aria-hidden="true" class="ion-ios-close"></span>
                        </button>
                    </div>
                    <div class="modal-body p-4 py-5 p-md-5">
                        <div class="text-center">
                            <img src="images/Minae.png" class="w-50 mx-auto d-block mb-4" alt="...">
                        </div>
                        <h4 id="modalConfirmarMensajePass" class="text-center mb-2 mt-2"> </h4>
                        <ul class="ftco-footer-social p-0 text-center">
                        </ul>
                        <div class="btn-group mt-4 d-flex justify-content-center">
                                <button type="submit" id="confirmarBtn" class="btn btn-outline-primary rounded submit ml-4 mr-3 c-btn">Confirmar</button>
                                <button type="button"  data-bs-dismiss="modal" class="btn btn-outline-secondary rounded submit">Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    }

    //Luis
    renderModalBorrarUsuario = () => {
        return `
        <div id="modalborrarusuario" class="modal fade" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" id="cancelModal" data-bs-dismiss="modal" class="close d-flex align-items-center justify-content-center" aria-label="Close" style="font-size: 36px; width: 50px; height: 50px; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5); border: 2px solid #ccc; border-radius: 50%;">
                            <span aria-hidden="true" class="ion-ios-close"></span>
                        </button>
                    </div>
                    <div class="modal-body p-4 py-5 p-md-5">
                        <div class="text-center">
                            <img src="images/Minae.png" class="w-50 mx-auto d-block mb-4" alt="...">
                        </div>
                        <h4 class="text-center mb-2 mt-2" id="modalConfirmarMensaje">¿Estás seguro de que deseas eliminar este usuario del sistema? </h4>
                        <ul class="ftco-footer-social p-0 text-center">
                        </ul>
                         
                        <form action="#" id="formmarcar" class="signup-form">
                            <div class="btn-group mt-4 d-flex justify-content-center">
                                <button type="submit" id="confirmarb" class="btn btn-outline-primary rounded submit ml-4 mr-3 c-btn">Confirmar</button>
                                <button type="button" id="cancelarb" data-bs-dismiss="modal" class="btn btn-outline-secondary rounded submit">Cancelar</button>
                            </div>
                            <div class="form-group d-md-flex">
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    }

    showModalBorrar = (cedula) => {
        event.preventDefault();
        this.deleteEntity = " ";
        this.deleteEntity = cedula;
        this.modalBorrarUsuario.show();
    }

    showModalErrorGenerico = (mensaje) => {
        var mensajeElement = document.getElementById("mensaje");
        mensajeElement.textContent = mensaje;
        this.modalErrorGenerico.show();
    }

    showModalExitoGenerico = (mensage) => {
        var mensajeElemento = document.getElementById("mensajes");
        mensajeElemento.textContent = mensage;
        this.modalExitoGenerico.show();
    }

    showmodalConfirmarPass = (cedula) =>{
        event.preventDefault();
        this.deleteEntity = " ";
        this.deleteEntity = cedula;
        this.modalConfirmarPass.show();
    }

    //Modal Generico Error
    renderModalErrorGenerico = () => {
        return `
        <div id="modalErrorGenerico" class="modal fade">
            <div class="modal-dialog modal-error">
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="icon-box">
                            <i class="material-icons">warning</i>
                        </div>
                        <h4 class="modal-title w-100">¡Ooops!</h4>\t
                    </div>
                    <div class="modal-body">
                        <p id="mensaje" style="font-size: 25px;" class="text-center"></p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-success btn-block" data-bs-dismiss="modal" id="dismissButton" data-dismiss="modal">Regresar</button>
                    </div>
                </div>
            </div>
        </div>`;
    }

    //modalGenericoExito
    renderModalExitoGenerico= () => {
        return `
        <div id="modalExitoGenerico" class="modal fade">
          <div class="modal-dialog modal-confirm">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="icon-box">
                        <i class="material-icons">&#xE876;</i>
                    </div>
                    <h4 class="modal-title w-100">¡Confirmado!</h4>\t
                </div>
                <div class="modal-body">
                    <p id="mensajes" style="font-size: 25px;" class="text-center"></p>
                </div>
                <div class="modal-footer">
            <button class="btn btn-success btn-block" data-bs-dismiss="modal" id="sucessbuton" data-dismiss="modal">OK</button>
                </div>
            </div>
            </div>
        </div>   
        `;
    }




    //BACKEND
    deleteUser = async () => {
        event.preventDefault();
        const entityId = this.deleteEntity;
        const request = new Request(`${backend}/usuarios/delete/${entityId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        try {
            const response = await fetch(request);
            if (response.ok) {
                this.modalBorrarUsuario.hide();
                this.cargarUsuarios();
                this.showModalExitoGenerico("Se ha eliminado al usuario exitosamente.");

            } else {
                this.showModalErrorGenerico("No se pudo eliminar el usuario");
            }
        } catch (error) {
            console.error("Error al eliminar la entidad:", error);
        }
    }

    loadEdit = async () =>{
        var cedula = document.getElementById('cedulaEditar').value;
        var nombre = document.getElementById('nombreEditar').value;
        var primerApellido = document.getElementById('primerApellidoEditar').value;
        var segundoApellido = document.getElementById('segundoApellidoEditar').value;
        var correo = document.getElementById('emailEditar').value;
        var rol = document.getElementById('rolEditar').value;
        var departamento = document.getElementById('departamentoEditar').value;

        var usuario = {
            cedula: cedula,
            nombre: nombre,
            primerApellido: primerApellido,
            segundoApellido: segundoApellido,
            email: correo,
            contrasena: "asd",
            rol: {
                id: rol,
                descripcion: 'Rol' // Puedes dejarlo vacío o asignarle un valor si lo tienes disponible
            },
            departamento: {
                id: departamento,
                nombre: 'Departamento' // Puedes dejarlo vacío o asignarle un valor si lo tienes disponible
            }
        };

        this.entity = usuario;
        console.log(this.entity);
    }

    load = async () => {
        var cedula = document.getElementById('cedula').value;
        var nombre = document.getElementById('nombre').value;
        var primerApellido = document.getElementById('primerApellido').value;
        var segundoApellido = document.getElementById('segundoApellido').value;
        var correo = document.getElementById('correo').value;
        var rol = document.getElementById('rol').value;
        var departamento = document.getElementById('departamento').value;

        var usuario = {
            cedula: cedula,
            nombre: nombre,
            primerApellido: primerApellido,
            segundoApellido: segundoApellido,
            email: correo,
            rol: {
                id: rol,
                descripcion: 'Rol'
            },
            departamento: {
                id: departamento,
                nombre: 'Departamento'
            }
        };

        this.entity = usuario;
        console.log(this.entity);
    }

    verificarCamposLlenados = () => {

        const cedula = document.getElementById('cedula').value;
        const nombre = document.getElementById('nombre').value;
        const primerApellido = document.getElementById('primerApellido').value;
        const segundoApellido = document.getElementById('segundoApellido').value;
        const correo = document.getElementById('correo').value;
        const rol = document.getElementById('rol').value;
        const departamento = document.getElementById('departamento').value;
        const cedulaLabel = document.getElementById("cedulaLabel");
        const nombreLabel = document.getElementById("nombreLabel");
        const primerApellidoLabel = document.getElementById("primerApellidoLabel");
        const segundoApellidoLabel = document.getElementById("segundoApellidoLabel");
        const correoLabel = document.getElementById("correoLabel");
        const regexEmail = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z\d\.-]+$/;
        cedulaLabel.style.color = 'black';
        cedulaLabel.style.textDecoration = 'none';
        nombreLabel.style.color = 'black';
        nombreLabel.style.textDecoration = 'none';
        primerApellidoLabel.style.color = 'black';
        primerApellidoLabel.style.textDecoration = 'none';
        segundoApellidoLabel.style.color = 'black';
        segundoApellidoLabel.style.textDecoration = 'none';
        correoLabel.style.color = 'black';
        correoLabel.style.textDecoration = 'none';
        if(cedula.trim() === ''){
            cedulaLabel.style.color = 'red';
            cedulaLabel.style.textDecoration = 'underline';
            cedulaLabel.title = 'Debes ingresar una cedula valida';
        }
        if(nombre.trim() === ''){
            nombreLabel.style.color = 'red';
            nombreLabel.style.textDecoration = 'underline';
            nombreLabel.title = 'Debes ingresar una nombre valido';
        }
        if(primerApellido.trim() === ''){
            primerApellidoLabel.style.color = 'red';
            primerApellidoLabel.style.textDecoration = 'underline';
            primerApellidoLabel.title = 'Debes ingresar un apellido valido';
        }
        if(segundoApellido.trim() === ''){
            segundoApellidoLabel.style.color = 'red';
            segundoApellidoLabel.style.textDecoration = 'underline';
            segundoApellidoLabel.title = 'Debes ingresar un apellido valido';
        }
        if(!regexEmail.test(correo)){
            correoLabel.style.color = 'red';
            correoLabel.style.textDecoration = 'underline';
            correoLabel.title = 'Ingresa un correo electrónico válido (por ejemplo, ejemplo@dominio.com)';
        }

        if(
            nombre.trim() === '' ||
            cedula.trim() === '' ||
            primerApellido.trim() === '' ||
            segundoApellido.trim() === '' ||
            !regexEmail.test(correo)
        ) {
            return false;
        }
        return true;
    }

    verificarCamposLlenados2 = () => {

        const cedulaEditar = document.getElementById('cedulaEditar').value;
        const nombreEditar = document.getElementById('nombreEditar').value;
        const primerApellidoEditar = document.getElementById('primerApellidoEditar').value;
        const segundoApellidoEditar = document.getElementById('segundoApellidoEditar').value;
        const correoEditar = document.getElementById('emailEditar').value;
        const rolEditar = document.getElementById('rolEditar').value;
        const departamentoEditar = document.getElementById('departamentoEditar').value;
        const cedulaLabelEditar = document.getElementById("cedulaEditarLabel");
        const nombreLabelEditar = document.getElementById("nombreEditarLabel");
        const primerApellidoLabelEditar = document.getElementById("primerApellidoEditarLabel");
        const segundoApellidoLabelEditar = document.getElementById("segundoApellidoEditarLabel");
        const correoLabelEditar = document.getElementById("emailEditarLabel");
        const regexEmail = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z\d\.-]+$/;
        cedulaLabelEditar.style.color = 'black';
        cedulaLabelEditar.style.textDecoration = 'none';
        nombreLabelEditar.style.color = 'black';
        nombreLabelEditar.style.textDecoration = 'none';
        primerApellidoLabelEditar.style.color = 'black';
        primerApellidoLabelEditar.style.textDecoration = 'none';
        segundoApellidoLabelEditar.style.color = 'black';
        segundoApellidoLabelEditar.style.textDecoration = 'none';
        correoLabelEditar.style.color = 'black';
        correoLabelEditar.style.textDecoration = 'none';
        if(cedulaEditar.trim() === ''){
            cedulaLabelEditar.style.color = 'red';
            cedulaLabelEditar.style.textDecoration = 'underline';
            cedulaLabelEditar.title = 'Debes ingresar una cedula valida';
        }
        if(nombreEditar.trim() === ''){
            nombreLabelEditar.style.color = 'red';
            nombreLabelEditar.style.textDecoration = 'underline';
            nombreLabelEditar.title = 'Debes ingresar una nombre valido';
        }
        if(primerApellidoEditar.trim() === ''){
            primerApellidoLabelEditar.style.color = 'red';
            primerApellidoLabelEditar.style.textDecoration = 'underline';
            primerApellidoLabelEditar.title = 'Debes ingresar un apellido valido';
        }
        if(segundoApellidoEditar.trim() === ''){
            segundoApellidoLabelEditar.style.color = 'red';
            segundoApellidoLabelEditar.style.textDecoration = 'underline';
            segundoApellidoLabelEditar.title = 'Debes ingresar un apellido valido';
        }
        if(!regexEmail.test(correo)){
            correoLabelEditar.style.color = 'red';
            correoLabelEditar.style.textDecoration = 'underline';
            correoLabelEditar.title = 'Ingresa un correo electrónico válido (por ejemplo, ejemplo@dominio.com)';
        }

        if(
            nombreEditar.trim() === '' ||
            cedulaEditar.trim() === '' ||
            primerApellidoEditar.trim() === '' ||
            segundoApellidoEditar.trim() === '' ||
            !regexEmail.test(correoEditar)
        ) {
            return false;
        }
        return true;

    }

    editUser = async () =>{
        event.preventDefault();
        await this.loadEdit();

        const request = new Request(`${backend}/usuarios/editarUsuario`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.entity)
        });

        if(this.verificarCamposLlenados2()){
            try {
                const response = await fetch(request);
                if (response.ok) {
                    this.modalEditarUsuario.hide();
                    this.showModalExitoGenerico("Usuario modificado con exito");
                    this.cargarUsuarios();
                    this.limpiarModalEditar();
                } else {
                    this.modalEditarUsuario.hide();
                    this.showModalErrorGenerico("No se ha podido modificar el usuario");
                    this.limpiarModalEditar();
                }
            }
            catch (error) {
                console.error("Error al agregar la entidad", error);
            }

        }else{

        }
    }


    limpiarModalAgregar = async () =>{
        document.getElementById('cedula').value ="";
        document.getElementById('nombre').value = "";
        document.getElementById('primerApellido').value = "";
        document.getElementById('segundoApellido').value = "";
        document.getElementById('correo').value = "";
    }


    limpiarModalEditar = async () =>{
        document.getElementById('cedulaEditar').value = "";
        document.getElementById('nombreEditar').value = "";
        document.getElementById('primerApellidoEditar').value ="";
        document.getElementById('segundoApellidoEditar').value = "";
        document.getElementById('emailEditar').value = "";
    }


    addUser = async () => {
        event.preventDefault();
        await this.load();
        const request = new Request(`${backend}/usuarios/crearUsuario`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.entity)
        });
        if(this.verificarCamposLlenados()){
            try {
                const response = await fetch(request);
                if (response.ok) {
                    this.modalAgregarUsuario.hide();
                    this.showModalExitoGenerico("Usuario creado con exito");
                    this.cargarUsuarios();
                    this.limpiarModalAgregar();
                } else {
                    this.modalAgregarUsuario.hide();
                    this.showModalErrorGenerico("No se ha podido crear el usuario");
                    this.limpiarModalAgregar();
                }
            }
            catch (error) {
                console.error("Error al agregar la entidad", error);
            }
        } else{}


    }
    actualizar = async () => {
        document.getElementById("progress-bar").style.width = "0%";
        fetch(`${backend}/git/pull`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al realizar el pull');
                }
                return response.text();
            })
            .then(message => {
                let primerLinea = message.split('\n')[1];
                let versionMensaje = primerLinea.split(' ')[1].trim();
                if (versionMensaje === version) {
                    this.showModalExitoGenerico("Ya tienes la última versión");
                } else {
                    let mensajeSinVersion = message.replace(primerLinea + '\n', '');
                    mensajeSinVersion = mensajeSinVersion.replace(/\.$/gm, '<br>');
                    document.getElementById("mensajes").innerHTML = mensajeSinVersion;
                    document.getElementById('mensajes').style.fontSize = '15px';
                    this.modalExitoGenerico.show();
                }
            })
            .catch(error => {
                console.error('Error:', error);
            })
            .finally(() => {
                document.getElementById("progress-bar").style.width = "100%";
                setTimeout(() => {
                    document.getElementById("progress-bar-container").style.display = "none";
                }, 1000);
            });
    }

    restablecerPassword = async () => {
        event.preventDefault();
        const entityId = this.deleteEntity;

        const request = new Request(`${backend}/usuarios/restablecerpassword/${entityId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        try {
            const response = await fetch(request);
            if (response.ok) {
                this.modalConfirmarPass.hide();
                this.showModalExitoGenerico("La Contraseña ha sido restablecida con exito");
                this.cargarUsuarios();
            } else {
                this.modalConfirmarPass.hide();
                this.showModalErrorGenerico("No se pudo restablecer la contrasena");
            }
        } catch (error) {
            console.error("Error al cambiar la contrasena:", error);
        }
    }

    emptyEntity = () => {
        var entity = '';
        return entity;
    }

}
