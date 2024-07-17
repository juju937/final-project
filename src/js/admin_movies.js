// добавить фильм
const addMovieButton = document.querySelector(".admin__button_movie");
const movieSeancesWrapper = document.querySelector(".movie-seances__wrapper");

// popup "Добавить фильм"

addMovieButton.addEventListener("click", () => {
  popupMovieAdd.classList.remove("hidden");
})

const popupMovieAdd = document.querySelector(".popup__movie_add");
const formAddMovie = document.querySelector(".popup__form_add-movie");
const inputMovieName = document.querySelector(".add-movie_name_input");
const inputMovieTime = document.querySelector(".add-movie_time_input");
const inputMovieSynopsis = document.querySelector(".add-movie_synopsis_input");
const inputMovieCountry = document.querySelector(".add-movie_country_input");

const buttonPosterAdd = document.querySelector(".input_add_poster");

let posterFile;

function addMovie(posterFile) {
  const formData = new FormData();
  let numbDuration = Number(inputMovieTime.value);

  formData.set("filmName", `${inputMovieName.value}`);
  formData.set("filmDuration", `${numbDuration}`);
  formData.set("filmDescription", `${inputMovieSynopsis.value}`);
  formData.set("filmOrigin", `${inputMovieCountry.value}`);
  formData.set("filePoster", posterFile);

  fetch("https://shfe-diplom.neto-server.ru/film", {
    method: "POST",
    body: formData
  })
    .then(response => response.json())
    .then(function(data) {
      console.log(data);
      alert(`Фильм ${inputMovieName.value} добавлен!`);
      location.reload();  
    })
}

// удалить фильм

function deleteMovie(movieId) {
  fetch(`https://shfe-diplom.neto-server.ru/film/${movieId}`, {
    method: "DELETE",
  })
  .then(response => response.json())
  .then(function(data) {
    console.log(data);
    alert(`Фильм ${movieId} удален!`);
    location.reload();
  })
}

// загрузить постер

buttonPosterAdd.addEventListener("change", event => {
  event.preventDefault();
  let fileSize = buttonPosterAdd.files[0].size;

  if(fileSize > 3000000) {
    alert("Размер файла должен быть не более 3 Mb!");
  } else {
    posterFile = buttonPosterAdd.files[0];
  }
})

// добавить фильм

formAddMovie.addEventListener("submit", (e) => {
  e.preventDefault();
  if (posterFile === undefined) {
    alert("Загрузите постер!");
    return;
  } else {
  addMovie(posterFile);
  }
})

// удалить фильм

let movieId;

movieSeancesWrapper.addEventListener("click", (e) => {  
  if(e.target.classList.contains("movie-seances__movie_delete")) {
    movieId = e.target.closest(".movie-seances__movie").dataset.id;
    deleteMovie(movieId);
  } else {
    return;
  }
}) 

// отображение фильмов

function moviesOperations(data) {
  let movieCount = 1;

  for(let i = 0; i < data.result.films.length; i++) {
    movieSeancesWrapper.insertAdjacentHTML("beforeend", `
    <div class="movie-seances__movie background_${movieCount}" data-id="${data.result.films[i].id}" draggable="true" >
              <img src="${data.result.films[i].film_poster}" alt="постер" class="movie-seances__movie_poster">

              <div class="movie-seances__movie_info">
                  <p class="movie_info-title">${data.result.films[i].film_name}</p>
                  <p class="movie_info-length"><span class="movie_info-time">${data.result.films[i].film_duration}</span> минут</p> 
              </div>
              
              <span class="admin__button_remove movie-seances__movie_delete"></span>
            </div>
    `);

    movieCount++;

    if (movieCount > 5) {
      movieCount = 1;
    }  
  }
}