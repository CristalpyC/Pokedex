// scripts.js
const pokedexContainer = document.getElementById('pokedexContainer');
const searchInput = document.getElementById('searchInput');
const modalContent = document.getElementById('modalContent');
const pokemonModal = document.getElementById('pokemonModal');

const itemsPerPage = 15;

async function fetchInitialPokemon() {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${itemsPerPage}`);
    const data = await response.json();
    const initialPokemonList = await Promise.all(data.results.map(pokemon => fetchPokemonData(pokemon.name)));
    return initialPokemonList;
}

function showNotFoundMessage() {
    // Verificar si ya hay un mensaje y evitar la duplicación
    const existingMessage = document.querySelector('.not-found-message');
    if (!existingMessage) {
        const notFoundMessage = document.createElement('div');
        notFoundMessage.classList.add('not-found-message');
        notFoundMessage.innerHTML = `<img src="https://i.pinimg.com/originals/b8/dd/59/b8dd59733418a869a53f44b2e439eacd.gif">`;
        pokedexContainer.appendChild(notFoundMessage);
    }
}

async function initializePokedex() {
    const initialPokemonList = await fetchInitialPokemon();
    populatePokedex(initialPokemonList, false);
}

async function searchPokemon() {
    const searchTerm = searchInput.value.toLowerCase();
    const initialPokemonList = await fetchInitialPokemon();
    const filteredPokemon = initialPokemonList.filter(pokemon => pokemon.name.toLowerCase().includes(searchTerm));

    if (filteredPokemon.length === 0) {
        // Si no se encuentra ningún Pokémon, muestra el mensaje decorado
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('not-found-message');
        errorMessage.innerHTML = `<img src="https://i.pinimg.com/originals/b8/dd/59/b8dd59733418a869a53f44b2e439eacd.gif">`;
        container.appendChild(errorMessage);
    } else {
        // Si se encuentra Pokémon, muestra la lista
        populatePokedex(filteredPokemon, false);
    }
}

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
            category: speciesData.genera.find(genus => genus.language.name === 'en').genus,
            gender: getGenderIcon(speciesData.gender_rate),
        };
    } catch (error) {
        console.error('Error fetching Pokemon data:', error);
        return null;
    }
}

function getGenderIcon(genderRate) {
    if (genderRate === -1) {
        return '♦'; // Icono para Pokémon sin género
    } else {
        const femaleIcon = '<span class="femaleGender">♀</span>';
        const maleIcon = '<span class="mascGender">♂</span>';
        return `${maleIcon}/${femaleIcon}`;
    }
}

function populatePokedex(pokemonList, append) {
    // Limpiar mensajes anteriores
    //clearMessages();

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

/*function clearMessages() {
    // Limpiar mensajes anteriores
    const notFoundMessage = document.querySelector('.not-found-message');
    if (notFoundMessage) {
        notFoundMessage.remove();
    }
}*/

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

function closeModal() {
    pokemonModal.style.display = 'none';
    modalContent.innerHTML = '';
}

searchInput.addEventListener('input', searchPokemon);

initializePokedex();

