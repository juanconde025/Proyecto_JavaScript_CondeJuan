let resources = [];

const resourceForm = document.getElementById('resourceForm');
const resourceList = document.getElementById('resourceList');

function loadResources() {
    const storedResources = localStorage.getItem('resources');
    if (storedResources) {
        resources = JSON.parse(storedResources);
        renderResources();
        fetchImagesAndRender();
    } else {
        fetchImagesAndRender();
    }
}

function fetchImagesAndRender() {
    fetch('https://66cddf808ca9aa6c8ccc01bc.mockapi.io/movies-series')
        .then(response => response.json())
        .then(data => {
                resources = resources.map(resource => {
                    const matchedResource = data.find(item => item.title.toLowerCase() === resource.title.toLowerCase());
                    if (matchedResource) {
                        resource.image = matchedResource.image;
                    } else {
                        resource.image = 'https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2Fff459c11-2526-48bd-bcc9-02394f806966_686x1083.png'; 
                    }
                    return resource;
                });
                renderResources();
                saveResources();
        })
        .catch(error => console.error(error));
}

function saveResources() {
    localStorage.setItem('resources', JSON.stringify(resources));
}

function renderResources() {
    resourceList.innerHTML = '';
    resources.forEach((resource, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';

        let progressValue = 0;
        if (resource.state === 'en-progreso') {
            progressValue = 50;
        } else if (resource.state === 'terminado') {
            progressValue = 100;
        }

        li.innerHTML = `
            <div class="card mb-3 shadow-sm">
                <div class="row g-0">
                    <div class="col-md-4 d-flex align-items-center justify-content-center bg-light">
                    <img src="${resource.image}" alt="${resource.title}" class="img-fluid p-3">
                        <div class="text-center p-3">
                            <h5 class="card-title">${resource.title}</h5>
                            <p class="card-text"><span class="badge bg-secondary text-capitalize">${resource.gender}</span></p>
                            <p class="card-text"><strong>Plataforma:</strong> ${resource.plataform}</p>
                            <p class="card-text"><strong>Formato:</strong> ${resource.format}</p>
                            <p class="card-text"><strong>Fecha:</strong> ${resource.date}</p>
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <div>
                                    <p class="card-text mb-1"><strong>Estado:</strong> ${formatState(resource.state)}</p>
                                    <div class="progress" role="progressbar" aria-label="Progreso" aria-valuenow="${progressValue}" aria-valuemin="0" aria-valuemax="100">
                                        <div class="progress-bar progress-bar-striped ${getProgressBarClass(resource.state)}" style="width: ${progressValue}%"></div>
                                    </div>
                                </div>
                                <div>
                                    ${renderStars(resource.rating)}
                                </div>
                            </div>
                            <p class="card-text mt-3"><strong>Reseña:</strong></p>
                            <p class="card-text">${resource.review || 'Sin reseña disponible.'}</p>
                            <div class="d-flex justify-content-end mt-3">
                                <a href="#resourceForm"><button class="btn btn-sm btn-warning me-2" onclick="editResource(${index})">Editar</button></a>
                                <button class="btn btn-sm btn-danger" onclick="deleteResource(${index})">Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        resourceList.appendChild(li);
    });
}

function formatState(state) {
    switch(state) {
        case 'en-progreso':
            return 'En Progreso';
        case 'terminado':
            return 'Terminado';
        case 'pendiente':
            return 'Pendiente';
        default:
            return state;
    }
}

function getProgressBarClass(state) {
    switch(state) {
        case 'en-progreso':
            return 'bg-info';
        case 'terminado':
            return 'bg-success';
        case 'pendiente':
            return 'bg-secondary';
        default:
            return 'bg-secondary';
    }
}

function isValidEndDate(date) {
    if (!date) return true;
    const today = new Date();
    const endDate = new Date(date);
    return endDate <= today;
}

resourceForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const gender = document.getElementById('gender').value;
    const plataform = document.getElementById('plataform').value;
    const format = document.getElementById('format').value;
    const date = document.getElementById('date').value;
    const state = document.getElementById('state').value;
    const review = document.getElementById('review').value;

    if (!isValidEndDate(date)) {
        alert('La fecha de terminación no puede ser una fecha futura.');
        return;
    }else if(state === 'en-progreso' && date){
        alert('No puedes poner una fecha si el contenido no esta terminado');
        return;
    }else if(state === 'terminado' && !date){
        alert('Si has agregado un contenido deberías ponerle fecha');
        return;
    }else if(state === 'pendiente' && date){
        alert('No puedes poner una fecha si el contenido no esta terminado')
    }

    const resource = { 
        title, 
        gender, 
        plataform, 
        format, 
        date, 
        state, 
        rating: selectedRating,
        review
    };
    resources.push(resource);

    renderResources();
    saveResources(); 
    resourceForm.reset();
    updateStarRating(0); 
    selectedRating = 0;

    document.getElementById('copy').scrollIntoView({ behavior: 'smooth' });
});

function deleteResource(index) {
    resources.splice(index, 1);
    renderResources();
    saveResources(); 
}

function editResource(index) {
    const resource = resources[index];
    document.getElementById('title').value = resource.title;
    document.getElementById('gender').value = resource.gender;
    document.getElementById('plataform').value = resource.plataform;
    document.getElementById('format').value = resource.format;
    document.getElementById('date').value = resource.date;
    document.getElementById('state').value = resource.state;
    document.getElementById('review').value = resource.review || '';
    selectedRating = resource.rating;
    updateStarRating(selectedRating);

    resources.splice(index, 1);
    renderResources();
    saveResources(); 
}

let selectedRating = 0; 

document.querySelectorAll('#rating .star').forEach(star => {
    star.addEventListener('click', function() {
        selectedRating = parseInt(this.getAttribute('data-value'));
        updateStarRating(selectedRating);
    });
});

function updateStarRating(rating) {
    document.querySelectorAll('#rating .star').forEach(star => {
        if (parseInt(star.getAttribute('data-value')) <= rating) {
            star.classList.add('text-warning');
            star.classList.remove('text-muted');
        } else {
            star.classList.add('text-muted');
            star.classList.remove('text-warning');
        }
    });
}

function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<span class="star fs-5 ${i <= rating ? 'text-warning' : 'text-muted'}">&#9733;</span>`;
    }
    return stars;
}

const filterForm = document.getElementById('filterForm');
const filterState = document.getElementById('filterState');
const filterFormat = document.getElementById('filterFormat');
const filterPlataform = document.getElementById('filterPlataform');
const searchTitle = document.getElementById('searchTitle');
const resourceFilter = document.getElementById('resourceFilter');


filterForm.addEventListener('submit', function(event) {
    event.preventDefault();
    filterResources();
});

function filterResources() {
    const filteredResources = resources.filter(resource => {
        const stateMatch = filterState.value === '' || resource.state === filterState.value;
        const formatMatch = filterFormat.value === '' || resource.format === filterFormat.value;
        const plataformMatch = filterPlataform.value === '' || resource.plataform === filterPlataform.value;
        const titleMatch = resource.title.toLowerCase().includes(searchTitle.value.toLowerCase());

        return stateMatch && formatMatch && plataformMatch && titleMatch;
    });

    renderFilteredResources(filteredResources);
}

function renderFilteredResources(filteredResources) {
    resourceFilter.innerHTML = '';
    filteredResources.forEach((resource, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';

        let progressValue = 0;
        if (resource.state === 'en-progreso') {
            progressValue = 50;
        } else if (resource.state === 'terminado') {
            progressValue = 100;
        }

        li.innerHTML = `
            <div class="card mb-3 shadow-sm">
                <div class="row g-0">
                    <div class="col-md-4 d-flex align-items-center justify-content-center bg-light">
                    <img src="${resource.image}" alt="${resource.title}" class="img-fluid p-3">
                        <div class="text-center p-3">
                            <h5 class="card-title">${resource.title}</h5>
                            <p class="card-text"><span class="badge bg-secondary text-capitalize">${resource.gender}</span></p>
                            <p class="card-text"><strong>Plataforma:</strong> ${resource.plataform}</p>
                            <p class="card-text"><strong>Formato:</strong> ${resource.format}</p>
                            <p class="card-text"><strong>Fecha:</strong> ${resource.date}</p>
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <div>
                                    <p class="card-text mb-1"><strong>Estado:</strong> ${formatState(resource.state)}</p>
                                    <div class="progress" role="progressbar" aria-label="Progreso" aria-valuenow="${progressValue}" aria-valuemin="0" aria-valuemax="100">
                                        <div class="progress-bar progress-bar-striped ${getProgressBarClass(resource.state)}" style="width: ${progressValue}%"></div>
                                    </div>
                                </div>
                                <div>
                                    ${renderStars(resource.rating)}
                                </div>
                            </div>
                            <p class="card-text mt-3"><strong>Reseña:</strong></p>
                            <p class="card-text">${resource.review || 'Sin reseña disponible.'}</p>
                            <div class="d-flex justify-content-end mt-3">
                                <a href="#resourceForm"><button class="btn btn-sm btn-warning me-2" onclick="editResource(${index})">Editar</button></a>
                                <button class="btn btn-sm btn-danger" onclick="deleteResource(${index})">Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        resourceFilter.appendChild(li);
    });
}



window.onload = loadResources;
