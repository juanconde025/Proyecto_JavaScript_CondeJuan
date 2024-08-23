// Array para almacenar los recursos
let resources = [];

// Selecciona los elementos del DOM
const resourceForm = document.getElementById('resourceForm');
const resourceList = document.getElementById('resourceList');

// Función para renderizar la lista de recursos
function renderResources() {
    resourceList.innerHTML = '';
    resources.forEach((resource, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            ${resource.title} (${resource.gender}) - <strong>${resource.plataform}</strong> ${resource.format} ${resource.date} ${resource.state} 
            <div>
                ${renderStars(resource.rating)}
                <button class="btn btn-sm btn-warning me-2" onclick="editResource(${index})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="deleteResource(${index})">Eliminar</button>
            </div>
        `;
        resourceList.appendChild(li);
    });
}

// Función para añadir un recurso
resourceForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const gender = document.getElementById('gender').value;
    const plataform = document.getElementById('plataform').value;
    const format = document.getElementById('format').value;
    const date = document.getElementById('date').value;
    const state = document.getElementById('state').value;

    const resource = { title, gender, plataform, format, date, state, rating: selectedRating };
    resources.push(resource);

    renderResources();
    resourceForm.reset();
    updateStarRating(0); // Reinicia las estrellas
    selectedRating = 0;
});

// Función para eliminar un recurso
function deleteResource(index) {
    resources.splice(index, 1);
    renderResources();
}

// Función para editar un recurso
function editResource(index) {
    const resource = resources[index];
    document.getElementById('title').value = resource.title;
    document.getElementById('gender').value = resource.gender;
    document.getElementById('plataform').value = resource.plataform;
    document.getElementById('format').value = resource.format;
    document.getElementById('date').value = resource.date;
    document.getElementById('state').value = resource.state;
    document.getElementById('rating').value = resource.rating;

    resources.splice(index, 1);
    renderResources();
}

let selectedRating = 0; // Variable para almacenar la valoración seleccionada

// Añadir un Event Listener para cada estrella
document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', function() {
        selectedRating = this.getAttribute('data-value');
        updateStarRating(selectedRating);
    });
});

// Función para actualizar el estado de las estrellas
function updateStarRating(rating) {
    document.querySelectorAll('.star').forEach(star => {
        if (star.getAttribute('data-value') <= rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}


// Función para renderizar las estrellas de la valoración
function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<span class="star ${i <= rating ? 'active' : ''}">&#9733;</span>`;
    }
    return stars;
}