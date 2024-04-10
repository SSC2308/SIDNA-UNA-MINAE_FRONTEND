//const backend = "https://needed-eagle-curious.ngrok-free.app/MINAE/minae";
const backend = "http://sidnaminae.azurewebsites.net/minae";
class App {
    dom;
    modal;
    modal2;
    state;
    Etiqueta;
    Biblioteca;
    Busqueda;
    Admin;
    constructor() {
        this.state = {};
        this.dom = this.render();
        this.renderBodyFiller();
        this.dom.querySelector('#dropdwonUsuario').style.display = 'none';
        const loginButton = this.dom.querySelector('#loginButton');
        loginButton.addEventListener('click', (event) => {
            event.preventDefault();
            const usuario = this.dom.querySelector('#loginTxt').value;
            const spanUsuario = this.dom.querySelector('#usuarioTxt');
            this.dom.querySelector('#dropdwonUsuario').style.display = 'block';
            spanUsuario.textContent = usuario;
            localStorage.setItem('usuario', usuario);

            if (usuario === 'Admin') {
                this.renderMenuItemsAdmin();
                this.adminShow();
            } else {
                this.renderMenuItems();
                this.busquedaShow();
            }

            this.dom.querySelector('#menuItems').style.display = "flex";
            login.style.display = 'none';
            this.dom.querySelector('#loginTxt').value = "";
            this.dom.querySelector('#passwordTxt').value = "";
        });
        const usuario = localStorage.getItem('usuario');
        if (usuario) {
            const spanUsuario = this.dom.querySelector('#usuarioTxt');
            this.dom.querySelector('#dropdwonUsuario').style.display = 'block';
            spanUsuario.textContent = usuario;

            if (usuario === 'Admin') {
                this.renderMenuItemsAdmin();
                this.adminShow();
            } else {
                this.renderMenuItems();
                this.busquedaShow();
            }

        } else {
            const login = this.dom.querySelector('#login');
            login.style.display = 'flex';
        }
        this.dom.querySelector('#cerrarSesion').addEventListener('click', () => {
            const login = this.dom.querySelector('#login');
            this.renderBodyFiller();
            this.dom.querySelector('#menuItems').style.display = "none";
            this.dom.querySelector('#dropdwonUsuario').style.display = 'none';
            login.style.display = 'flex';
            console.log("Se cerró la sesión");

            const usuario = localStorage.getItem('usuario');
            if (usuario === 'Admin') {
                this.Admin.dom.style.display = "none";
            } else {
                this.Busqueda.dom.style.display = "none";
            }
            localStorage.removeItem('usuario');
        });
    }
    render = () => {
        const html = `
            ${this.renderMenu()}
            ${this.renderBody()} 
            ${this.renderFooter()}
            ${this.renderModal()}
            ${this.renderModalCambiarContrasena()}
            ${this.renderModalErrorGenerico()}
            ${this.renderModal2()}
        `;
        var rootContent = document.createElement('div');
        rootContent.id = 'app';
        rootContent.innerHTML = html;
        return rootContent;
    }

    async  login(usuario, contrasena) {
        try {
            const response = await fetch(`${backend}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    'usuario': usuario,
                    'contrasena': contrasena
                })
            });
            if (response.ok) {
                const usuarioAutenticado = await response.json();
                console.log('Usuario autenticado:', usuarioAutenticado);
                return usuarioAutenticado;
            } else {
                const error = await response.text();
                console.log('Error al autenticar:', error);
                throw new Error('Credenciales inválidas');
            }
        } catch (error) {
            console.error('Error al autenticar:', error);
            throw error;
        }
    }

    cerrarSesion(){
        const login = this.dom.querySelector('#login');
        this.renderBodyFiller();
        this.dom.querySelector('#menuItems').style.display = "none";
        this.dom.querySelector('#dropdwonUsuario').style.display = 'none';
        login.style.display = 'flex';

        const usuario = localStorage.getItem('usuario');
        if (usuario === 'Admin') {
            this.Admin.dom.style.display = "none";
        } else {
            this.Busqueda.dom.style.display = "none";
        }
        localStorage.removeItem('usuario');
        localStorage.removeItem('usuarioNomb');
    }

    async  obtenerUsuario(cedula) {
        const url = `${backend}/usuarios`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: cedula
            });
            if (!response.ok) {
                throw new Error('Error en la solicitud al servidor');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al autenticar usuario:', error);
            throw error;
        }
    }


    renderMenu = () => {
        return `
        <header id="menu">
            <a id="logonav" href="#" style="width: 22%"><img src="images/Minae.png"  width="300" height="65" style="margin-right: 200px;"></a>
            <div style="width: 58%">
        <ul class="navbar" id='menuItems'>
        </ul>
        </div>
        <div id="dropdwonUsuario"  class="dropdown">
            <button id="userIcon" class="dropbtn"><i class="fa-solid fa-user" style="color: #ffffff;"></i><span id="usuarioTxt" class="texto-agregar" style="margin-left: 10px;font-weight: bold;">Usuario</span></button>
            <div class="dropdown-content">
                <a href="#" id="cerrarSesion">Cerrar sesión</a>
            </div>
        </div>
         </header>
         `;
    }

    renderBody = () => {
        return `
        <div id="body">  
    <div class="mt-20" style="color: white; display: inline-block; padding-left: 180px" >

     </div>
</div>
       
    `;
    }

    renderFooter = () => {
        return `
         <footer class="footer-dark">
           <div class="container">
                <div class="row">
                    <div class="col-sm-6 col-md-3 item">
                            <a id="logonav" href="#" ><img src="images/Minae.png"  width="320" height="70" style="margin-right: 200px;"></a>
                    </div>
                    <div class="col-sm-6 col-md-3 item">
                        <h3>Contáctenos</h3>
                        <ul>
                            <li>+506 2106-8500</li>
                            <li><a href="#">comunicacion@minae.go.cr</a></li>
                            <li>Horario:
                                Lunes - Viernes:  
                                7:00am - 3:00pm</li>
                        </ul>
                    </div>
                    <div class="col-md-6 item text">
                        <h3>SIDNA</h3>
                        <p>Sistema Recopilatorio de Denuncias y Noticias Ambientales</p>
                    </div>
                     <div class="col item social">
                        <p class="text-center">Copyright @2023 | Designed With by <a href="#">MINAE</a></p>
                        <ul class="social_footer_ul">
                        <li><a href="https://www.facebook.com/minaecr"  target="_blank" rel="noopener noreferrer"><i class="fab fa-facebook-f"></i></a></li>
                        <li><a href="https://twitter.com/CRMinae"  target="_blank" rel="noopener noreferrer"><i class="fab fa-twitter"></i></a></li>
                        <li><a href="https://www.youtube.com/@ministeriodeambienteyenerg1176"  target="_blank" rel="noopener noreferrer"><i class="fab fa-youtube"></i></a></li>
                        <li><a href="https://www.instagram.com/minaecr/"  target="_blank" rel="noopener noreferrer"><i class="fab fa-instagram"></i></a></li>
                        </ul>
                    </div>
            </div>
        </footer>
    `;

    }

    renderModalErrorGenerico = () => {
        return `
        <div id="modalErrorMensaje" class="modal fade">
            <div class="modal-dialog modal-error">
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="icon-box">
                            <i class="fa-solid fa-exclamation"></i>
                        </div>
                        <h4 class="modal-title w-100">¡Ooops!</h4>\t
                    </div>
                    <div class="modal-body">
                        <p id="mensaje" style="font-size: 25px;" class="text-center"></p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-success btn-block" id="dismissButton" data-dismiss="modal">Regresar</button>
                    </div>
                </div>
            </div>
        </div>`;
    }

    hideModalMensaje = async () => {
        this.modalErrorMensaje.hide();
    }


    renderModal = () => {
        return `
    <div id="login" class="containerLogin" style="display: none">
    <div class="screen">
        <div class="screen__content">
            <form class="login">
                <div class="login__field">
                    <i class="login__icon fas fa-user"></i>
                    <input id="loginTxt" type="text" class="login__input" placeholder="ID / Email">
                </div>
                <div class="login__field">
                    <i class="login__icon fas fa-lock"></i>
                    <input id="passwordTxt" type="password" class="login__input" placeholder="Contraseña">
                </div>
                <button id="loginButton" class="button login__submit">
                    <span class="button__text">Iniciar Sesión</span>
                    <i class="button__icon fas fa-chevron-right"></i> 
                </button>                
            </form>
        </div>
        <div class="screen__background">
            <span class="screen__background__shape screen__background__shape4"></span>
            <span class="screen__background__shape screen__background__shape3"></span>        
            <span class="screen__background__shape screen__background__shape2"></span>
            <span class="screen__background__shape screen__background__shape1"></span>
        </div>      
    </div>
</div>
        
    `;
    }
    renderModalCambiarContrasena = () => {
        return `
        <div id="cambiarContrasena" class="containerLogin" style="display: none">
            <div class="screen">
                <div class="screen__content">
                    <form class="login">
                    <span id="errorConfPassword" class="error-message" style="display: none;">Las contraseñas no coinciden</span>
                        <div class="login__field">
                            <i class="login__icon fas fa-lock"></i>
                            <input id="passwordTxt2" type="password" class="login__input" placeholder="Nueva Contraseña">
                        </div>
                        <div class="login__field">
                            <i class="login__icon fas fa-check"></i> 
                            <input id="confpasswordTxt" type="password" class="login__input" placeholder="Confirme Contraseña">
                        </div>
                        <button id="cambiarButton" class="button login__submit">
                            <span class="button__text">Restablecer Contraseña</span>
                            <i class="button__icon fas fa-chevron-right"></i> 
                        </button>                
                    </form>
                </div>
                <div class="screen__background">
                    <span class="screen__background__shape screen__background__shape4"></span>
                    <span class="screen__background__shape screen__background__shape3"></span>        
                    <span class="screen__background__shape screen__background__shape2"></span>
                    <span class="screen__background__shape screen__background__shape1"></span>
                </div>      
            </div>
        </div>
    `;
    }

    renderModal2 = () => {
        return `
        <div id="modal2" class="modal fade" tabindex="-1">
           <div class="modal-dialog">
               <div class="modal-content">
                   <div class="modal-header" >
                       <img class="img-circle" id="img_logo" src="" style="max-width: 50px; max-height: 50px" alt="logo">
                       <span id = "titleee"style='margin-left:4em;font-weight: bold;'>Actualizacion de usuario</span> 
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                   </div>
        
                   <form id="formModal2" >
                       
                       <div class="modal-body">
                      
                       <ul class = "nav nav-tabs" id ="tabs" role ="tablist">
                           
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="tab1-tab" data-bs-toggle="tab" data-bs-target="#tab1" type="button" role="tab" aria-controls="tab1" aria-selected="true">Actualizar Informacion</button>
                            </li>

                       </ul>
                          
                       </div>
                       
                       <div class="modal-body">
           <div class="tab-content mt-2">

                             <div class="modal-body">
                       <div class="input-group mb-3">
                           <span class="input-group-text">Identificación</span>
                           <input type="text" class="form-control" id="identificacionR" name="identificacionR">
                       </div>  
                       <div class="input-group mb-3">
                           <span class="input-group-text">Nombre</span>
                           <input type="text" class="form-control" id="nombreR" name="nombreR">
                       </div>
                        <div class="input-group mb-3">
                           <span class="input-group-text">Telefono</span>
                           <input type="text" class="form-control" id="telefonoR" name="telefonoR">
                       </div>
                       <div class="input-group mb-3">
                              <span class="input-group-text">Correo Electronico</span>
                           <input type="text" class="form-control" id="correoR" name="correoR">
                       </div>  
                       <div class="input-group mb-3">
                              <span class="input-group-text">Numero de Tarjeta</span>
                           <input type="text" class="form-control" id="numTarjetaR" name="numTarjetaR">
                       </div>  
                   </div>
                  
                       <button id="change" type="button" class="btn btn-primary" >Actualizar</button>
       
                    </div>
                          
                   </div>

                        </form>
               </div>
      </div>
                  </div>
        
    `;
    }

    renderBodyFiller = () => {
        var html = `
        <div id='bodyFiller' style='margin-left: 10%; margin-top:100px; width: 80%; text-align: center; font-size: 1.5em'>
  
          <div class="mt-14" style="color: white; display: inline-block; padding-left: 2px" >
               <div class="linea-azul"></div>
               <div class="linea-amarilla"></div>
               <div class="linea-verde"></div>
            </div>
        </div>
    `;
        this.dom.querySelector('#app>#body').replaceChildren();
        this.dom.querySelector('#app>#body').innerHTML = html;
    }

    renderMenuItems = () => {
        var html = '';

        html += `
            <li><a href="#" id="Busqueda" class="activeBq">BUSQUEDA</a></li>
            <li><a href="#" id="Etiquetas">ETIQUETAS</a></li>
            <li><a href="#" id="Biblioteca">BIBLIOTECA</a></li>
    `;

        this.dom.querySelector('#app>#menu #menuItems').replaceChildren();
        this.dom.querySelector('#app>#menu #menuItems').innerHTML = html;

        this.dom.querySelector("#logonav")?.addEventListener('click', e => this.busquedaShow());
        this.dom.querySelector("#app>#menu #menuItems #Biblioteca")?.addEventListener('click', e => this.bibliotecaShow());
        this.dom.querySelector("#app>#menu #menuItems #Etiquetas")?.addEventListener('click', e => this.etiquetaShow());
        this.dom.querySelector("#app>#menu #menuItems #Busqueda")?.addEventListener('click', e => this.busquedaShow());

    }
    renderMenuItemsAdmin = () => {
        var html = '';

        html += `
            <li><a href="#" id="Admin" class="activeAd">PANEL ADMINISTRADOR</a></li>

    `;
        this.dom.querySelector("#logonav")?.addEventListener('click', e => this.adminShow());
        this.dom.querySelector('#app>#menu #menuItems').replaceChildren();
        this.dom.querySelector('#app>#menu #menuItems').innerHTML = html;
        this.dom.querySelector("#app>#menu #menuItems #Admin")?.addEventListener('click', e => this.adminShow());
    }

    adminShow = () => {
        this.Admin = new Admin();
        const menuItems = this.dom.querySelectorAll("#app>#menu #menuItems a");

        menuItems.forEach((menuItem) => {
            if (menuItem.id === "Admin") {
                menuItem.classList.add("active");
            } else {
                menuItem.classList.remove("active");
            }
        });

        this.dom.querySelector('#app>#body').replaceChildren(this.Admin.dom);

    }

    bibliotecaShow = () => {
        this.Biblioteca = new Biblioteca();
        const menuItems = this.dom.querySelectorAll("#app>#menu #menuItems a");

        menuItems.forEach((menuItem) => {
            if (menuItem.id === "Biblioteca") {
                menuItem.classList.add("active");
            } else {
                menuItem.classList.remove("active");
            }
        });

        this.dom.querySelector('#app>#body').replaceChildren(this.Biblioteca.dom);
    }

    busquedaShow = () => {
        this.Busqueda = new Busqueda();
        const menuItems = this.dom.querySelectorAll("#app>#menu #menuItems a");

        menuItems.forEach((menuItem) => {
            if (menuItem.id === "Busqueda") {
                menuItem.classList.add("active");
            } else {
                menuItem.classList.remove("active");
            }
        });

        this.dom.querySelector('#app>#body').replaceChildren(this.Busqueda.dom);
    }

    etiquetaShow = () => {
        this.Etiqueta = new Etiqueta();
        const menuItems = this.dom.querySelectorAll("#app>#menu #menuItems a");

        menuItems.forEach((menuItem) => {
            if (menuItem.id === "Etiquetas") {
                menuItem.classList.add("active");
            } else {
                menuItem.classList.remove("active");
            }
        });

        this.dom.querySelector('#app>#body').replaceChildren(this.Etiqueta.dom);

    }

}
