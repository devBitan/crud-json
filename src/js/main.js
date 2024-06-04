import '../scss/styles.scss' // Import our custom CSS
import * as bootstrap from 'bootstrap' // Import all of Bootstrap's JS

// crear viriable del end-point (json-server)
const URL = 'http://localhost:3000/notes';

// capturar la información del formulario 
const form = document.querySelector("form");
const title = document.querySelector("#title");
const comment = document.querySelector("#comment");

// traer la etiqueta donde voy a injectar información
const tbody = document.querySelector("tbody");

//crear la bandera para crear o actualizar
let idUpdate;


getData() //llamar la función para injectar los datos de la base de datos en el html


//crear función para añadir nuevas notas (CREATE)
async function createDAta(title, comment) {
    //acá necesito enviarle la información CORRECTA al json
    //crear el objeto que representa la información que existe en el formulario
    const noteNew = {
        title: title?.value,
        comment: comment?.value,
        status: 'active'
    }
    console.log(noteNew);
    // usar la información obtenida en el formulario para enviarla
    // fecth recibe la url y el objeto con los datos tanto para admitior la info y guardarla
    await fetch(URL, {
        method: "POST", // indicamos que método va a suar fecth
        headers: { // indicamos que le vamos a enviar, es decir, contenido json
            "Content-Type": "application/json"
        },
        body: JSON.stringify(noteNew) // convertimos el objeto de js en un dato de tipo json
    })
    await getData()
}

//crear  función para obtener la info (READ)
async function getData() {
    const respuestaJson = await fetch(URL) // le decimos a fetch que nos traiga la info de la base de datos
    const data = await respuestaJson.json() // convertimos la info que viene en formato json en uno que permita trabajar en javascript (objetos, arreglos,string,)
    console.log(data); //validamos si la info existe

    //injectar información en el html
    tbody.innerHTML = "" // limpiar el contenido de la etiqueta llamada del html cuando hay contendio quemando en el html
    data.forEach((note) => { // recorremos la info para injectar el contenido en el html (data es un arreglo de objetos, entonces con el ciclo, se recorre cada objeto)
        tbody.innerHTML += `
                <td>${note.id}</td>
                <td>${note.title}</td>
                <td>${note.comment}</td>
                <td>${note.status}</td>
                <td>
                    <button type="button" data-id=${note.id} class="btn btn-warning">Edit</button>
                    <button type="button" data-id=${note.id} class="btn btn-danger">Delete</button>
                    <button type="button" data-id=${note.id} class="btn btn-info">Status</button>
                </td>
            `;
    });
    // note: representa cada objeto existente en la variable "data"
}

// crear funcion para actualizar (UPDATE)
async function updateData(idUpdate, title, comment) {
    // crear el objeto que representa la informacion que se va a actualizar
    const infoUpdate = {
        title: title.value,
        comment: comment.value,
        status: 'active'
    }
    //usar la info modificada y enviarla para actualizarla
    //fetch recibe la url, el id y el objeto con la info modificada
    await fetch(`${URL}/${idUpdate}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(infoUpdate) 
    })
    await getData()
}

//crear la función eliminar  (DELETE)
async function deleteData(parametro) { // recibimos el argumento (que es el id de la nota que quiero eliminar)
    await fetch(`${URL}/${parametro}`, { // le indicamos que info se va a eliminar de la base de datos por medio de su id
        method: "DELETE", // le indicamos el metodo para enviarle en la url el id
        headers: { 
            "Content-Type": "application/json", // sabes que contenido estoy suando 
        }
    })
    await getData() // llamar de nuevo la obtención de datos para que me muestre la info actualizada sin el elemento eliminado
}

//crear funcion modificar unicamente un dato (PATCH)
async function disableNote(id) { // funcuion deshabilitar una nota
    const response = await fetch(`${URL}/${id}`); // le enviamos por query parametros que busque ese ID
    const data = await response.json(); // si encuentra el ID, retorne el objeto de ese ID (la nota, es decir, title y coment)
    const newStatus = data.status === 'active' ? 'disabled' : 'active'; // se cambiem de manera alternada

    const infoUpdate = { // creamos el objeto para enviar la info que se va a actualizar
        status: newStatus
    }
    await fetch(`${URL}/${id}`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(infoUpdate)
    })
    await getData()
}


form.addEventListener("submit", async function (e) { //colocamos un escuchador de eventos al button tipo submit que eniviara la informacion que contiene el formulario 
    e.preventDefault() 
    if (idUpdate === undefined) { //crear
        await createDAta(title, comment) 
        form.reset()
    } else { // actualizar
        await updateData(idUpdate, title, comment)
        idUpdate = undefined
        form.reset()
    }
})

tbody.addEventListener("click", async function (e) { //colocamos un escuchador de eventos al boton de eliminar
    // e.preventDefault() 
    if (e.target.classList.contains("btn-danger")) {
        const elementoTargetado = e.target.getAttribute("data-id")
        console.log(elementoTargetado); // validar si estoy capturando el target
        await deleteData(elementoTargetado)
    }
})

tbody.addEventListener("click", async function (e) { //colocamos un escuchador de eventos al boton de actualizar
    if (e.target.classList.contains("btn-warning")) {
        idUpdate = e.target.getAttribute("data-id")
        const response = await fetch(`${URL}/${idUpdate}`)
        const data = await response.json()
        title.value = data.title
        comment.value = data.comment
    }
}) 

tbody.addEventListener("click", async function (e) { // evento para camiar el estatus
    if (e.target.classList.contains("btn-info")) {
        const id = e.target.getAttribute("data-id")
        await disableNote(id)
    }
})





