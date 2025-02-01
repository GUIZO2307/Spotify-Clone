const searchInput = document.getElementById("search-input");
const resultArtist = document.getElementById("result-artist");
const resultPlaylist = document.getElementById("result-playlists");

function requestApi(searchTerm) {
  const url = `http://localhost:3000/artists?name_like=${searchTerm}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      return response.json();
    })
    .then((result) => displayResults(result, searchTerm))
    .catch((error) => console.error("Erro ao buscar API:", error));
}

function displayResults(result, searchTerm) {
  resultPlaylist.classList.add("hidden");
  resultArtist.classList.remove("hidden");

  // Garantir que o grid-container existe antes de manipulá-lo
  const gridContainer = document.querySelector(".grid-container");
  if (!gridContainer) {
    console.error("Erro: grid-container não encontrado.");
    return;
  }

  gridContainer.innerHTML = ""; // Limpar os resultados anteriores

  const filteredArtists = result.filter((artist) =>
    artist.name?.toLowerCase().includes(searchTerm)
  );

  if (filteredArtists.length === 0) {
    gridContainer.innerHTML = "<p>Nenhum artista encontrado</p>";
    return;
  }

  filteredArtists.forEach((artist) => {
    const artistCard = document.createElement("div");
    artistCard.classList.add("artist-card");

    artistCard.innerHTML = `
      <div class="card-img">
        <img class="artist-img" src="${
          artist.urlImg || "default-image.jpg"
        }" alt="${artist.name || "Artista"}" />
        <div class="play">
          <span class="fa fa-solid fa-play"></span>
        </div>
      </div>
      <div class="card-text">              
        <span class="artist-name">${artist.name || "Desconhecido"}</span>
        <span class="artist-categorie">Artista</span>
      </div>
    `;
    gridContainer.appendChild(artistCard);
  });
}

// Adicionando o event listener diretamente no searchInput
searchInput.addEventListener("input", function () {
  const searchTerm = searchInput.value.toLowerCase().trim();

  if (searchTerm === "") {
    resultPlaylist.classList.remove("hidden");
    resultArtist.classList.add("hidden");
    return;
  }

  requestApi(searchTerm);
});
