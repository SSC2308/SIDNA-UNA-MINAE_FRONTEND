let exportando = false;
let cambio = false;
var checkboxesMarcados = [];
let startDate = '';
let endDate = '';
class Biblioteca {
    dom;
    modal;
    state;
    deleteEntity;
    modalerror;
    modalCampo;
    modalexito;

    constructor() {
        this.state = {'entities': new Array(), 'entity': this.emptyEntity(), 'mode': 'A', noticias: []};
        this.dom = this.render();
        this.entidad = {};
        exportando = false;
        checkboxesMarcados = [];
        this.deleteEntity = " ";
        const self = this;
        this.modal = new bootstrap.Modal(this.dom.querySelector('#modal'));
        this.modalerror = new bootstrap.Modal(this.dom.querySelector('#modalError'));
        this.modalErrorMensaje = new bootstrap.Modal(this.dom.querySelector('#modalErrorMensaje'));
        this.modalexito = new bootstrap.Modal(this.dom.querySelector('#sucessmodal'));
        this.modalCampo = new bootstrap.Modal(this.dom.querySelector('#modalcampo'));
        this.modalExportar = new bootstrap.Modal(this.dom.querySelector('#modalExportar'));
        this.modalBorrar = new bootstrap.Modal(this.dom.querySelector('#modalborrar'));
        this.modalErrorBorrar = new bootstrap.Modal(this.dom.querySelector('#modalErrorBorrar'))
        this.modalSuccessBorrar = new bootstrap.Modal(this.dom.querySelector('#sucessBorrar'))
        this.dom.querySelector("#biblioteca #agregar").addEventListener('click', this.createNew);
        this.dom.querySelector("#biblioteca #modal #apply").addEventListener('click', this.add);
        this.dom.querySelector("#biblioteca #modal #cancelModal").addEventListener('click', this.hidemodal);
        this.dom.querySelector("#biblioteca #modalErrorMensaje #dismissButton").addEventListener('click', this.hideModalMensaje);
        this.dom.querySelector("#biblioteca #modalError #dismissButton").addEventListener('click', this.hideModalError);
        this.dom.querySelector("#biblioteca #sucessmodal #sucessbuton").addEventListener('click', this.hideModalExito);
        this.dom.querySelector("#biblioteca #modalcampo #dismisscampo").addEventListener('click', this.hideModalCampo);
        this.dom.querySelector("#biblioteca #modalborrar #cancelarb").addEventListener('click', this.hideModalBorrar);
        this.dom.querySelector("#biblioteca #modalborrar #confirmarb").addEventListener('click', this.deleteNoticia);
        this.dom.querySelector("#biblioteca #sucessBorrar #sucessbuton").addEventListener('click', this.hideModalBorrarSuccess)
        this.dom.querySelector("#biblioteca #modalborrar #cancelModal").addEventListener('click', this.hideModalBorrar)
        this.dom.querySelector("#biblioteca #modalExportar #cancelModal").addEventListener('click', this.hideModalExportar)
        this.cargarBiblioteca();
        globalAbortController.abort();
        globalAbortController = new AbortController();
        const enlaceInput = this.dom.querySelector("#biblioteca #modal #enlace");
        enlaceInput.addEventListener('input', () => {
            const url = enlaceInput.value;
            this.solicitarDatos(url);
        });
        const generarBtn = this.dom.querySelector("#generarBtn1");
        const cancelarBtn = this.dom.querySelector("#generarBtn3");
        const marcarBtn = this.dom.querySelector("#marcarTodo");
        const desmarcarBtn = this.dom.querySelector("#desmarcarTodo");
        const limpiar = this.dom.querySelector("#buscar");
        const buscador = this.dom.querySelector("#buscadorEtiqueta");
        const prioridadSelect = this.dom.querySelector("#tiempoSeleccionado2");
        const fechaSelect = this.dom.querySelector("#tiempoSeleccionado3");

        const filtrarNoticias = async () => {
            if (cambio) {
                await this.cargarBiblioteca2();
                cambio = false;
            }
            if (prioridadSelect.value === "" && fechaSelect.value === "" && buscador.value.trim() === "") {
                limpiar.style.display= 'none';
            }
            else {
                limpiar.style.display= 'block';
            }
            const noticias = this.state.noticias;
            let noticiasFiltradas = noticias;

            const opcionFecha = fechaSelect.value;
            const fechaActual = new Date();
            if (opcionFecha) {
                switch (opcionFecha) {
                    case "ultimoDia":

                        const ultimoDia = new Date(fechaActual);
                        ultimoDia.setHours(0, 0, 0, 0);
                        ultimoDia.setDate(ultimoDia.getDate() - 1);

                        noticiasFiltradas = noticiasFiltradas.filter(noticia => {
                            const [dia, mes, ano] = noticia.fecha.split('/');
                            const fechaNoticia = new Date(`${mes}/${dia}/${ano}`);

                            return fechaNoticia >= ultimoDia && fechaNoticia <= fechaActual;
                        });
                        break;
                    case "ultimaSemana":
                        const unaSemanaAtras = new Date(fechaActual);
                        unaSemanaAtras.setDate(unaSemanaAtras.getDate() - 7);
                        noticiasFiltradas = noticiasFiltradas.filter(noticia => {
                            const [dia, mes, ano] = noticia.fecha.split('/');
                            const fechaNoticia = new Date(`${mes}/${dia}/${ano}`);
                            return fechaNoticia >= unaSemanaAtras && fechaNoticia <= fechaActual;
                        });
                        break;
                    case "ultimoMes":
                        const ultimoMes = new Date(fechaActual);
                        ultimoMes.setMonth(ultimoMes.getMonth() - 1);
                        noticiasFiltradas = noticiasFiltradas.filter(noticia => {
                            const [dia, mes, ano] = noticia.fecha.split('/');
                            const fechaNoticia = new Date(`${mes}/${dia}/${ano}`);
                            return fechaNoticia >= ultimoMes && fechaNoticia <= fechaActual;
                        });
                        break;
                    case "customRange":
                        noticiasFiltradas = noticiasFiltradas.filter(noticia => {
                            const [dia, mes, ano] = noticia.fecha.split('/');
                            const fechaNoticia = new Date(`${mes}/${dia}/${ano}`);
                            return fechaNoticia >= new Date(startDate) && fechaNoticia <= new Date(endDate);
                        });
                        break;
                    default:
                        break;
                }
            }

            const opcionPrioridad = prioridadSelect.value;
            if (opcionPrioridad && opcionPrioridad !== "todas") {
                noticiasFiltradas = noticiasFiltradas.filter(noticia => noticia.prioridad === opcionPrioridad);
            }

            const buscadorValue = buscador.value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (buscadorValue !== '') {
                noticiasFiltradas = noticiasFiltradas.filter(noticia =>
                    noticia.etiquetas.some(etiqueta =>
                        etiqueta.descripcion.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(buscadorValue)
                    )
                );
            }

            if (noticiasFiltradas.length === 0) {
                const noticiasBiblioteca = document.getElementById('noticiasBiblioteca');
                noticiasBiblioteca.innerHTML = '<p style="margin-top: 25%; display: flex; justify-content: center; align-items: center; font-weight: bold; font-size: 24px;">No se encontraron noticias con los filtros seleccionados.</p>';
            } else {
                this.state.noticias = noticiasFiltradas;
                this.renderizarNoticias();
                this.state.noticias = noticias;
            }
        };

        prioridadSelect.addEventListener('change', () => {
            const limpiarFiltroOption = prioridadSelect.querySelector('option[value="Limpiar filtro"]');
            if (prioridadSelect.value === "Limpiar filtro") {
                prioridadSelect.selectedIndex = prioridadSelect.querySelector('option[value=""]').index;
                if (limpiarFiltroOption) {
                    limpiarFiltroOption.remove();
                }

            } else {
                if (!limpiarFiltroOption) {
                    const limpiarFiltroPrioridadOption = document.createElement('option');
                    limpiarFiltroPrioridadOption.value = "Limpiar filtro";
                    limpiarFiltroPrioridadOption.textContent = "Limpiar filtro";
                    limpiarFiltroPrioridadOption.style.color = "red";
                    prioridadSelect.insertBefore(limpiarFiltroPrioridadOption, prioridadSelect.options[1]);
                }
            }
            filtrarNoticias();
        });

        fechaSelect.addEventListener('change', () => {
            const limpiarFiltroOption = fechaSelect.querySelector('option[value="Limpiar filtro"]');
            if (fechaSelect.value === "Limpiar filtro") {
                fechaSelect.selectedIndex = fechaSelect.querySelector('option[value=""]').index;
                if (limpiarFiltroOption) {
                    limpiarFiltroOption.remove();
                }
            } else {
                if (!limpiarFiltroOption) {
                    const limpiarFiltroFechaOption = document.createElement('option');
                    limpiarFiltroFechaOption.value = "Limpiar filtro";
                    limpiarFiltroFechaOption.textContent = "Limpiar filtro";
                    limpiarFiltroFechaOption.style.color = "red";
                    fechaSelect.insertBefore(limpiarFiltroFechaOption, fechaSelect.options[1]);
                }
            }

            if (fechaSelect.value === "customRange") {
                initializeDatepicker();
            } else {
                filtrarNoticias();
                $('#tiempoSeleccionado3').data('daterangepicker').remove();
            }
            function initializeDatepicker() {
                $('#tiempoSeleccionado3').daterangepicker({
                    opens: 'left',
                    locale: {
                        format: 'DD-MM-YYYY',
                        applyLabel: 'Aplicar',
                        cancelLabel: 'Cancelar',
                        fromLabel: 'Desde',
                        toLabel: 'Hasta',
                        customRangeLabel: 'Rango Personalizado'
                    },
                    autoUpdateInput: false
                });

                $('#tiempoSeleccionado3').on('apply.daterangepicker', function(ev, picker) {
                    startDate = picker.startDate.format('YYYY-MM-DD');
                    endDate = picker.endDate.format('YYYY-MM-DD');
                   filtrarNoticias();
                    $('#tiempoSeleccionado3').data('daterangepicker').hide();
                });

                $('#tiempoSeleccionado3').on('cancel.daterangepicker', function(ev, picker) {
                    $('#tiempoSeleccionado3').data('daterangepicker').remove();
                });
            }
        });

        buscador.addEventListener('input', () => {
            filtrarNoticias();
        });

        limpiar.addEventListener('click', (event) => {
            prioridadSelect.selectedIndex = prioridadSelect.querySelector('option[value=""]').index;
            const limpiarFiltroOption = prioridadSelect.querySelector('option[value="Limpiar filtro"]');
            if (limpiarFiltroOption) {
                limpiarFiltroOption.remove();
            }
            fechaSelect.selectedIndex = fechaSelect.querySelector('option[value=""]').index;
            const limpiarFiltroOptionFecha = fechaSelect.querySelector('option[value="Limpiar filtro"]');
            if (limpiarFiltroOptionFecha) {
                limpiarFiltroOptionFecha.remove();
            }
            ajustarAnchoSelect(fechaSelect);
        function ajustarAnchoSelect(select) {
            var text = $(select).find('option:selected').text();
            var $aux = $('<select/>').append($('<option/>').text(text));
            $(select).after($aux);
            $(select).width($aux.width());
            $(select).css('margin-right', $aux.css('margin-right'));
            $aux.remove();
        }
            buscador.value = '';
            limpiar.style.display= 'none';
           this.renderizarNoticias();
        });

        marcarBtn.addEventListener('click', (event) => {
            event.preventDefault();
            marcarBtn.style.display = "none";
            desmarcarBtn.style.display = "block";
            const checkboxes = document.querySelectorAll('[id^="noticiaCheckbox-"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = true;
                const idNoticia = parseInt(checkbox.id.split('-')[1]);
                if (!checkboxesMarcados.includes(idNoticia)) {
                    checkboxesMarcados.push(idNoticia);
                }
            });
        });
        desmarcarBtn.addEventListener('click', (event) => {
            event.preventDefault();
            marcarBtn.style.display = "block";
            desmarcarBtn.style.display = "none";
            const checkboxes = document.querySelectorAll('[id^="noticiaCheckbox-"]');
            checkboxes.forEach((checkbox, index) => {
                checkbox.checked = false;
                checkboxesMarcados = [];
            });
        });
        generarBtn.addEventListener('click', (event) => {
            event.preventDefault();
            exportando = true;
            generarBtn.style.display = "none";
            this.dom.querySelector("#marcarTodo").style.display = "block";
            const checkboxes = document.querySelectorAll('.check-container input[type="checkbox"]');
            checkboxes.forEach((checkbox) => {
                checkbox.checked = false;
            });
            const checkContainers = document.querySelectorAll('.check-container');
            checkContainers.forEach((checkContainer) => {
                checkContainer.style.display = 'block';
            });
            generarBtn2.style.display = 'inline';
            generarBtn3.style.display = 'inline';
        });
        cancelarBtn.addEventListener('click', (event) => {
            event.preventDefault();
            exportando = false;
            this.cancelarExportar();
        });
        this.dom.querySelector("#generarBtn2").addEventListener('click', () => {
            event.preventDefault();
            if (checkboxesMarcados.length === 0) {
                this.dom.querySelector("#mensaje").textContent = "Por favor, selecciona al menos una noticia.";
                this.modalErrorMensaje.show();
            } else {
                this.modalExportar.show();
            }
        });
        this.dom.querySelector("#exportarPDF").addEventListener('click', () => {
            this.exportarAPDF(checkboxesMarcados);
            checkboxesMarcados = [];
            exportando = false;
        });
        this.dom.querySelector("#exportarExcel").addEventListener('click', () => {
            this.exportarAXLSX(checkboxesMarcados);
            this.cancelarExportar();
            this.hideModalExportar();
            exportando = false;
            checkboxesMarcados = [];
        });
    }

    async procesarRespuesta(response) {
        if (response.ok) {
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const ogTitle = doc.querySelector('meta[property="og:title"]');
            const title = ogTitle ? ogTitle.getAttribute('content') : '';
            const ogDescription = doc.querySelector('meta[property="og:description"]');
            const description = ogDescription ? ogDescription.getAttribute('content') : '';
            const ogSiteName = doc.querySelector('meta[property="og:site_name"]');
            const fuente = ogSiteName ? ogSiteName.getAttribute('content') : '';
            const titulo = document.getElementById('titulo');
            const descrip = document.getElementById('descripcion');
            const fuent = document.getElementById('fuente');
            const dia = document.getElementById('dia');
            const mes = document.getElementById('mes');
            const anio = document.getElementById('anio');
            const prioridad = document.getElementById('prioridad');
            document.getElementById('titulo').value = title;
            document.getElementById('descripcion').value = description;
            document.getElementById('fuente').value = fuente;
            titulo.removeAttribute('disabled');
            descrip.removeAttribute('disabled');
            fuent.removeAttribute('disabled');
            dia.removeAttribute('disabled');
            mes.removeAttribute('disabled');
            anio.removeAttribute('disabled');
            prioridad.removeAttribute('disabled');
        } else {
            console.error('Error al obtener los datos');
        }
    }

    render = () => {
        const html = `
            ${this.renderBody()}
            ${this.renderModal()}
            ${this.renderModalError()}
            ${this.renderModalExportar()}
            ${this.renderModalErrorGenerico()}
            ${this.renderModalSuccess()}
            ${this.renderModalCampo()}
            ${this.renderModalBorrar()}
            ${this.renderModalErrorBorrar()}
            ${this.renderModalSuccessBorrar()}
        `;
        const rootContent = document.createElement('div');
        rootContent.id = 'biblioteca';
        rootContent.innerHTML = html;
        return rootContent;
    }

    async solicitarDatos(url) {
        const proxyUrl1 = `${backend}/proxy?url=`;
        const proxyUrl2 = 'https://corsproxy.io/?';
        try {
            const response1 = await fetch(proxyUrl2 + url);
            if (!response1.ok) {
                const response2 = await fetch(proxyUrl1 + url);
                this.procesarRespuesta(response2);
            } else {
                this.procesarRespuesta(response1);
            }
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    }

    renderBody = () => {
        const body = `
         <div class="linea-azul"></div>
        <div class="linea-amarilla"></div>
        <div class="linea-verde"></div>
                   <div class="container justify-content-center" style="text-align: center; font-family: Verdana; font-size: 28px;"> 
                           Biblioteca Personal
                        </div>
                    <div class="d-flex justify-content-center">
                            <form id="form" style="width: 85%;"">
                           <div class="input-group  mt-10" style="display: flex; align-items: center; justify-content: center;">
                           <button class="btn btn-custom-outline-success2" id="generarBtn1" style="margin-right: 15px;margin-left: -30px;width: 104px;border-radius: 5px;"><span class="font-weight-bold"><i class="fa-regular fa-file-lines"></i></span> <span class="texto-agregar">Reportar</span></button>
                           <button class="btn btn-custom-outline-success2" id="marcarTodo" style="margin-right: 15px;margin-left: -30px;width: 140px;border-radius: 5px;display: none;"><span class="font-weight-bold"><i class="fa-solid fa-check-double"></i></span> <span class="texto-agregar">Marcar todo</span></button>
                           <button class="btn btn-custom-outline-success2" id="desmarcarTodo" style="margin-right: 15px;margin-left: -30px;width: 160px;border-radius: 5px;display: none;"><span class="font-weight-bold"><i class="fa-solid fa-check-double"></i></span> <span class="texto-agregar">Desmarcar todo</span></button>
                    <div class="btn-group me-2">
                <button type="button" class="btn btn-custom-outline-success" id="agregar" style="height: 40px; width: 160px; line-height: 5px;"><span class="font-weight-bold"><i class="fa-solid fa-plus"></i></span> <span class="texto-agregar">Agregar Noticia</span></button>
                    </div>
                   <select id="tiempoSeleccionado2" style="border: none; width: 110px; margin-left: 15px";>
                    <option value="" selected disabled>Prioridad</option>
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                </select>
                <div id="selectDiv" style="position: relative; width: 200px;">
                <select id="tiempoSeleccionado3" style="border: none; width: 90px; margin-left: 20px; max-width: 150px;";>
                    <option value="" selected disabled>Fecha</option>
                    <option value="ultimoDia">Último Día</option>
                    <option value="ultimaSemana">Última Semana</option>
                    <option value="ultimoMes">Último Mes</option>
                    <option value="customRange">Rango Fecha</option>
                </select>
                </div>
                   <input class="form-control me-2 fontAwesome" id="buscadorEtiqueta" autocomplete="off" type="text" style="width: 100px; margin-left: 200px; height: 38px; border-radius: 5px; border: 1px solid #1c2858;" placeholder="&#xf002; Buscar..."> 
                    <div class="btn-group me-2">
                         <button type="button" class="btn btn-custom-outline-success2" id="buscar" style="height: 40px; display: none; line-height: 5px; width: 150px; margin-left: 50px;">
                            <span class="font-weight-bold"><i class="fa-solid fa-filter"></i></span><span class="texto-agregar" style="margin-left: 5px">Limpiar Filtros</span>
                         </button>
                    </div>
                </div>
                <select id="tiempoSeleccionadoMobile1" style="border: none; width: 110px; margin-left: 115px; display: none">
                    <option value="" selected disabled>Prioridad</option>
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                </select>
                <select id="tiempoSeleccionadoMobile2" style="border: none; width: 90px; margin-left: 20px; display: none">
                    <option value="" selected disabled>Fecha</option>
                    <option value="ultimaHora">Última Hora</option>
                    <option value="ultimoDia">Último Día</option>
                    <option value="ultimaSemana">Última Semana</option>
                    <option value="ultimoMes">Último Mes</option>
                    <option value="ultimoAno">Último Año</option>
                </select>
                <div id="pillsMobile-container" class="pill-container"></div>
                <div class="spinner-border" role="status" style="color: #cdab68;margin-left: 50%;margin-top: 30%;display: none;">
                  <span class="visually-hidden">Loading...</span>
                </div>
               
                <div class="search-results-container1">
                    <div id="noticiasBiblioteca"></div> 
                    <div class="d-flex justify-content-center">
                    </div>
                </div>
                <button class="btn btn-custom-outline-success3" id="generarBtn2" style="display: none; margin-left: 1350px; margin-top: -120px">ACEPTAR</button>
                <button class="btn btn-custom-outline-success4" id="generarBtn3" style=" display: none; margin-top: -120px">CANCELAR</button>
                </div>
            </form>
            
        `;
        $(document).ready(function () {

            $('select#tiempoSeleccionado3').change(function () {
                var text = $(this).find('option:selected').text();
                var $aux = $('<select/>').append($('<option/>').text(text));
                $(this).after($aux);
                $(this).width($aux.width());
                $(this).css('margin-right', $aux.css('margin-right'));
                $aux.remove();
            }).change();
        });
        setTimeout(() => {
            const tiempoSeleccionadoNormal = document.getElementById('tiempoSeleccionado2');
            const tiempoSeleccionadoMobile = document.getElementById('tiempoSeleccionadoMobile1');
            const tiempoSeleccionadoNormal1 = document.getElementById('tiempoSeleccionado3');
            const tiempoSeleccionadoMobile1 = document.getElementById('tiempoSeleccionadoMobile2');
            tiempoSeleccionadoNormal.addEventListener('change', () => {
                const valorSeleccionado = tiempoSeleccionadoNormal.value;
                tiempoSeleccionadoMobile.value = valorSeleccionado;
                for (let option of tiempoSeleccionadoMobile.options) {
                    if (option.value === valorSeleccionado) {
                        option.selected = true;
                    } else {
                        option.selected = false;
                    }
                }
            });
            tiempoSeleccionadoMobile.addEventListener('change', () => {
                const valorSeleccionado = tiempoSeleccionadoMobile.value;
                tiempoSeleccionadoNormal.value = valorSeleccionado;
                for (let option of tiempoSeleccionadoNormal.options) {
                    if (option.value === valorSeleccionado) {
                        option.selected = true;
                    } else {
                        option.selected = false;
                    }
                }
            });
            tiempoSeleccionadoNormal1.addEventListener('change', () => {
                const valorSeleccionado = tiempoSeleccionadoNormal1.value;
                tiempoSeleccionadoMobile1.value = valorSeleccionado;
                for (let option of tiempoSeleccionadoMobile1.options) {
                    if (option.value === valorSeleccionado) {
                        option.selected = true;
                    } else {
                        option.selected = false;
                    }
                }
            });
            tiempoSeleccionadoMobile1.addEventListener('change', () => {
                const valorSeleccionado = tiempoSeleccionadoMobile1.value;
                tiempoSeleccionadoNormal1.value = valorSeleccionado;
                for (let option of tiempoSeleccionadoNormal1.options) {
                    if (option.value === valorSeleccionado) {
                        option.selected = true;
                    } else {
                        option.selected = false;
                    }
                }
            });
        }, 0);
        return body;
    }
    renderModalExportar = () => {
        return `
    <div id="modalExportar" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                <div class="spinner-border" id="spinner-exportar" role="status" style="color: #cdab68;margin-left: 48%;margin-top: 3%;display: none;" bis_skin_checked="1"><span class="visually-hidden">Loading...</span></div>
                    <button type="button" id="cancelModal" class="close" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <h5 class="text-center mb-3">Exportar a:</h5>
                    <div class="text-center">
                        <button id="exportarPDF" class="btn export-button mr-3" style="background-color: #e11c00;">
                            <i class="fas fa-file-pdf fa-2x" style="color: #ffffff;width: 70px;"></i>
                        </button>
                        <button id="exportarExcel" class="btn export-button mr-3" style="background-color: #127c44;">
                            <i class="fas fa-file-excel fa-2x" style="color: #ffffff"></i>
                            <span class="button-label" style="color: #ffffff; font-weight: bold">Excel</span>
                        </button>
                    </div>
                </div>
                <div class="modal-footer justify-content-center">
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" id="prioridadCheckbox" style="margin-top: 5px;">
                        <label class="form-check-label" for="prioridadCheckbox" style="vertical-align: middle;"> Ordenar por prioridad</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" id="fechaCheckbox" style="margin-top: 5px;margin-left: 10px;">
                        <label class="form-check-label" for="fechaCheckbox" style="vertical-align: middle;"> Ordenar por fecha</label>
                    </div>
                    <div class="form-check form-check-inline" style="display: none">
                        <input class="form-check-input" type="radio" name="ordenRadio" id="ascendenteRadio" value="ascendente">
                        <label class="form-check-label" for="ascendenteRadio">Ascendente</label>
                    </div>
                    <div class="form-check form-check-inline" style="display: none">
                        <input class="form-check-input" type="radio" name="ordenRadio" id="descendenteRadio" value="descendente">
                        <label class="form-check-label" for="descendenteRadio">Descendente</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    }
    cancelarExportar = () => {
        const aceptarBtn = this.dom.querySelector("#generarBtn2");
        const cancelarBtn = this.dom.querySelector("#generarBtn3");
        const generarBtn = this.dom.querySelector("#generarBtn1");
        const marcarBtn = this.dom.querySelector("#marcarTodo");
        const desmarcarBtn = this.dom.querySelector("#desmarcarTodo");
        generarBtn.style.display = "block";
        this.dom.querySelector("#marcarTodo").style.display = "none";
        const prioridadCheckbox = document.querySelector(`#prioridadCheckbox`);
        const fechaCheckbox = document.querySelector(`#fechaCheckbox`);
        const checkboxes = document.querySelectorAll('[id^="noticiaCheckbox-"]');
        checkboxes.forEach((checkbox) => {
            checkbox.checked = false;
        });
        const checkContainers = document.querySelectorAll('.check-container');
        checkContainers.forEach((checkContainer) => {
            checkContainer.style.display = 'none';
        });
        prioridadCheckbox.checked = false;
        fechaCheckbox.checked = false;
        marcarBtn.style.display = "none";
        desmarcarBtn.style.display = "none";
        aceptarBtn.style.display = 'none';
        cancelarBtn.style.display = 'none';
    }
    renderModal = () => {
        return `
        <div id="modal" class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg custom-modal-width" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" id = "cancelModal" class="close d-flex align-items-center justify-content-center" aria-label="Close" style="font-size: 36px; width: 50px; height: 50px; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5); border: 2px solid #ccc; border-radius: 50%;">
  <span aria-hidden="true" class="ion-ios-close"></span>
</button>
            </div>
            <div class="modal-body p-4 py-3 p-md-3">
                <img src="images/Minae.png" class="w-50 mx-auto d-block" alt="...">
                <ul class="ftco-footer-social p-0 text-center"></ul>
                <h4 class="mt-4 text-center"> Ingreso de noticia de medio externo</h4>
                <form id="form">
                <div class="container">
                    <div class="form-group">
                        <legend id="titulolegend" class="col-form-label col-sm-4 pt-0 align-items-center d-flex" style="font-size: 22px; font-family: Verdana">
                            <i class="fas fa-newspaper mr-2"></i> Título:
                        </legend>
                        <input type="text" class="form-control col-md-12  mborder border-dark" autocomplete="off" id="titulo" name="titulo" style="font-size: 20px;" disabled>
                    </div>
                    </div>
                    <div class="container">
                    <div class="form-group">
                        <legend id="descripcionlegend" class="col-form-label col-sm-4 pt-0 align-items-center d-flex" style="font-size: 25px; padding-left: 10px; font-family: Verdana">
                            <i class="fas fa-file-alt mr-2"></i> Descripción:
                        </legend>
                        <textarea type="text" class="form-control col-md-12 border-dark" style="font-size: 20px ;" id="descripcion" name="descripcion" rows="3" disabled></textarea>
                    </div>
                   
                    </div>
<div class="container">
  <div class="row">
   <div class="col-md-6">
      <div class="form-group">
        <legend id="fechalegend" class="col-form-label pt-0 align-items-center d-flex" style="font-size: 22px; padding-left: 10px; font-family: Verdana">
          <i class="far fa-calendar-alt mr-2"></i> Fecha de redacción
        </legend>
        <div class="row">
          <div class="col">
            <input type="text" class="form-control border border-dark" autocomplete="off" id="dia" name="dia" style="font-size: 20px; padding: 10px;" placeholder="Día" disabled>
          </div>
          <div class="col">
            <select class="form-select border border-dark dropup" id="mes" name="mes" style="font-size: 20px; padding: 10px;" disabled>
              <option value="" disabled selected hidden>Mes</option>
              <option>Enero</option>
              <option>Febrero</option>
              <option>Marzo</option>
              <option>Abril</option>
              <option>Mayo</option>
              <option>Junio</option>
              <option>Julio</option>
              <option>Agosto</option>
              <option>Septiembre</option>
              <option>Octubre</option>
              <option>Noviembre</option>
              <option>Diciembre</option>
            </select>
          </div>
          <div class="col">
            <input type="text" class="form-control border border-dark" autocomplete="off" id="anio" name="anio" style="font-size: 20px; padding: 10px;" placeholder="Año" disabled>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <div class="form-group">
        <legend id="prioridadlegend" class="col-form-label pt-0 align-items-center d-flex" style="font-size: 22px; padding-left: 10px; font-family: Verdana">
          <i class="fas fa-exclamation-triangle mr-2"></i> Prioridad
        </legend>
        <select class="form-select border border-dark mt-2" id="prioridad" name="prioridad" style="font-size: 20px; padding: 10px;" disabled>
          <option>Alta</option>
          <option>Media</option>
          <option selected>Baja</option>
        </select>
      </div>
    </div>
  </div>
</div>
                    <div class="container">
  <div class="row">
    <div class="col-md-6">
      <div class="form-group">
        <legend id="fuentelegend" class="col-form-label pt-0 align-items-center d-flex" style="font-size: 22px; padding-left: 10px; font-family: Verdana">
          <i class="fas fa-info-circle mr-2"></i> Fuente
        </legend>
        <input type="text" class="form-control border border-dark"  autocomplete="off" id="fuente" name="fuente" style="font-size: 20px;" disabled>
      </div>
    </div>
    <div class="col-md-6">
      <div class="form-group">
        <legend id="enlacelegend" class="col-form-label pt-0 align-items-center d-flex" style="font-size: 22px; padding-left: 10px; font-family: Verdana">
          <i class="fas fa-link mr-2"></i> Enlace
        </legend>
        <input type="text" class="form-control border border-dark" autocomplete="off" id="enlace" name="enlace" style="font-size: 20px;">
      </div>
    </div>
  </div>
</div>
                    <div class="container bg-light">
                            <div class="col-md-12 mt-4 text-center">
                                 <button type="button" style="font-size: 23px; margin-top: 40px; margin-bottom: 20px; background-color: #1c2858;" id="apply" class="btn btn-primary mt-3">Ingresar Noticia</button>
                            </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
        `;
    }
    renderModalError = () => {
        return `
    <div id="modalError" class="modal fade">
          <div class="modal-dialog modal-error">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="icon-box">
                        <i class="material-icons">warning</i>
                    </div>
                    <h4 class="modal-title w-100">¡Ooops!</h4>\t
                </div>
                <div class="modal-body">
                    <p style="font-size: 25px;" class="text-center">Verifica si la noticia está duplicada o los datos son incorrectos.</p>
                </div>
                <div class="modal-footer">
            <button class="btn btn-success btn-block" id="dismissButton" data-dismiss="modal">Regresar</button>
                </div>
            </div>
            </div>
        </div>  
        `;
    }
    renderModalErrorBorrar = () => {
        return `
<div id="modalErrorBorrar" class="modal fade">
          <div class="modal-dialog modal-error">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="icon-box">
                        <i class="material-icons">warning</i>
                    </div>
                    <h4 class="modal-title w-100">¡Ooops!</h4>\t
                </div>
                <div class="modal-body">
                    <p style="font-size: 25px;" class="text-center">La eliminación de la noticia no se ha realizado con éxito.</p>
                </div>
                <div class="modal-footer">
            <button class="btn btn-success btn-block" id="dismissButton" data-dismiss="modal">Regresar</button>
                </div>
            </div>
            </div>
        </div>  
    
        `;
    }
    renderModalSuccessBorrar = () => {
        return `
    <div id="sucessBorrar" class="modal fade">
      <div class="modal-dialog modal-confirm">
        <div class="modal-content">
            <div class="modal-header">
                <div class="icon-box">
                    <i class="material-icons">&#xE876;</i>
                </div>
                <h4 class="modal-title w-100">¡Confirmado!</h4>
            </div>
            <div class="modal-body">
                <p style="font-size: 25px;" class="text-center">La noticia ha sido eliminada de tu biblioteca con éxito.</p>
            </div>
            <div class="modal-footer mt-3 text-center"> <!-- Ajusta el margen superior y alinea el botón al centro -->
                <button class="btn btn-success btn-block" id="sucessbuton" data-dismiss="modal">OK</button>
            </div>
        </div>
      </div>
    </div>
    `;
    }
    renderModalErrorGenerico = () => {
        return `
        <div id="modalErrorMensaje" class="modal fade">
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
                        <button class="btn btn-success btn-block" id="dismissButton" data-dismiss="modal">Regresar</button>
                    </div>
                </div>
            </div>
        </div>`;
    }
    renderModalCampo = () => {
        return `
    <div id="modalcampo" class="modal fade">
        <div class="modal-dialog modal-confirm2">
            <div class="modal-content">
                <div class="modal-body text-center">
                    <p style="font-size: 20px;">Por favor, complete todos los campos para publicar la noticia.</p>
                    <button id="dismisscampo" style="font-size: 20px;" class="btn2 btn-success" data-dismiss="modal">Regresar</button>
                </div>
            </div>
        </div>
    </div>
    `;
    }
    renderModalBorrar = () => {
        return `
        <div id="modalborrar" class="modal fade" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" id="cancelModal" class="close d-flex align-items-center justify-content-center" aria-label="Close" style="font-size: 36px; width: 50px; height: 50px; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5); border: 2px solid #ccc; border-radius: 50%;">
                            <span aria-hidden="true" class="ion-ios-close"></span>
                        </button>
                    </div>
                    <div class="modal-body p-4 py-5 p-md-5">
                        <div class="text-center">
                            <img src="images/Minae.png" class="w-50 mx-auto d-block mb-4" alt="...">
                        </div>
                        <h4 class="text-center mb-2 mt-2">¿Estás seguro de que deseas eliminar esta noticia de tu biblioteca? </h4>
                       
                       
                        <ul class="ftco-footer-social p-0 text-center">
                        </ul>
                         
                        <form action="#" id="formmarcar" class="signup-form">
                            <div class="btn-group mt-4 d-flex justify-content-center">
                                <button type="submit" id="confirmarb" class="btn btn-outline-primary rounded submit ml-4 mr-3 c-btn">Confirmar</button>
                                <button type="button" id="cancelarb" class="btn btn-outline-secondary rounded submit">Cancelar</button>
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
    renderModalSuccess = () => {
        return `
        <div id="sucessmodal" class="modal fade">
          <div class="modal-dialog modal-confirm">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="icon-box">
                        <i class="material-icons">&#xE876;</i>
                    </div>
                    <h4 class="modal-title w-100">¡Confirmado!</h4>\t
                </div>
                <div class="modal-body">
                    <p style="font-size: 25px;" class="text-center">Tu noticia externa ha sido ingresada con éxito.</p>
                </div>
                <div class="modal-footer">
            <button class="btn btn-success btn-block" id="sucessbuton" data-dismiss="modal">OK</button>
                </div>
            </div>
            </div>
        </div>   
        `;
    }
    verificarCamposLlenados = () => {
        const titulo = document.getElementById('titulo').value;
        const descripcion = document.getElementById('descripcion').value;
        const prioridad = document.getElementById('prioridad').value;
        const fuente = document.getElementById('fuente').value;
        const enlace = document.getElementById('enlace').value;
        const dia = document.getElementById('dia').value;
        const mes = document.getElementById('mes').value;
        const anio = document.getElementById('anio').value;
        const regexAnio = /^\d{4}$/;
        const regexEnlace = /^(https?:\/\/).+/i;
        const tituloLegend = document.getElementById('titulolegend');
        const descripcionLegend = document.getElementById('descripcionlegend');
        const fechaLegend = document.getElementById('fechalegend');
        const prioridadLegend = document.getElementById('prioridadlegend');
        const fuenteLegend = document.getElementById('fuentelegend');
        const enlaceLegend = document.getElementById('enlacelegend');
        tituloLegend.style.color = 'black';
        tituloLegend.style.textDecoration = 'none';
        descripcionLegend.style.color = 'black';
        descripcionLegend.style.textDecoration = 'none';
        fechaLegend.style.color = 'black';
        fechaLegend.style.textDecoration = 'none';
        prioridadLegend.style.color = 'black';
        prioridadLegend.style.textDecoration = 'none';
        fuenteLegend.style.color = 'black';
        fuenteLegend.style.textDecoration = 'none';
        enlaceLegend.style.color = 'black';
        enlaceLegend.style.textDecoration = 'none';
        if (titulo.trim() === '') {
            tituloLegend.style.color = 'red';
            tituloLegend.style.textDecoration = 'underline';
            tituloLegend.title = 'Debes ingresar un título';
        }
        if (descripcion.trim() === '') {
            descripcionLegend.style.color = 'red';
            descripcionLegend.style.textDecoration = 'underline';
            descripcionLegend.title = 'Debes ingresar una descripción de la noticia';
        }
        if (mes.trim() === '' || mes.trim() === 'Mes') {
            fechaLegend.style.color = 'red';
            fechaLegend.style.textDecoration = 'underline';
            fechaLegend.title = 'Elige un mes válido';
        }
        if (dia.trim() === '' || parseInt(dia) < 1 || parseInt(dia) > 31) {
            fechaLegend.style.color = 'red';
            fechaLegend.style.textDecoration = 'underline';
            fechaLegend.title = 'Ingresa un valor dentro del rango de los días (1-31)';
        }
        if (prioridad.trim() === '') {
            prioridadLegend.style.color = 'red';
            prioridadLegend.style.textDecoration = 'underline';
            prioridadLegend.title = 'Ingresa una prioridad válida';
        }
        if (fuente.trim() === '') {
            fuenteLegend.style.color = 'red';
            fuenteLegend.style.textDecoration = 'underline';
            fuenteLegend.title = 'Ingresa una fuente válida';
        }
        if (!regexEnlace.test(enlace)) {
            enlaceLegend.style.color = 'red';
            enlaceLegend.style.textDecoration = 'underline';
            enlaceLegend.title = 'Ingresa un enlace válido (debe comenzar con http:// o https://)';
        }
        if (!regexAnio.test(anio)) {
            fechaLegend.style.color = 'red';
            fechaLegend.style.textDecoration = 'underline';
            fechaLegend.title = 'Ingresa un año válido';
        }
        // Verificar si alguno de los campos está vacío
        if (
            titulo.trim() === '' ||
            descripcion.trim() === '' ||
            anio.trim() === '' ||
            mes.trim() === '' ||
            dia.trim() === '' ||
            prioridad.trim() === '' ||
            fuente.trim() === '' ||
            enlace.trim() === '' || !regexEnlace.test(enlace) || !regexAnio.test(anio) || parseInt(dia) < 1 || parseInt(dia) > 31
        ) {
            this.showModalCampo();
            return false;
        }
        return true;
    }
    renderizarNoticias = () => {
        const bordeColores = ['#1c2858', '#cdab68'];
        const noticiasCoincidentes = document.getElementById('noticiasBiblioteca');
        noticiasCoincidentes.innerHTML = '';

        if (this.state.noticias.length === 0) {
            const spinner = document.querySelector('.spinner-border');
            spinner.style.display = 'none';
            noticiasCoincidentes.innerHTML = '<p style="margin-top: 25%; display: flex; justify-content: center; align-items: center; font-weight: bold; font-size: 24px;">No tienes noticias guardadas.</p>';
            return;
        }

        for (const [index, noticia] of this.state.noticias.entries()) {
            const {id, titulo, descripcion, prioridad, fuente, enlace, imagen, fechaGuardado, fecha} = noticia;
            const idNoticia = noticia.id;
            const etiquetas = noticia.etiquetas;
            const fechaDate = new Date(fechaGuardado);
            const fechaFormateada = fechaDate.toLocaleDateString();
            const colorBorde = bordeColores[index % bordeColores.length];
            const elementoNoticiaCoincidente = document.createElement('div');
            elementoNoticiaCoincidente.classList.add('noticiaBiblioteca');

            elementoNoticiaCoincidente.innerHTML = `
            <div class="card bg-dark-subtle mt-4" style="border: 2px solid ${colorBorde};" data-link="${enlace}">
                <img src="${imagen}" class="card-img-top card-img-custom" alt="" 
                data-alternative="${imagen},images/default.png" 
                onerror="loadAlternative(this, this.getAttribute('data-alternative').split(/,/)); this.classList.add('card-img-top', 'card-img-custom');">
               
                <div class="card-body">
                    <div class="text-section-Biblioteca">
                        <h5 class="card-title fw-bold">${titulo}</h5>
                        <p class="card-text descripcion">${descripcion}</p>
                        <div class="pill-container"></div> 
                    </div>
                    <div class="check-container">
                    <div class="checkbox-wrapper-18">
                        <div class="round">
                            <input type="checkbox" id="noticiaCheckbox-${idNoticia}" />
                            <label for="noticiaCheckbox-${idNoticia}"></label>
                        </div>
                    </div>
                </div>
                    </div>  
                    <div class="cta-section">
                        <p class="card-text" >${fecha}</p>
                        <div class="semaforoModal2">
                            <input type="radio" name="prioridad-${index}" class="AltaModal2" value="Alta" ${prioridad === 'Alta' ? 'checked' : ''}>
                            <input type="radio" name="prioridad-${index}" class="MediaModal2" value="Media" ${prioridad === 'Media' ? 'checked' : ''}>
                            <input type="radio" name="prioridad-${index}" class="BajaModal2" value="Baja" ${prioridad === 'Baja' ? 'checked' : ''}>
                        </div>
                        <div class="c-btn-group">
                            <button class="borrar-container" id="borrarBtn">
                                <i class="fas fa-trash-can" style="font-size: 1.2em; color: #f10;"></i>
                            </button>
                            <a href="${enlace}" id="enlaceBtn2" class="btn" target="_blank" data-bs-toggle="tooltip" data-bs-placement="top" title="${fuente}" style="margin-bottom: 6px;">
                                <i class="fas fa-share" style="font-size: 1.5em; color: ${colorBorde};"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
            const checkbox = elementoNoticiaCoincidente.querySelector(`#noticiaCheckbox-${idNoticia}`);
            if (checkboxesMarcados.includes(idNoticia)) {
                checkbox.checked = true;
            }
            checkbox.addEventListener('change', (event) => {
                if (event.target.checked) {
                    checkboxesMarcados.push(id);
                } else {
                    const index = checkboxesMarcados.indexOf(id);
                    if (index > -1) {
                        checkboxesMarcados.splice(index, 1);
                    }
                }
            });

            const borrar = elementoNoticiaCoincidente.querySelector('#borrarBtn');
            borrar.addEventListener('click', () => {
                event.preventDefault();
                this.showModalBorrar(id);
            });
            elementoNoticiaCoincidente.addEventListener('dblclick', (event) => {
                const checkbox = event.currentTarget.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    if (checkbox.checked) {
                        checkbox.checked = false;
                        const index = checkboxesMarcados.indexOf(id);
                        if (index > -1) {
                            checkboxesMarcados.splice(index, 1);
                        }
                    } else {
                        checkbox.checked = true;
                        if (!checkboxesMarcados.includes(id)) {
                            checkboxesMarcados.push(id);
                        }
                    }
                }
            });
            //LOGICA PARA CAMBIAR PRIORIDAD DE UNA NOTICA
            const radioButtons = elementoNoticiaCoincidente.querySelectorAll(`input[name="prioridad-${index}"]`);
            radioButtons.forEach(radioButton => {
                radioButton.addEventListener('change', () => {
                    this.actualizarPrioridad(id, radioButton.value);
                });
            });
            noticiasCoincidentes.appendChild(elementoNoticiaCoincidente);
            const spinner = document.querySelector('.spinner-border');
            spinner.style.display = 'none';
            const pillsContainer1 = elementoNoticiaCoincidente.querySelector(".pill-container");
            etiquetas.forEach((etiqueta) => {
                const pill = document.createElement("div");
                pill.className = "pillBiblioteca";
                pill.innerHTML = `
            <span class="pill-text">${etiqueta.descripcion}</span>
`;
                pill.style.backgroundColor = colorBorde;
                pillsContainer1.appendChild(pill);
                pill.addEventListener('click', () => {
                    const buscador = this.dom.querySelector("#buscadorEtiqueta");
                    buscador.value = etiqueta.descripcion;
                    buscador.dispatchEvent(new Event('input'));
                });
            });
        }

        if(exportando){
        const checkContainers = document.querySelectorAll('.check-container');
        checkContainers.forEach((checkContainer) => {
            checkContainer.style.display = 'block';
        });
        }
    }
    cargarBiblioteca = async () => {
        const usuario = localStorage.getItem('usuario');
        try {
            const response = await fetch(`${backend}/NoticiasMarcadas/${usuario}`);
            const spinner = document.querySelector('.spinner-border');
            spinner.style.display = 'block';
            const data = await response.json();
            this.state.noticias = data.reverse();
            this.renderizarNoticias();
        } catch (error) {
            console.log('Error al cargar la lista de noticias:', error);
        }
    }

    cargarBiblioteca2 = async () => {
        const usuario = localStorage.getItem('usuario');
        try {
            const response = await fetch(`${backend}/NoticiasMarcadas/${usuario}`);
            const data = await response.json();
            this.state.noticias = data.reverse();
        } catch (error) {
            console.log('Error al cargar la lista de noticias:', error);
        }
    }


    actualizarPrioridad = (noticiaID, nuevaPrioridad) => {
        cambio = true;
        const usuario = localStorage.getItem('usuario');
        const url = `${backend}/NoticiasMarcadas/${usuario}/${noticiaID}?input=${nuevaPrioridad}`;
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            if (!response.ok) {
                console.error(`Error al actualizar la prioridad de la noticia: ${response.status}`);
                throw new Error('Error al actualizar prioridad');
            }
        }).catch((error) => {
            console.log('Error: ', error);
        });
        event.preventDefault();
    }
    showModal = async () => {
        this.resetForm();
        const titulo = document.getElementById('titulo');
        const descrip = document.getElementById('descripcion');
        const fuent = document.getElementById('fuente');
        const dia = document.getElementById('dia');
        const mes = document.getElementById('mes');
        const anio = document.getElementById('anio');
        const prioridad = document.getElementById('prioridad');
        titulo.setAttribute('disabled', 'disabled');
        descrip.setAttribute('disabled', 'disabled');
        fuent.setAttribute('disabled', 'disabled');
        dia.setAttribute('disabled', 'disabled');
        mes.setAttribute('disabled', 'disabled');
        anio.setAttribute('disabled', 'disabled');
        prioridad.setAttribute('disabled', 'disabled');
        this.modal.show();
    }
    showModalError = async () => {
        this.modal.hide();
        this.modalerror.show();
    }
    showModalCampo = async () => {
        this.modalCampo.show();
    }
    showModalFaltaCampo = async () => {
        this.modalerror.show();
    }
    showModalBorrar = (idd) => {
        event.preventDefault();
        this.deleteEntity = " ";
        this.deleteEntity = idd;
        this.modalBorrar.show();
    }
    showModalErrorBorrar = async () => {
        this.modalErrorBorrar.show();
    }
    showModalSuccessBorrar = async () => {
        this.modalSuccessBorrar.show();
    }
    hideModalBorrarSuccess = async () => {
        this.modalSuccessBorrar.hide();
    }
    hideModalBorrar = async () => {
        this.modalBorrar.hide();
    }
    hideModalError = async () => {
        this.modalerror.hide();
        this.modal.show();
    }
    hideModalMensaje = async () => {
        this.modalErrorMensaje.hide();
    }
    hideModalExportar = async () => {
        this.modalExportar.hide();
    }

    hideModalExito = async () => {
        this.modalexito.hide();
        this.resetForm();
        this.reset();
    }
    hideModalCampo = async () => {
        this.modalCampo.hide();
    }
    hidemodal = () => {
        this.modal.hide();
        this.modal.resetForm();
        this.reset();
    }
    showModalExito = () => {
        // Cargar los datos de la entidad en el formulario del modal
        this.modal.hide();
        this.modalexito.show();
    }

    load = async () => {
        const form = this.dom.querySelector("#biblioteca #modal #form");
        const formData = new FormData(form);
        this.entity = {};
        for (let [key, value] of formData.entries()) {
            this.entity[key] = value;
        }

    }
    createNew = () => {
        cambio = true;
        this.state.mode = 'A'; //agregar
        this.showModal();
    }
    resetForm = () => {
        var formulario = this.dom.querySelector("#biblioteca #modal #form");
        formulario.reset();
        const tituloLegend = document.getElementById('titulolegend');
        const descripcionLegend = document.getElementById('descripcionlegend');
        const fechaLegend = document.getElementById('fechalegend');
        const prioridadLegend = document.getElementById('prioridadlegend');
        const fuenteLegend = document.getElementById('fuentelegend');
        const enlaceLegend = document.getElementById('enlacelegend');
        tituloLegend.style.color = 'black';
        descripcionLegend.style.color = 'black';
        fechaLegend.style.color = 'black';
        prioridadLegend.style.color = 'black';
        fuenteLegend.style.color = 'black';
        enlaceLegend.style.color = 'black';
    }
    add = async () => {
        await this.load();
        const dia = this.entity['dia'];
        const anio = this.entity['anio'];
        const m = this.entity['mes'];
        let mes = null;
        if (m === 'Enero') {
            mes = '01';
        } else if (m === 'Febrero') {
            mes = '02';
        } else if (m === 'Marzo') {
            mes = '03';
        } else if (m === 'Abril') {
            mes = '04';
        } else if (m === 'Mayo') {
            mes = '05';
        } else if (m === 'Junio') {
            mes = '06';
        } else if (m === 'Julio') {
            mes = '07';
        } else if (m === 'Agosto') {
            mes = '08';
        } else if (m === 'Septiembre') {
            mes = '09';
        } else if (m === 'Octubre') {
            mes = '10';
        } else if (m === 'Noviembre') {
            mes = '11';
        } else if (m === 'Diciembre') {
            mes = '12';
        }
        let diaa = this.entity['dia'];
        if (diaa == '1') {
            diaa = '01';
        }
        if (diaa == '2') {
            diaa = '02';
        }
        if (diaa == '3') {
            diaa = '03';
        }
        if (diaa == '4') {
            diaa = '04';
        }
        if (diaa == '5') {
            diaa = '05';
        }
        if (diaa == '6') {
            diaa = '06';
        }
        if (diaa == '7') {
            diaa = '07';
        }
        if (diaa == '8') {
            diaa = '08';
        }
        if (diaa == '9') {
            diaa = '09';
        }
        this.entity["fecha"] = diaa + "/" + mes + "/" + anio;
        delete this.entity['dia'];
        delete this.entity['mes'];
        delete this.entity['anio'];
        let imageUrl = "";
        const enlace = document.getElementById('enlace').value;
        if (this.verificarCamposLlenados()) {
            try {
                const proxyUrl1 = `${backend}/proxy?url=`;
                const proxyUrl2 = 'https://corsproxy.io/?';
                const newsResponse1 = await fetch(proxyUrl1 + enlace);
                const newsHtml1 = await newsResponse1.text();
                const newsDocument1 = new DOMParser().parseFromString(newsHtml1, 'text/html');
                const ogImage1 = newsDocument1.querySelector('meta[property="og:image"]');
                if (ogImage1) {
                    imageUrl = ogImage1.getAttribute('content');
                } else {
                    const newsResponse2 = await fetch(proxyUrl2 + enlace);
                    const newsHtml2 = await newsResponse2.text();
                    const newsDocument2 = new DOMParser().parseFromString(newsHtml2, 'text/html');
                    const ogImage2 = newsDocument2.querySelector('meta[property="og:image"]');
                    if (ogImage2) {
                        imageUrl = ogImage2.getAttribute('content');
                    } else {
                        console.error('No se pudo encontrar una imagen en ninguno de los proxies.');
                    }
                }
                this.entity['imagen'] = imageUrl;
            } catch (error) {
                console.error('Error al obtener datos de noticia', error);
            }
            let descripciones = ["Noticia Externa"];
            this.entidad['id'] = '1';
            this.entidad['titulo'] = this.entity.titulo;
            this.entidad['descripcion'] = this.entity.descripcion;
            this.entidad['fecha'] = this.entity.fecha;
            this.entidad['prioridad'] = this.entity.prioridad;
            this.entidad['fuente'] = this.entity.fuente;
            this.entidad['enlace'] = document.getElementById('enlace').value;
            this.entidad['fechaGuardado'] = '2023-10-09';
            const usuario = localStorage.getItem('usuario');
            this.entidad['usuarioCedula'] = usuario;
            this.entidad['imagen'] = imageUrl;
            const etiquetasDescripcion = [];
            descripciones.forEach(descripcion => {
                etiquetasDescripcion.push({descripcion});
            });
            this.entidad['etiquetas'] = etiquetasDescripcion;
            const request2 = new Request(`${backend}/NoticiasMarcadas/agregar/1`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.entidad)
            });

            try {
                const response = await fetch(request2);
                if (!response.ok) {
                    this.showModalError()
                    return;
                } else {
                    this.cargarBiblioteca();
                    this.showModalExito();
                    return;
                }
            } catch (e) {
                alert(e);
            }
        } else {
        }
    }
    exportarAPDF = async (indicesSeleccionados) => {
        const spinner = this.dom.querySelector("#spinner-exportar");
        spinner.style.display = 'block';
        const prioridadCheckbox = document.querySelector(`#prioridadCheckbox`);
        const fechaCheckbox = document.querySelector(`#fechaCheckbox`);
        const noticiasOrdenadas = await this.ordenarNoticias(indicesSeleccionados, prioridadCheckbox, fechaCheckbox);
        const doc = new jsPDF('p', 'in', 'letter');
        const margenIzquierda = 0.5;
        const margenDerecha = 8.25 - 0.25;
        const margenArriba = 0.5;
        const margenAbajo = 11.75 - 0.5;
        doc.setFont("Verdana");
        doc.setFontSize(18);
        doc.setFontStyle('bold');
        doc.text('Noticias Seleccionadas', margenIzquierda, margenArriba + 0.5);
        doc.setLineWidth(0.01);
        doc.line(margenIzquierda, margenArriba + 0.7, margenDerecha, margenArriba + 0.7);
        let currentY = margenArriba + 1;
        for (const noticia of noticiasOrdenadas) {
            const formatoImagen = this.obtenerFormatoImagen(noticia.imagen);
            let imagenBase64;
            if (formatoImagen === 'WEBP') {
                const urlImagen = `${backend}/proxy/img?url=` + noticia.imagen;
                imagenBase64 = await this.convertirWebpAFormato(urlImagen, 'jpeg');
            } else {
                imagenBase64 = await this.obtenerImagenBase64(noticia.imagen);
            }
            const imagenAncho = 160 / 72;
            const imagenAltura = 100 / 72;
            if (currentY + imagenAltura > margenAbajo - 0.5) {
                doc.addPage();
                currentY = margenArriba + 0.5;
            }
            try {
                doc.addImage(imagenBase64, formatoImagen, margenIzquierda, currentY, imagenAncho, imagenAltura);
            } catch (error) {
                const urlImagen = `${backend}/proxy/img?url=` + noticia.imagen;
                imagenBase64 = await this.convertirWebpAFormato(urlImagen, 'jpeg');
                try {
                    doc.addImage(imagenBase64, 'JPEG', margenIzquierda, currentY, imagenAncho, imagenAltura);
                } catch (error) {
                }
            }
            const espacioDisponible = margenDerecha - (margenIzquierda + imagenAncho);
            const titulo = noticia.titulo.replace(/(\r\n|\n|\r)/gm, ' ');
            doc.setFontSize(12);
            doc.setFontStyle('bold');
            const lineasTitulo = doc.splitTextToSize(titulo, espacioDisponible);
            const numLineasTitulo = lineasTitulo.length;
            doc.text(lineasTitulo, margenIzquierda + imagenAncho + 0.2, currentY + 0.1);
            const descripcion = noticia.descripcion.replace(/(\r\n|\n|\r)/gm, ' ');
            doc.setFontSize(10);
            doc.setFontStyle('normal');
            const descripcionLineas = doc.splitTextToSize(descripcion, espacioDisponible);
            doc.text(descripcionLineas, margenIzquierda + imagenAncho + 0.2, currentY + numLineasTitulo * 0.2 + 0.1);
            const infoAdicional = `Fecha: ${noticia.fecha}  Fuente: ${noticia.fuente}  Prioridad: ${noticia.prioridad}`;
            doc.setFontSize(10);
            doc.setFontStyle('normal');
            let fontSizeInfoAdicional = 8;
            let infoAdicionalCabe = false;
            while (!infoAdicionalCabe && fontSizeInfoAdicional > 6) {
                doc.setFontSize(fontSizeInfoAdicional);
                const alturaInfoAdicional = (doc.getTextDimensions(infoAdicional).h / 72);
                if (currentY + numLineasTitulo * 0.2 + (descripcionLineas.length * 0.2) + alturaInfoAdicional + 0.3 <= currentY + imagenAltura) {
                    infoAdicionalCabe = true;
                } else {
                    fontSizeInfoAdicional--;
                }
            }
            doc.text(infoAdicional, margenIzquierda + imagenAncho + 0.2, currentY + numLineasTitulo * 0.2 + (descripcionLineas.length * 0.2) + 0.1);
            const enlace = `Enlace: ${noticia.enlace}`;
            doc.setFontSize(6);
            doc.setTextColor(0, 0, 255);
            doc.setFontStyle('normal');
            let fontSizeEnlace = 6;
            let enlaceCabe = false;
            while (!enlaceCabe && fontSizeEnlace > 4) {
                doc.setFontSize(fontSizeEnlace);
                const alturaEnlace = (doc.getTextDimensions(enlace).h / 72);
                if (currentY + numLineasTitulo * 0.2 + (descripcionLineas.length * 0.2) + alturaEnlace + 0.5 <= currentY + imagenAltura) {
                    enlaceCabe = true;
                } else {
                    fontSizeEnlace--;
                }
            }
            doc.text(enlace, margenIzquierda + imagenAncho + 0.2, currentY + numLineasTitulo * 0.2 + (descripcionLineas.length * 0.2) + 0.3);
            doc.setTextColor(0, 0, 0);
            const alturaTotalNoticia = Math.max(imagenAltura, (doc.getTextDimensions(lineasTitulo).h / 72)) + ((descripcionLineas.length + 1) * 0.2) + 0.1;
            currentY += alturaTotalNoticia;
        }
        spinner.style.display = 'none';
        this.cancelarExportar();
        this.hideModalExportar();
        doc.save('noticias_seleccionadas.pdf');
    }
    exportarAXLSX = async (indicesSeleccionados) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Noticias Seleccionadas');
        this.configurarColumnas(worksheet);
        const prioridadCheckbox = this.dom.querySelector(`#prioridadCheckbox`);
        const fechaCheckbox = this.dom.querySelector(`#fechaCheckbox`);
        const noticiasOrdenadas = await this.ordenarNoticias(indicesSeleccionados, prioridadCheckbox, fechaCheckbox);
        this.agregarNoticiasALaHoja(worksheet, noticiasOrdenadas);
        this.estilizarHoja(worksheet);
        const worksheetCalculos = workbook.addWorksheet('Calculos');
        await this.crearGraficos(workbook, worksheetCalculos, noticiasOrdenadas);
        await this.guardarArchivo(workbook);
    };
    configurarColumnas = (worksheet) => {
        worksheet.columns = [
            {
                header: 'Título',
                key: 'titulo',
                width: 40,
                style: {alignment: {vertical: 'middle', horizontal: 'center'}}
            },
            {
                header: 'Descripción',
                key: 'descripcion',
                width: 60,
                style: {alignment: {vertical: 'middle', horizontal: 'left'}}
            },
            {header: 'Fecha', key: 'fecha', width: 20, style: {alignment: {vertical: 'middle', horizontal: 'center'}}},
            {
                header: 'Fuente',
                key: 'fuente',
                width: 30,
                style: {alignment: {vertical: 'middle', horizontal: 'center'}}
            },
            {
                header: 'Prioridad',
                key: 'prioridad',
                width: 15,
                style: {alignment: {vertical: 'middle', horizontal: 'center'}}
            },
            {header: 'Enlace', key: 'enlace', width: 50, style: {alignment: {vertical: 'middle', horizontal: 'center'}}}
        ];
    };
    ordenarNoticias = (indicesSeleccionados, prioridadCheckbox, fechaCheckbox) => {
        let noticiasOrdenadas;
        if (prioridadCheckbox.checked) {
            noticiasOrdenadas = this.state.noticias.filter(noticia => indicesSeleccionados.includes(noticia.id))
                .sort((a, b) => {
                    if (a.prioridad === 'Alta') return -1;
                    if (a.prioridad === 'Baja') return 1;
                    if (a.prioridad === 'Media' && b.prioridad === 'Alta') return 1;
                    if (a.prioridad === 'Media' && b.prioridad === 'Baja') return -1;
                    return 0;
                });
            if (fechaCheckbox.checked) {
                noticiasOrdenadas = noticiasOrdenadas.sort((a, b) => {
                    if (a.prioridad === b.prioridad) {
                        const fechaA = new Date(b.fecha.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3')).getTime();
                        const fechaB = new Date(a.fecha.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3')).getTime();
                        return fechaA - fechaB;
                    }
                    return 0;
                });
            }
        } else {
            if (fechaCheckbox.checked) {
                noticiasOrdenadas = this.state.noticias.filter(noticia => indicesSeleccionados.includes(noticia.id))
                    .sort((a, b) => {
                        const fechaA = new Date(b.fecha.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3')).getTime();
                        const fechaB = new Date(a.fecha.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3')).getTime();
                        return fechaA - fechaB;
                    });
            } else {
                noticiasOrdenadas = this.state.noticias.filter(noticia => indicesSeleccionados.includes(noticia.id));
            }
        }
        return noticiasOrdenadas;
    };
    agregarNoticiasALaHoja = (worksheet, noticiasOrdenadas) => {
        const prioridadStyles = {
            Alta: {fill: {type: 'pattern', pattern: 'solid', fgColor: {argb: 'da9595'}}},
            Media: {fill: {type: 'pattern', pattern: 'solid', fgColor: {argb: 'ffe699'}}},
            Baja: {fill: {type: 'pattern', pattern: 'solid', fgColor: {argb: 'c2d699'}}}
        };
        noticiasOrdenadas.forEach(noticia => {
            const tituloSinSaltos = noticia.titulo.replace(/(\r\n|\n|\r)/gm, ' ');
            const descripcionSinSaltos = noticia.descripcion.replace(/(\r\n|\n|\r)/gm, ' ');
            const row = worksheet.addRow({
                titulo: tituloSinSaltos,
                descripcion: descripcionSinSaltos,
                fecha: noticia.fecha,
                fuente: noticia.fuente,
                prioridad: noticia.prioridad,
                enlace: 'Ver enlace'
                //{text: 'Ver enlace', hyperlink: noticia.enlace}
            });
            const prioridadCell = row.getCell('prioridad');
            if (prioridadCell.value && prioridadStyles[prioridadCell.value]) {
                prioridadCell.fill = prioridadStyles[prioridadCell.value].fill;
            }
        });
    };
    estilizarHoja = (worksheet) => {
        worksheet.getRow(1).eachCell(cell => {
            cell.font = {bold: true};
            cell.border = {
                top: {style: 'thin'},
                left: {style: 'thin'},
                bottom: {style: 'thin'},
                right: {style: 'thin'}
            };
            cell.alignment = {vertical: 'middle', horizontal: 'center', wrapText: true};
        });
        worksheet.columns.forEach((column, index) => {
            if (index >= 2 && index <= 5) {
                column.eachCell({includeEmpty: true}, (cell) => {
                    cell.alignment = {vertical: 'middle', horizontal: 'center', wrapText: true};
                    cell.border = {
                        top: {style: 'thin'},
                        left: {style: 'thin'},
                        bottom: {style: 'thin'},
                        right: {style: 'thin'}
                    };
                    cell.textWrap = true;
                });
            } else {
                column.eachCell({includeEmpty: true}, (cell) => {
                    cell.alignment = {wrapText: true};
                    cell.border = {
                        top: {style: 'thin'},
                        left: {style: 'thin'},
                        bottom: {style: 'thin'},
                        right: {style: 'thin'}
                    };
                    cell.textWrap = true;
                });
            }
        });
    };
    crearGraficos = async (workbook, worksheetCalculos, noticiasOrdenadas) => {
        const prioridadesRepetidas = {};
        noticiasOrdenadas.forEach(noticia => {
            prioridadesRepetidas[noticia.prioridad] = (prioridadesRepetidas[noticia.prioridad] || 0) + 1;
        });
        const fuenteCounts = {};
        noticiasOrdenadas.forEach(noticia => {
            fuenteCounts[noticia.fuente] = (fuenteCounts[noticia.fuente] || 0) + 1;
        });
        const etiquetaCounts = {};
        noticiasOrdenadas.forEach(noticia => {
            noticia.etiquetas.forEach(etiqueta => {
                if (etiqueta.descripcion !== 'Costa Rica') {
                    etiquetaCounts[etiqueta.descripcion] = (etiquetaCounts[etiqueta.descripcion] || 0) + 1;
                }
            });
        });
        const canvasPie = document.createElement('canvas');
        canvasPie.style.position = 'absolute';
        canvasPie.style.left = '-9999px';
        Chart.defaults.font.size = 20;
        const ctxPie = canvasPie.getContext('2d');
        const myPieChart = new Chart(ctxPie, {
            type: 'pie',
            data: {
                labels: Object.keys(prioridadesRepetidas),
                datasets: [{
                    label: 'Frecuencia de Prioridades',
                    data: Object.values(prioridadesRepetidas),
                    backgroundColor: [
                        'rgb(218,149,149)',
                        'rgb(255,230,153)',
                        'rgb(194,214,153)',
                    ],
                    borderColor: [
                        'rgb(255,255,255)',
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                animation: false,
                plugins: {
                    datalabels: {
                        formatter: (value, ctx) => {
                            const total = ctx.dataset.data.reduce((acc, val) => acc + val, 0);
                            const percentage = value / total * 100;
                            return percentage.toFixed(2) + "%";
                        },
                        color: '#000000',
                        font: {
                            size: 36,
                        }
                    },
                    legend: {
                        display: true,
                        labels: {
                            font: {
                                size: 40,
                                weight: 'bold'
                            }
                        }
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
        const chartContainerPie = document.createElement('div');
        chartContainerPie.appendChild(canvasPie);
        document.body.appendChild(chartContainerPie);
        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.left = '-9999px';
        const canvasBarEtiquetas = document.createElement('canvas');
        canvasBarEtiquetas.style.position = 'absolute';
        canvasBarEtiquetas.style.left = '-9999px';
        const ctxBarEtiquetas = canvasBarEtiquetas.getContext('2d');
        const myBarChartEtiquetas = new Chart(ctxBarEtiquetas, {
            type: 'bar',
            data: {
                labels: Object.keys(etiquetaCounts),
                datasets: [{
                    label: 'Frecuencia de Etiquetas',
                    data: Object.values(etiquetaCounts),
                    backgroundColor: 'rgb(72,74,89)',
                    borderColor: 'rgb(213,178,117)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                animation: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            font: {
                                size: 24,
                                weight: 'bold'
                            }
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                size: 24,
                                weight: 'bold'
                            }
                        }
                    }
                }
            },
            plugins: [{
                beforeDraw(chart) {
                    const {ctx, canvas} = chart;
                    ctx.save();
                    ctx.fillStyle = '#FFF';
                    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
                    ctx.restore();
                },
            }]
        });
        const ctx = canvas.getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(fuenteCounts),
                datasets: [{
                    label: 'Frecuencia de Fuentes',
                    data: Object.values(fuenteCounts),
                    backgroundColor: 'rgb(72,74,89)',
                    borderColor: 'rgb(213,178,117)',
                    borderWidth: 2
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                animation: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            font: {
                                size: 24,
                                weight: 'bold'
                            }
                        }
                    },
                    x: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            },
            plugins: [{
                beforeDraw(chart) {
                    const {ctx, canvas} = chart;
                    ctx.save();
                    ctx.fillStyle = '#FFF';
                    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
                    ctx.restore();
                },
            }]
        });
        const chartContainerBarEtiquetas = document.createElement('div');
        chartContainerBarEtiquetas.appendChild(canvasBarEtiquetas);
        document.body.appendChild(chartContainerBarEtiquetas);

        await new Promise(resolve => setTimeout(resolve, 200));

        const imageBarEtiquetas = canvasBarEtiquetas.toDataURL("image/png").split(';base64,')[1];
        const imageIdBarEtiquetas = workbook.addImage({
            base64: imageBarEtiquetas,
            extension: 'png',
        });
        worksheetCalculos.addImage(imageIdBarEtiquetas, {
            tl: {col: 12, row: 30},
            ext: {width: 800, height: 500}
        });
        const chartContainer = document.createElement('div');
        chartContainer.appendChild(canvas);
        document.body.appendChild(chartContainer);
        await new Promise(resolve => setTimeout(resolve, 200));
        const image = canvas.toDataURL("image/png").split(';base64,')[1];
        const imageId = workbook.addImage({
            base64: image,
            extension: 'png',
        });
        worksheetCalculos.addImage(imageId, {
            tl: {col: 2, row: 1},
            ext: {width: 1000, height: 500}
        });
        const imagePie = canvasPie.toDataURL("image/png").split(';base64,')[1];
        const imageIdPie = workbook.addImage({
            base64: imagePie,
            extension: 'png',
        });
        worksheetCalculos.addImage(imageIdPie, {
            tl: {col: 21, row: 2},
            ext: {width: 500, height: 500}
        });
        chartContainerBarEtiquetas.removeChild(canvasBarEtiquetas);
        chartContainer.removeChild(canvas);
        chartContainerPie.removeChild(canvasPie);
    };
    guardarArchivo = async (workbook) => {
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), 'noticias_seleccionadas.xlsx');
    };

    obtenerFormatoImagen(url) {
        var extension = url.split('.').pop().toLowerCase();
        switch (extension) {
            case 'jpg':
            case 'jpeg':
                return 'JPEG';
            case 'png':
                return 'PNG';
            case 'gif':
                return 'GIF';
            case 'webp':
                return 'WEBP';
            default:
                return 'JPEG';
        }
    }

    convertirWebpAFormato(urlWebp, formato) {
        return new Promise((resolve, reject) => {
            var img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = function () {
                var canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                var imageDataURL = canvas.toDataURL('image/' + formato);
                resolve(imageDataURL);
            };
            img.onerror = function () {
                reject(new Error('Error al cargar la imagen'));
            };
            img.src = urlWebp;
        });
    }

    async obtenerImagenBase64(url) {
        const proxyUrls = [
            'https://corsproxy.io/?',
            `${backend}/proxy/img?url=`
        ];
        for (const proxyUrl of proxyUrls) {
            try {
                const response = await fetch(proxyUrl + url);
                if (!response.ok) {
                    throw new Error('Error en la solicitud');
                }
                const blob = await response.blob();
                const reader = new FileReader();
                return new Promise((resolve, reject) => {
                    reader.readAsDataURL(blob);
                    reader.onloadend = () => {
                        resolve(reader.result);
                    };
                    reader.onerror = reject;
                });
            } catch (error) {
                continue;
            }
        }
        throw new Error('No se pudo obtener la imagen');
    }

    emptyEntity = () => {
        var entity = '';
        return entity;
    }
    reset = () => {
        this.state.entity = this.emptyEntity();
    }
    deleteNoticia = async (event) => {
        event.preventDefault();
        cambio = true;

        const entityId = this.deleteEntity;
        const usuario = localStorage.getItem('usuario');

        const requestUrl = `${backend}/NoticiasMarcadas/ExternaDelete/${entityId}/${usuario}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const response = await fetch(requestUrl, requestOptions);
            if (response.ok) {
                this.hideModalBorrar();
                this.cargarBiblioteca();
                this.showModalSuccessBorrar();
            } else {
                this.hideModalBorrar();
                this.showModalErrorBorrar();
            }
        } catch (error) {
            console.error("Error al eliminar la entidad:", error);
        }
    }
}
