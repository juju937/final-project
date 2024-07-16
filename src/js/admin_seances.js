// Сетка сеансов
let timelineSeances;
let timelineMovies;
let selectedMovie;
let selectedHall;

let hallSeances;
let seanceTimeStart;
let seanceTimeEnd;
let currentSeancesDuration;
let currentSeancesStart;
let currentSeanceTimeStart;
let currentSeancesTimeEnd;

let seanseAllowed = false;

// Кнопки

let movieSeancesCancel;
let movieSeancesSave;

// popup Добавление сеанса

const popupSeanceAdd = document.querySelector(".popup__seance_add");
const formAddSeance = document.querySelector(".popup__form_add-seance");
const selectSeanceHall = document.querySelector(".select__add-seance_hall");
let optionHallName;
let optionMovieName;
const selectSeanceMovie = document.querySelector(".select__add-seance_movie");
const inputSeanceTime = document.querySelector(".add-seans__input_time");
let checkedHallId;
let checkedMovieId;
let checkedMovieName;
let checkedMovieDuration;
let checkedSeanceTime;
let seanceCancelButton;

// popup Удаление сеанса

const popupSeanceRemove = document.querySelector(".popup__seance_remove");
let seanceRemoveTitle;
let seanceDeleteButton;
let seanceRemoveCancelButton;

// Удаление сеансов

let selectSeances;
let selectDelete;

let selectedSeance;
let selectedSeanceId;
let selectTimeline;
let selectedHallId;
let selectedMovieName;

let deletedSeances = [];
let filterDeletedSeances = [];

// Загрузка сеансов

function loadSeances(data) {
  timelineSeances.forEach(timeline => {
    timeline.innerHTML = "";

    for(let i = 0; i < data.result.seances.length; i++) {
      let movieSeanseId = data.result.films.findIndex(element => element.id === Number(data.result.seances[i].seance_filmid));
      
      if(Number(timeline.dataset.id) === data.result.seances[i].seance_hallid) {
        timeline.insertAdjacentHTML("beforeend", `
        <div class="timeline__seances_movie" data-filmid="${data.result.seances[i].seance_filmid}" data-seanceid="${data.result.seances[i].id}" draggable="true">
          <p class="timeline__seances_title">${data.result.films[movieSeanseId].film_name}</p>
          <p class="timeline__movie_start" data-duration="${data.result.films[movieSeanseId].film_duration}">${data.result.seances[i].seance_time}</p>
        </div>
        `);
      }
    }
    
  })

  // Загрузка фона сеансов

  setMovieBackground();

  // Позиционирование сеансов
  
  positionSeance();

  // Отслеживание изменения ширины окна

  window.addEventListener("resize", event => {
    positionSeance();
  })

  // Кнопка Отмена под сеткой сеансов

  movieSeancesCancel = document.querySelector(".movie-seances__batton_cancel");

  movieSeancesCancel.addEventListener("click", event => {
    if(movieSeancesCancel.classList.contains("button_disabled")) {
      event.preventDefault();
    } else {
      event.preventDefault();
      deletedSeances.length = 0;
      filterDeletedSeances.length = 0;
      loadSeances(data);
    
      deleteSeance();

      movieSeancesCancel.classList.add("button_disabled");
      movieSeancesSave.classList.add("button_disabled");
    }
  })
}

// Установка цвета фона для фильмов в таймлайнах

function setMovieBackground() {
  const movies = document.querySelectorAll(".movie-seances__movie");
  let movieBackground;
  const moviesInformation = new Array();

  // Собираем массив из загруженных фильмов и сохраняем номер цвета фона в каждом

  movies.forEach(movie => {
    movieBackground = movie.classList.value.match(/\d+/)[0];

    const movieInfo = new Object();
    movieInfo.movieInfoId = movie.dataset.id;
    movieInfo.background = movieBackground;

    moviesInformation.push(movieInfo);
  })

  // Проставление номера цвета фона в фильмы в таймлайне с сеансами

  timelineMovies = Array.from(document.querySelectorAll(".timeline__seances_movie"));

  timelineMovies.forEach(element => {
    for (let i = 0; i < moviesInformation.length; i++)
      if(Number(element.dataset.filmid) === Number(moviesInformation[i].movieInfoId)) {
        element.classList.add(`background_${moviesInformation[i].background}`);
      }
  })

}

// Позиционирование сеансов по таймлайну и определение ширины блока с сеансом (длительность фильма)

let dayInMinutes = 24 * 60;
let startSeance;
let movieduration;
let movieWidth;
let seancePosition;

function positionSeance() {

  timelineMovies.forEach(item => {
    let time = item.lastElementChild.textContent.split(":", [2]);
    let hours = Number(time[0]); 
    let minutes = Number(time[1]);

    startSeance = (hours * 60) + minutes;
    seancePosition = (startSeance / dayInMinutes) * 100;

    movieduration = item.lastElementChild.dataset.duration;
    movieWidth = (movieduration / dayInMinutes) * 100;

    item.style.left = seancePosition + "%";
    item.style.width = movieWidth + "%";

    // Уменьшение размера шрифта и padding при слишком маленькой ширине сеанса

    if(item.dataset.change === "true") {
      item.firstElementChild.style.fontSize = "10px";
      item.style.padding = "10px";
    }

    let movieWidthPx = item.getBoundingClientRect().width;

    if(movieWidthPx < 40) {
      item.firstElementChild.style.fontSize = "8px";
      item.style.padding = "5px";
      item.dataset.change = "true";
    } 
  })

}

// Перетаскивание фильма в таймлайн зала (открытие popup Добавление сеанса)

function openSeancePopup(data) {

  const moviesArray = document.querySelectorAll(".movie-seances__movie");
  const hallsTimelineArray = document.querySelectorAll(".timeline__seances");

  // Определение выбранного элемента

  let selectedElement;

  moviesArray.forEach(movie => {
    movie.addEventListener("dragstart", (event) => {  
      selectedMovie = movie.dataset.id;
      selectedElement = event.target;
    }) 
  })

  // Очищаем значение выбранного элемента, если элемент отпущен

  moviesArray.forEach(movie => {
    movie.addEventListener("dragend", () => {  
      selectedElement = undefined;
    }) 
  })

  hallsTimelineArray.forEach(timeline => {
    timeline.addEventListener("dragover", (event) => {
      event.preventDefault();
    })
  })

  hallsTimelineArray.forEach(timeline => {
    timeline.addEventListener("drop", (event) => {
      event.preventDefault();
      
      if(selectedElement === undefined) {
        return;
      }

      selectedHall = timeline.dataset.id;
      
      // Открытие popup "Добавление сеанса"

      popupSeanceAdd.classList.remove("hidden");

      // Очищение значений в popup

      selectSeanceHall.innerHTML = "";
      selectSeanceMovie.innerHTML = "";
      formAddSeance.reset();

      // Формирование select "Название зала"

      for(let i = 0; i < data.result.halls.length; i++) {
        selectSeanceHall.insertAdjacentHTML("beforeend", `
        <option class="option_add-seance hall__name" data-id="${data.result.halls[i].id}">${data.result.halls[i].hall_name}</option>
        `);
      } 

      optionHallName = document.querySelectorAll(".hall__name");

      optionHallName.forEach(hallName => {
        if(Number(hallName.dataset.id) === Number(selectedHall)) {
          hallName.setAttribute("selected", "true");
        }
      })

      // Формирование select "Название фильма"

      for(let i = 0; i < data.result.films.length; i++) {
        selectSeanceMovie.insertAdjacentHTML("beforeend", `
          <option class="option_add-seance movie__name" data-id="${data.result.films[i].id}" data-duration="${data.result.films[i].film_duration}">${data.result.films[i].film_name}</option>
        `);
      } 

      optionMovieName = document.querySelectorAll(".movie__name");

      optionMovieName.forEach(movieName => {
        if(Number(movieName.dataset.id) === Number(selectedMovie)) {
          movieName.setAttribute("selected", "true");
        }
      })

    })
  })
}

// Клик по кнопке "Добавить сеанс"

let seancesChecked = [];

function clickSeanseAddButton() {
  formAddSeance.addEventListener("submit", (event) => {
    event.preventDefault();
    seancesChecked.length = 0;

    // Сохранение данных по залу

    let checkedHall = selectSeanceHall.value;

    optionHallName.forEach(hallName => {
      if(hallName.textContent === checkedHall) {
        checkedHallId = hallName.dataset.id;
      }
    })

    // Сохранение данных по фильму

    let checkedMovie = selectSeanceMovie.value;

    optionMovieName.forEach(movieName => {
      if(movieName.textContent === checkedMovie) {
        checkedMovieId = movieName.dataset.id;
        checkedMovieName = checkedMovie;
        checkedMovieDuration = movieName.dataset.duration;
      }
    })

    // Сохранение данных по выбранному времени

    checkedSeanceTime = inputSeanceTime.value;

    let seanceTime = checkedSeanceTime.split(':', [2]);
    seanceTimeStart = Number(seanceTime[0]) * 60 + Number(seanceTime[1]);

    seanceTimeEnd = seanceTimeStart + Number(checkedMovieDuration);

    // Последний сеанс должен заканчиваться не позднее 23:59

    let lastTime = 23 * 60 + 59;

    if(seanceTimeEnd > lastTime) {
      alert("Последний сеанс должен заканчиваться не позднее 23:59!");
      return;
    }

    // Проверка на пересечение с другими сеансами в зале

    timelineSeances = document.querySelectorAll(".timeline__seances");
    
    // Сбор сеансов в искомом зале

    timelineSeances.forEach(timeline => {
      if(Number(timeline.dataset.id) === Number(checkedHallId)) {
        hallSeances = Array.from(timeline.querySelectorAll(".timeline__seances_movie"));
      }
    })

    // Если зал пуст, без проверки сеансов закрыть popup и добавить новый сеанс

    if (hallSeances.length === 0) {
      popupSeanceAdd.classList.add("hidden");
      addNewSeance();
      return;
    }

    // Информация о всех существующих сеансах в конкретном зале

    for (let seance of hallSeances) {

      // Получение длительности фильма в каждом существующем сеансе
      
      currentSeancesDuration = seance.lastElementChild.dataset.duration;

      // Получение времени начала каждого существующего сеанса

      currentSeancesStart = seance.lastElementChild.textContent;
 
      // Расчет старта и окончания каждого существующего сеанса

      let currentSeanceTime = currentSeancesStart.split(':', [2]);
      currentSeanceTimeStart = Number(currentSeanceTime[0]) * 60 + Number(currentSeanceTime[1]);

      currentSeancesTimeEnd = currentSeanceTimeStart + Number(currentSeancesDuration);

      // Проверка добавляемого сеанса

      if(seanceTimeStart >= currentSeanceTimeStart && seanceTimeStart <= currentSeancesTimeEnd) {
        alert("Новый сеанс пересекается по времени с существующими!");
        seancesChecked.push("false");
        break;
      } else if (seanceTimeEnd >= currentSeanceTimeStart && seanceTimeEnd <= currentSeancesTimeEnd) {
        alert("Новый сеанс пересекается по времени с существующими!");
        seancesChecked.push("false");
        break;
      } else {
        seancesChecked.push("true");
      }

    }

    if(!seancesChecked.includes("false")) {
      popupSeanceAdd.classList.add("hidden");
      addNewSeance();
    } else {
      return;
    }

  })
}

// Добавление сеанса в таймлайн зала

function addNewSeance() {
  movieSeancesCancel.classList.remove("button_disabled");
  movieSeancesSave.classList.remove("button_disabled");

  timelineSeances.forEach(timeline => {
    if (Number(timeline.dataset.id) === Number(checkedHallId)) {
      timeline.insertAdjacentHTML("beforeend", `
      <div class="timeline__seances_movie" data-filmid="${checkedMovieId}" data-seanceid="" draggable="true">
        <p class="timeline__seances_title">${checkedMovieName}</p>
        <p class="timeline__movie_start" data-duration="${checkedMovieDuration}">${checkedSeanceTime}</p>
      </div>
      `);
    }      
    
  })

  setMovieBackground();
  
  positionSeance();

  deleteSeance();
}


// Удаление сеанса из таймлайна

function deleteSeance() {
  selectSeances = document.querySelectorAll(".timeline__seances_movie");

  // Определение выбранного сеанса

  let selectedElement;

  selectSeances.forEach(seance => {
    seance.addEventListener("dragstart", (event) => {
      selectedSeance = seance;
      selectTimeline = seance.closest(".movie-seances__timeline");
      selectedMovie = seance.dataset.filmid;
      selectedMovieName = seance.firstElementChild.textContent;
      selectedHallId = seance.parentElement.dataset.id;
      selectDelete = selectTimeline.firstElementChild;

      selectDelete.classList.remove("hidden");

      selectedElement = event.target;

      selectDelete.addEventListener("dragover", (event) => {  
        event.preventDefault();
      })
    
      selectDelete.addEventListener("drop", (event) => {  
        event.preventDefault();
    
        // Открытие popup "Удаление сеанса"
    
        popupSeanceRemove.classList.remove("hidden");

        seanceRemoveTitle = document.querySelector(".seance-remove_title");
        seanceRemoveTitle.textContent = selectedMovieName;

        seanceDeleteButton = document.querySelector(".popup__remove-seance_button_delete");

        // Кнопка "Удалить" в popup "Удаление сеанса"

        seanceDeleteButton.addEventListener("click", (e) => {
          e.preventDefault();

          popupSeanceRemove.classList.add("hidden");

          if(selectedSeance.dataset.seanceid !== "") {
            selectedSeanceId = selectedSeance.dataset.seanceid;
            deletedSeances.push(selectedSeanceId);
          }

          selectedSeance.remove();

          // Очищение массива с удаляемыми сеансами от повторов

          filterDeletedSeances = deletedSeances.filter((item, index) => {
            return deletedSeances.indexOf(item) === index;
          });

          if(filterDeletedSeances.length !== 0) {
            movieSeancesCancel.classList.remove("button_disabled");
            movieSeancesSave.classList.remove("button_disabled");
          } else {
            movieSeancesCancel.classList.add("button_disabled");
            movieSeancesSave.classList.add("button_disabled");
          }
        
        })

      })

    })
  })

  selectSeances.forEach(seance => {
    seance.addEventListener("dragend", () => {
      selectedElement = undefined;
      selectDelete.classList.add("hidden");
    })
  })

}

// Отображение сеансов

function seancesOperations(data) {
  timelineSeances = document.querySelectorAll(".timeline__seances");

  // Загрузкa сеансов

  loadSeances(data);

  openSeancePopup(data);
  clickSeanseAddButton();

  deleteSeance();
}

// Кнопка Сохранить под сеткой сеансов

movieSeancesSave = document.querySelector(".movie-seances__batton_save");

// Сохранить сетку сеансов

movieSeancesSave.addEventListener("click", event => {
  if(movieSeancesSave.classList.contains("button_disabled")) {
    event.preventDefault();
  } else {
    event.preventDefault();

    const seancesArray = Array.from(document.querySelectorAll(".timeline__seances_movie"));

    // Добавление сеансов

    seancesArray.forEach(seance => {
      if(seance.dataset.seanceid === "") {
        const params = new FormData();
        params.set("seanceHallid", `${seance.parentElement.dataset.id}`);
        params.set('seanceFilmid', `${seance.dataset.filmid}`);
        params.set('seanceTime', `${seance.lastElementChild.textContent}`);
        addSeances(params);
      }
    })
    
    // Удаление сеансов

    if (filterDeletedSeances.length !== 0) {
      filterDeletedSeances.forEach(seance => {
        let seanceId = seance;
        deleteSeances(seanceId);
      })
    }

    alert("Сеансы сохранены!");
    location.reload();
 }
})

// Добавить сеанс на сервер

function addSeances(params) {
  fetch("https://shfe-diplom.neto-server.ru/seance", {
  method: "POST",
  body: params 
})
  .then(response => response.json())
  .then(function(data) { 
    console.log(data);
  })
}

// Удалить сеанс с сервера

function deleteSeances(seanceId) {
  fetch(`https://shfe-diplom.neto-server.ru/seance/${seanceId}`, {
    method: "DELETE",
  })
    .then(response => response.json())
    .then(function(data) {
      console.log(data);
    })
}