//variables globales
//CRISTAL TAVAREZ (2021-1859)
const pokedexContainer = document.getElementById('pokedexContainer');
const searchInput = document.getElementById('searchInput');
const modalContent = document.getElementById('modalContent');
const pokemonModal = document.getElementById('pokemonModal');

const pokemonsNum = 15;

//Funciones
//Realiza una solicitud a la API de PokeAPI para obtener una lista inicial de Pokémon.
async function fetchInitialPokemon() {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${pokemonsNum}`);
    const data = await response.json();
    const initialPokemonList = await Promise.all(data.results.map(pokemon => fetchPokemonData(pokemon.name)));
    return initialPokemonList;
}


//Realiza solicitudes a la API de PokeAPI para obtener datos detallados de un Pokémon.
async function fetchPokemonData(pokemonName) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
        const data = await response.json();
        const speciesData = await speciesResponse.json();

        const types = data.types.map(type => type.type.name).join(', ');
        const stats = data.stats.map(stat => `${stat.stat.name}: ${stat.base_stat}`).join(', ');

        return {
            name: data.name,
            image: data.sprites.front_default,
            types: types,
            info: `<span>Altura:</span> ${data.height}, <span>Peso:</span> ${data.weight}`,
            stats: stats,
            category: speciesData.genera.find(genus => genus.language.name === 'es').genus,
            gender: getGenderIcon(speciesData.gender_rate),
        };
        
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        return null;
    }
}


//RAGBERT POLANCO (2022-0532)
//Retorna una imagen con signos de interrogación si la busqueda no devuelve resultados
function showNotFoundMessage() {
    // Verificar si ya hay un mensaje y evitar la duplicación
    const existingMessage = document.querySelector('.not-found-message');
    if (!existingMessage) {
        const notFoundMessage = document.createElement('div');
        notFoundMessage.classList.add('not-found-message');
        notFoundMessage.innerHTML = `<img src="https://i.gifer.com/YOPR.gif">`;
        pokedexContainer.appendChild(notFoundMessage);
    }
}


//Llena el contenedor de la Pokédex con tarjetas de Pokémon.
function populatePokedex(pokemonList, append) {
    const container = append ? pokedexContainer : document.getElementById('pokedexContainer');
    if (!append) {
        container.innerHTML = '';
    }

    pokemonList.forEach((pokemon, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="cardInfo">
                <img src="${pokemon.image}" alt="${pokemon.name}" style="margin-bottom: 0;">
                <p class="pokemonsTitle">${pokemon.name}</p>
                <p class="types">${pokemon.types}</p>
            </div>
            `;
        card.addEventListener('click', () => openModal(pokemon));
        container.appendChild(card);
        }); 
        
}

//Realiza una búsqueda de Pokémon según el término ingresado en el campo de búsqueda.
async function searchPokemon() {
    const searchTerm = searchInput.value.toLowerCase();
    const initialPokemonList = await fetchInitialPokemon();
    const filteredPokemon = initialPokemonList.filter(pokemon => pokemon.name.toLowerCase().includes(searchTerm));

    if (filteredPokemon.length === 0) {
        // Si no se encuentra ningún Pokémon, muestra la imagen
        showNotFoundMessage();
    } else {
        // Si se encuentra el Pokémon, muestra la lista
        populatePokedex(filteredPokemon, false);
    }
}

//GABRIEL MEJIA (2022-0192)
//Devuelve un icono que representa el género del Pokémon (macho, hembra o sin género).
function getGenderIcon(genderRate) {
    if (genderRate === -1) {
        return '♦'; // Icono para Pokémon sin género
    } else {
        return genderRate === 0 ? '<span class="femaleGender">♀</span>' : '<span class="mascGender">♂</span>';
    }
}

//Abre un modal que muestra información detallada sobre un Pokémon específico
async function openModal(pokemon) {
    modalContent.innerHTML = `
        <div class="modalContent">
            <h2>${pokemon.name}</h2>
            <div class="pokemonContent">
                <img src="${pokemon.image}" alt="${pokemon.name}">
                <div class="infos">
                    <p>${pokemon.info}</p>
                    <p><span>Estadísticas:</span> ${pokemon.stats}</p>
                    <p><span>Categoría:</span> ${pokemon.category}</p>
                    <p><span>Género:</span> ${pokemon.gender}</p>
                    <p><span>Tipo:</span> ${pokemon.types}</p>
                </div>
            </div>
        </div>
    `;
    const closeButton = document.createElement('button');
    closeButton.classList.add('close');
    closeButton.innerHTML = 'Cerrar';
    closeButton.onclick = closeModal;
    modalContent.appendChild(closeButton);
    pokemonModal.style.display = 'block';
}



//ARIEL CUSTODIO (2021-2054)
//Cierra el modal y elimina su contenido
function closeModal() {
    pokemonModal.style.display = 'none';
    modalContent.innerHTML = '';
}

//Ejecuta la función searchPokemon cuando se introduce texto en el campo de búsqueda
searchInput.addEventListener('input', searchPokemon);

//Inicializa la pokedex, mostrando los pokemones
async function initializePokedex() {
    const initialPokemonList = await fetchInitialPokemon();
    populatePokedex(initialPokemonList, false);
}

////Se ejecuta la función initializePokedex al cargar la página para cargar inicialmente la lista de Pokémon
initializePokedex();