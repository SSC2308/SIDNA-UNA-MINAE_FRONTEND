var globalstate = {user: null};  //ojo

var app;

function loaded() {
    app = new App();
    document.querySelector('#root').replaceChildren(app.dom);  //remplaza el root con lo que tiene el dom de app.
}

document.addEventListener("DOMContentLoaded", loaded);

function errorMessage(code) {
    alert(`Error. Status: ${code}`);
}