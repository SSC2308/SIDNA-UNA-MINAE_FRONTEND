//const backend = "https://needed-eagle-curious.ngrok-free.app/MINAE/minae";
const backend = "http://localhost:9090/backend";
//const backend = "https://sidnaminae-backend.onrender.com/backend";
//const backend = "https://sidnaminae.azurewebsites.net/backend";
//const backend = "http://localhost:8080/MINAE/minae";
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
        this.modalErrorMensaje = new bootstrap.Modal(this.dom.querySelector('#modalErrorMensaje'));
        this.dom.querySelector('#dropdwonUsuario').style.display = 'none';
        this.initEventListeners();
    }
    render = () => {
        const html = `
            ${this.renderMenu()}
            ${this.renderBody()} 
            ${this.renderFooter()}
            ${this.renderModal()}
            ${this.renderModalCambiarContrasena()}
            ${this.renderModalCambiarContrasena2()}
            ${this.renderModalCambiarContrasena3()}
            ${this.renderModalErrorGenerico()}
            ${this.renderModal2()}
        `;
        var rootContent = document.createElement('div');
        rootContent.id = 'app';
        rootContent.innerHTML = html;
        return rootContent;
    }

    initEventListeners() {
        this.dom.querySelector("#app #modalErrorMensaje #dismissButton").addEventListener('click', this.hideModalMensaje);
        const loginButton = this.dom.querySelector('#loginButton');
        const cambiarPassword = this.dom.querySelector('.social-login__icon');
        const siguientePassword = this.dom.querySelector('#siguienteButton2');
        const confirmarCambio = this.dom.querySelector('#confirmarButton');
        const cancelarCambio = this.dom.querySelector('#cancelarButton');
        const cancelarCambio2 = this.dom.querySelector('#cancelarButton2');
        const cancelarCambio3 = this.dom.querySelector('#cancelarButton3');
        const cambiarButton = this.dom.querySelector('#cambiarButton');
        const loginTxt = this.dom.querySelector('#loginTxt');
        const passwordTxt3 = this.dom.querySelector('#passwordTxt3');
        const passwordTxt2 = this.dom.querySelector('#passwordTxt2');
        const confpasswordTxt2 = this.dom.querySelector('#confpasswordTxt2');
        const errorConfPassword2 = this.dom.querySelector('#errorConfPassword2');
        const lengthRequirement = this.dom.querySelector('#lengthRequirement');
        const uppercaseRequirement = this.dom.querySelector('#uppercaseRequirement');
        const lowercaseRequirement = this.dom.querySelector('#lowercaseRequirement');
        const digitRequirement = this.dom.querySelector('#digitRequirement');
        const specialCharRequirement = this.dom.querySelector('#specialCharRequirement');
        const lengthRequirement2 = this.dom.querySelector('#lengthRequirement2');
        const uppercaseRequirement2 = this.dom.querySelector('#uppercaseRequirement2');
        const lowercaseRequirement2 = this.dom.querySelector('#lowercaseRequirement2');
        const digitRequirement2 = this.dom.querySelector('#digitRequirement2');
        const specialCharRequirement2 = this.dom.querySelector('#specialCharRequirement2');
        let usuarioID;


        cambiarButton.addEventListener('click', (event) => {
            event.preventDefault();
            const confpasswordTxt = this.dom.querySelector('#confpasswordTxt').value;
            const cambiarContrasena = this.dom.querySelector('#cambiarContrasena');
            cambiarContrasena.style.display = 'none';
            this.cambiarPassword(usuarioID, confpasswordTxt);
        });

        cancelarCambio.addEventListener('click', (event) => {
            event.preventDefault();
            const login = this.dom.querySelector('#login');
            login.style.display = 'flex';
            const cambiarContrasena3 = this.dom.querySelector('#cambiarContrasena3');
            cambiarContrasena3.style.display = 'none';
            this.dom.querySelector('#loginTxt').value = '';
            this.dom.querySelector('#passwordTxt').value = '';
        });
        cancelarCambio2.addEventListener('click', (event) => {
            event.preventDefault();
            const cambiarContrasena2 = this.dom.querySelector('#cambiarContrasena2');
            const cambiarContrasena3 = this.dom.querySelector('#cambiarContrasena3');
            cambiarContrasena2.style.display = 'none';
            cambiarContrasena3.style.display = 'flex';
            this.dom.querySelector('#loginTxt').value = '';
            this.dom.querySelector('#passwordTxt').value = '';
        });
        cancelarCambio3.addEventListener('click', (event) => {
            event.preventDefault();
            const login = this.dom.querySelector('#login');
            login.style.display = 'flex';
            const cambiarContrasena = this.dom.querySelector('#cambiarContrasena');
            cambiarContrasena.style.display = 'none';
            this.dom.querySelector('#loginTxt').value = '';
            this.dom.querySelector('#passwordTxt').value = '';
            this.dom.querySelector('#passwordTxt2').value = '';
            this.dom.querySelector('#confpasswordTxt').value = '';
        });

        cambiarPassword.addEventListener('click', (event) => {
            event.preventDefault();
            const login = this.dom.querySelector('#login');
            login.style.display = 'none';
            const cambiarContrasena3 = this.dom.querySelector('#cambiarContrasena3');
            cambiarContrasena3.style.display = 'flex';
        });

        siguientePassword.addEventListener('click', (event) => {
            event.preventDefault();
            const loginTxt2 = this.dom.querySelector('#loginTxt2').value;
            if (!loginTxt2) {
                this.dom.querySelector("#mensaje").textContent = "Debe digitar su identificacion.";
                this.modalErrorMensaje.show();
                return;
            }

            usuarioID = loginTxt2;
            const cambiarContrasena2 = this.dom.querySelector('#cambiarContrasena2');
            const cambiarContrasena3 = this.dom.querySelector('#cambiarContrasena3');
            cambiarContrasena3.style.display = 'none';
            cambiarContrasena2.style.display = 'flex';
        });

        loginTxt.addEventListener('input', () => {
            const input = document.getElementById('loginTxt');
            let cleanedValue = input.value.replace(/[^\dX]/g, '');
            if (cleanedValue.length > 9) {
                cleanedValue = cleanedValue.substr(0, 9);
            }
            let formattedValue = '';
            for (let i = 0; i < cleanedValue.length; i++) {
                if (i === 1 || i === 5) {
                    formattedValue += '-';
                }
                formattedValue += cleanedValue[i];
            }
            input.value = formattedValue;
        });
        confpasswordTxt2.addEventListener('input', () => {
            if (!passwordTxt3.value && !confpasswordTxt2.value) {
                errorConfPassword2.style.display = 'none';
                confirmarCambio.style.display = 'block';
            } else {
                if (passwordTxt3.value === confpasswordTxt2.value) {
                    confirmarCambio.style.display = 'block';
                    errorConfPassword2.style.display = 'none';
                } else {
                    confirmarCambio.style.display = 'none';
                    errorConfPassword2.style.color = 'red';
                    errorConfPassword2.style.fontWeight = 'bold';
                    errorConfPassword2.style.display = 'block';
                }
            }
        });

        passwordTxt2.addEventListener('input', () => {
            const newPassword = passwordTxt2.value;
            const isLengthValid = newPassword.length >= 8;
            const isUppercaseValid = /[A-Z]/.test(newPassword);
            const isLowercaseValid = /[a-z]/.test(newPassword);
            const isDigitValid = /\d/.test(newPassword);
            const isSpecialCharValid = /[!@#$%^&*]/.test(newPassword);

            lengthRequirement2.innerHTML = `8 caracteres ${isLengthValid ? '<i class="fas fa-check" style="color: green;"></i>' : '<i class="fas fa-times" style="color: red;"></i>'}`;
            uppercaseRequirement2.innerHTML = `Letra mayúscula ${isUppercaseValid ? '<i class="fas fa-check" style="color: green;"></i>' : '<i class="fas fa-times" style="color: red;"></i>'}`;
            lowercaseRequirement2.innerHTML = `Letra minúscula ${isLowercaseValid ? '<i class="fas fa-check" style="color: green;"></i>' : '<i class="fas fa-times" style="color: red;"></i>'}`;
            digitRequirement2.innerHTML = `Dígito numérico ${isDigitValid ? '<i class="fas fa-check" style="color: green;"></i>' : '<i class="fas fa-times" style="color: red;"></i>'}`;
            specialCharRequirement2.innerHTML = `Carácter especial ${isSpecialCharValid ? '<i class="fas fa-check" style="color: green;"></i>' : '<i class="fas fa-times" style="color: red;"></i>'}`;

            if (isLengthValid && isUppercaseValid && isLowercaseValid && isDigitValid && isSpecialCharValid) {
                passwordRequirements2.classList.remove('show');
                passwordRequirements2.style.zIndex = '-1';
            } else {
                passwordRequirements2.classList.add('show');
                passwordRequirements2.style.zIndex = '999';
            }
        });

        passwordTxt3.addEventListener('input', () => {
            const newPassword = passwordTxt3.value;
            const isLengthValid = newPassword.length >= 8;
            const isUppercaseValid = /[A-Z]/.test(newPassword);
            const isLowercaseValid = /[a-z]/.test(newPassword);
            const isDigitValid = /\d/.test(newPassword);
            const isSpecialCharValid = /[!@#$%^&*]/.test(newPassword);

            lengthRequirement.innerHTML = `8 caracteres ${isLengthValid ? '<i class="fas fa-check" style="color: green;"></i>' : '<i class="fas fa-times" style="color: red;"></i>'}`;
            uppercaseRequirement.innerHTML = `Letra mayúscula ${isUppercaseValid ? '<i class="fas fa-check" style="color: green;"></i>' : '<i class="fas fa-times" style="color: red;"></i>'}`;
            lowercaseRequirement.innerHTML = `Letra minúscula ${isLowercaseValid ? '<i class="fas fa-check" style="color: green;"></i>' : '<i class="fas fa-times" style="color: red;"></i>'}`;
            digitRequirement.innerHTML = `Dígito numérico ${isDigitValid ? '<i class="fas fa-check" style="color: green;"></i>' : '<i class="fas fa-times" style="color: red;"></i>'}`;
            specialCharRequirement.innerHTML = `Carácter especial ${isSpecialCharValid ? '<i class="fas fa-check" style="color: green;"></i>' : '<i class="fas fa-times" style="color: red;"></i>'}`;

            if (isLengthValid && isUppercaseValid && isLowercaseValid && isDigitValid && isSpecialCharValid) {
                passwordRequirements.classList.remove('show');
                passwordRequirements.style.zIndex = '-1';
            } else {
                passwordRequirements.classList.add('show');
                passwordRequirements.style.zIndex = '999';
            }
        });

        confirmarCambio.addEventListener('click', async (event) => {
            event.preventDefault();
            const cambiarContrasena2 = this.dom.querySelector('#cambiarContrasena2');
            const contrasenaActual = this.dom.querySelector('#passwordActual').value;
            const nuevaConfirmar = this.dom.querySelector('#confpasswordTxt2').value;

            try {
                const usuarioAutenticado = await this.login(usuarioID, contrasenaActual);

                if (usuarioAutenticado) {
                    cambiarContrasena2.style.display = 'none';
                    this.cambiarPassword(usuarioID, nuevaConfirmar);
                } else {
                    this.dom.querySelector("#mensaje").textContent = "Credenciales Inválidas. Error al cambiar la contraseña.";
                    this.modalErrorMensaje.show();
                }
            } catch (error) {
                this.dom.querySelector("#mensaje").textContent = "Credenciales Inválidas. Error al cambiar la contraseña.";
                this.modalErrorMensaje.show();
            }
        });

        loginButton.addEventListener('click', async (event) => {
            event.preventDefault();
            try {
                const usuario = this.dom.querySelector('#loginTxt').value;
                const contrasena = this.dom.querySelector('#passwordTxt').value;

                const usuarioAutenticado = await this.login(usuario, contrasena);

                if (usuarioAutenticado.contrasena === 'debeCambiar') {
                    login.style.display = 'none';
                    usuarioID = usuario;
                    const cambiarContrasena = this.dom.querySelector('#cambiarContrasena');
                    cambiarContrasena.style.display = 'flex';
                    const passwordTxt2 = this.dom.querySelector('#passwordTxt2');
                    const confpasswordTxt = this.dom.querySelector('#confpasswordTxt');
                    const cambiarButton = this.dom.querySelector('#cambiarButton');
                    const errorConfPassword = this.dom.querySelector('#errorConfPassword');

                    confpasswordTxt.addEventListener('input', () => {
                        if (!passwordTxt2.value && !confpasswordTxt.value) {
                            errorConfPassword.style.display = 'none';
                            cambiarButton.style.display = 'flex';
                        } else {
                            if (passwordTxt2.value === confpasswordTxt.value) {
                                cambiarButton.style.display = 'flex';
                                errorConfPassword.style.display = 'none';
                            } else {
                                cambiarButton.style.display = 'none';
                                errorConfPassword.style.color = 'red';
                                errorConfPassword.style.fontWeight = 'bold';
                                errorConfPassword.style.display = 'block';
                            }
                        }
                    });

                } else {

                    const spanUsuario = this.dom.querySelector('#usuarioTxt');
                    this.dom.querySelector('#dropdwonUsuario').style.display = 'block';
                    spanUsuario.textContent = usuarioAutenticado.nombre;
                    localStorage.setItem('usuario', usuarioAutenticado.cedula);
                    localStorage.setItem('usuarioNomb', usuarioAutenticado.nombre);

                    if (usuarioAutenticado.rol.descripcion === 'Administrador') {
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
                }
            } catch (error) {
                console.error('Ocurrió un error:', error);
                this.dom.querySelector("#mensaje").textContent = "Credenciales inválidas.";
                this.modalErrorMensaje.show();
            }
        });

        (async () => {
            const cedulaCifrada = localStorage.getItem('usuario');
            if (cedulaCifrada) {
                try {
                    const usuarioAutenticado = await this.obtenerUsuario(cedulaCifrada);

                    const spanUsuario = this.dom.querySelector('#usuarioTxt');
                    this.dom.querySelector('#dropdwonUsuario').style.display = 'block';
                    spanUsuario.textContent = usuarioAutenticado.nombre;

                    if (usuarioAutenticado.contrasena === 'debeCambiar') {
                        this.cerrarSesion();
                        const login = this.dom.querySelector('#login');
                        login.style.display = 'flex';

                    } else {
                        if (usuarioAutenticado.rol.descripcion === 'Administrador') {
                            this.renderMenuItemsAdmin();
                            this.adminShow();
                        } else {
                            this.renderMenuItems();
                            this.busquedaShow();
                        }
                    }
                } catch (error) {
                    console.error('Error al autenticar usuario:', error);
                    localStorage.removeItem('usuario');
                    localStorage.removeItem('usuarioNomb');
                    const login = this.dom.querySelector('#login');
                    login.style.display = 'flex';
                }
            } else {
                const login = this.dom.querySelector('#login');
                login.style.display = 'flex';
            }
        })();


        this.dom.querySelector('#cerrarSesion').addEventListener('click', () => {
            this.cerrarSesion();
        });
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

    cerrarSesion() {
        const login = this.dom.querySelector('#login');
        this.renderBodyFiller();
        this.dom.querySelector('#menuItems').style.display = "none";
        this.dom.querySelector('#dropdwonUsuario').style.display = 'none';
        login.style.display = 'flex';
        if (this.Admin && this.Admin.dom && this.Admin.dom.style.display !== "none") {
            this.Admin.dom.style.display = "none";
        }
        if (this.Busqueda && this.Busqueda.dom && this.Busqueda.dom.style.display !== "none") {
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

    cambiarPassword = async (idUsuario, nuevaContrasena) => {
        const request = new Request(`${backend}/usuarios/cambiarcontrasena/${idUsuario}/${nuevaContrasena}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        try {
            const response = await fetch(request);
            if (response.ok) {
                login.style.display = 'flex';
                this.dom.querySelector('#loginTxt2').value = '';
                this.dom.querySelector('#loginTxt').value = '';
                this.dom.querySelector('#passwordTxt').value = "";
                this.dom.querySelector('#passwordTxt2').value = "";
                this.dom.querySelector('#passwordActual').value = '';
                this.dom.querySelector('#confpasswordTxt2').value = '';
                this.dom.querySelector('#confpasswordTxt').value = '';
                this.dom.querySelector('#passwordTxt3').value = '';
                const banner = this.dom.querySelector('#successBanner');
                banner.style.display = 'block';
                setTimeout(function() {
                    banner.style.display = 'none';
                }, 2000);
            } else {
                this.dom.querySelector("#mensaje").textContent = "Error al cambiar la contrasena.";
                this.modalErrorMensaje.show();
            }
        } catch (error) {
            this.dom.querySelector("#mensaje").textContent = "Error al cambiar la contrasena.";
            this.modalErrorMensaje.show();
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
    <div id="successBanner" class="banner">Contraseña actualizada con éxito</div>
    <div class="screen">
        <div class="screen__content">
            <form class="login">
                <div class="login__field">
                    <i class="login__icon fas fa-user"></i>
                    <input id="loginTxt" type="text" class="login__input" placeholder="Identificacion">
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
            <div class="social-login">
            <div class="social-icons">
            <a href="#" class="social-login__icon" style="font-size: 12px">Cambiar tu contraseña?</a>
            </div>
            </div>
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
                        <div id="passwordRequirements2">
                        <p>Requisitos de contraseña:</p>
                        <ul>
                            <li id="lengthRequirement2">8 caracteres <i class="fas fa-times" style="color: red;"></i></li>
                            <li id="uppercaseRequirement2">Al menos una letra mayúscula <i class="fas fa-times" style="color: red;"></i></li>
                            <li id="lowercaseRequirement2">Al menos una letra minúscula <i class="fas fa-times" style="color: red;"></i></li>
                            <li id="digitRequirement2">Al menos 1 dígito numérico <i class="fas fa-times" style="color: red;"></i></li>
                            <li id="specialCharRequirement2">Al menos un carácter especial (# % @ & * !) <i class="fas fa-times" style="color: red;"></i></li>
                        </ul>
                    </div>
                        <button id="cambiarButton" class="button login__submit">
                            <span class="button__text">Aceptar</span>
                            <i class="button__icon fas fa-chevron-right"></i> 
                        </button>        
                        <button id="cancelarButton3" class="button login__submit">
                            <i class="button__icon2 fas fa-chevron-left"></i>
                            <span class="button__text2">Cancelar</span>
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

    renderModalCambiarContrasena2 = () => {
        return `
    <div id="cambiarContrasena2" class="containerLogin" style="display: none">
        <div class="screen">
            <div class="screen__content">
                <form class="login">
                    <span id="errorConfPassword2" class="error-message" style="display: none;">Las contraseñas no coinciden</span>
                    <div class="login__field">
                        <i class="login__icon fas fa-lock"></i>
                        <input id="passwordActual" type="password" class="login__input" placeholder="Contraseña Actual">
                    </div>
                    <div class="login__field">
                        <i class="login__icon fas fa-lock"></i>
                        <input id="passwordTxt3" type="password" class="login__input" placeholder="Nueva Contraseña">
                    </div>
                    <div class="login__field">
                        <i class="login__icon fas fa-check" id="lengthIcon"></i>
                        <input id="confpasswordTxt2" type="password" class="login__input" placeholder="Confirme Contraseña">
                    </div>
                    <div id="passwordRequirements">
                        <p>Requisitos de contraseña:</p>
                        <ul>
                            <li id="lengthRequirement">8 caracteres <i class="fas fa-times" style="color: red;"></i></li>
                            <li id="uppercaseRequirement">Al menos una letra mayúscula <i class="fas fa-times" style="color: red;"></i></li>
                            <li id="lowercaseRequirement">Al menos una letra minúscula <i class="fas fa-times" style="color: red;"></i></li>
                            <li id="digitRequirement">Al menos 1 dígito numérico <i class="fas fa-times" style="color: red;"></i></li>
                            <li id="specialCharRequirement">Al menos un carácter especial (# % @ & * !) <i class="fas fa-times" style="color: red;"></i></li>
                        </ul>
                    </div>
                    <button id="confirmarButton" class="button login__submit">
                        <span class="button__text">Cambiar Contraseña</span>
                        <i class="button__icon fas fa-chevron-right"></i>
                    </button>
                    <button id="cancelarButton2" class="button login__submit">
                            <i class="button__icon2 fas fa-chevron-left"></i>
                            <span class="button__text2">Volver</span>
                        </button>         
                </form>
            </div>
            <div class="screen__background">
                <span class="screen__background__shape screen__background__shape4"></span>
                <span class="screen__background__shape screen__background__shape3"></span>
                <span class="screen__background__shape screen__background__shape2"></span>
                <span class="screen__background__shape screen__background__shape5"></span>
            </div>
        </div>
    </div>
    `;
    }

    renderModalCambiarContrasena3 = () => {
        return `
        <div id="cambiarContrasena3" class="containerLogin" style="display: none">
            <div class="screen">
                <div class="screen__content">
                    <form class="login">
                    <span id="errorConfPassword3" class="error-message" style="display: none;">Las contraseñas no coinciden</span>
                        <div class="login__field">
                    <i class="login__icon fas fa-user"></i>
                    <input id="loginTxt2" type="text" class="login__input" placeholder="Identificacion">
                      </div>
                        <button id="siguienteButton2" class="button login__submit">
                            <span class="button__text">Siguiente</span>
                            <i class="button__icon fas fa-chevron-right"></i> 
                        </button>
                        <button id="cancelarButton" class="button login__submit">
                            <i class="button__icon2 fas fa-chevron-left"></i>
                            <span class="button__text2">Cancelar</span>
                        </button>                      
                    </form>
                </div>
                <div class="screen__background">
                    <span class="screen__background__shape screen__background__shape4"></span>
                    <span class="screen__background__shape screen__background__shape3"></span>        
                    <span class="screen__background__shape screen__background__shape2"></span>
                    <span class="screen__background__shape screen__background__shape5"></span>
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
