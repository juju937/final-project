const navDays = Array.from(document.querySelectorAll(".page-nav__day"));
const navToday = document.querySelector(".nav__day_current");
const navNextDates = document.querySelector(".right");

let daysCount = 1;

let todayNavWeek;
let todayNavDate;

const weekDays = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
let todayWeekDay;

const currentDay = new Date();
let chosenDate;
let selectedDate;
let selectedMonth;
let selectedYear;

let gottenDate;
let gottenMonth;
let date;

let navDaysSorted;

const main = document.querySelector(".main");
let movies;
let movie;
let movieSeances;
let movieSeancesList;

// --------------------------------------------------------------- PAGE NAV & CALENDAR ---------------------------------

// сегодняшний день

function setToday(currentDay) {
  todayWeekDay = weekDays[currentDay.getDay()];

  todayNavWeek = navToday.querySelector(".nav__day-week");
  todayNavWeek.textContent = `${todayWeekDay}, `;
  
  todayNavDate = navToday.querySelector(".nav__day-number");
  todayNavDate.textContent = ` ${currentDay.getDate()}`;
  
  if (todayNavWeek.textContent === "Сб, " || todayNavWeek.textContent === "Вс, ") {
    todayNavWeek.classList.add("nav__day_weekend");
    todayNavDate.classList.add("nav__day_weekend");
  }
}

// остальные дни

function setDays() {
  navDays.forEach((day, i) => {
    if(!day.classList.contains("nav__day_current") && !day.classList.contains("nav__arrow")) {
      const date = new Date(currentDay.getTime() + (1000 * 60 * 60 * 24 * i));
      day.dataset.date = date.toJSON().split("T")[0];
      day.firstElementChild.textContent = `${weekDays[date.getDay()]},`;
      day.lastElementChild.textContent = date.getDate();
  
      if (day.firstElementChild.textContent === "Сб," || day.firstElementChild.textContent === "Вс,") {
        day.classList.add("nav__day_weekend");
      } else {
        day.classList.remove("nav__day_weekend");
      }
    }
  });
}

// смена дат

function changeDays(daysCount) {
  navDays.forEach((day, i) => {
    if(!day.classList.contains("nav__day_current") && !day.classList.contains("nav__arrow")) {
      const date = new Date(currentDay.getTime() + (1000 * 60 * 60 * 24 * (i + daysCount)));
      day.dataset.date = date.toJSON().split("T")[0];
      day.firstElementChild.textContent = `${weekDays[date.getDay()]},`;
      day.lastElementChild.textContent = date.getDate();
  
      if (day.firstElementChild.textContent === "Сб," || day.firstElementChild.textContent === "Вс,") {
        day.classList.add("nav__day_weekend");
      } else {
        day.classList.remove("nav__day_weekend");
      }
    }
  });
}

function getDay(selectedDate, selectedMonth, selectedYear) {
  if(selectedDate < 10) {
    gottenDate = `0${selectedDate}`;
  } else {
    gottenDate = selectedDate;
  }

  if(selectedMonth < 9) {
    gottenMonth = `0${selectedMonth}`;
  } else {
    gottenMonth = selectedMonth;
  }

  date = `${selectedYear}-${gottenMonth}-${gottenDate}`;
}

function sortDays(navDays) {
  navDaysSorted = navDays.filter(item => !item.classList.contains("nav__arrow"));
}

// выбор сегодняшнего дня

navToday.classList.add("nav__day-chosen");
navToday.style.cursor = "default";
navToday.dataset.date = currentDay.toJSON().split("T")[0];

if(navToday.classList.contains("nav__day-chosen")) {
  selectedDate = currentDay.getDate();
  selectedMonth = currentDay.getMonth() + 1;
  selectedYear = currentDay.getFullYear();

  getDay(selectedDate, selectedMonth, selectedYear);
  localStorage.setItem("chosenDate", date);
}

setToday(currentDay);
setDays();
sortDays(navDays);
markPastSeances();

// нажатие на правую стрелку

navNextDates.addEventListener("click", () => {
  daysCount++;
  
  navToday.classList.remove("nav__day-chosen");
  navToday.classList.add("nav__arrow");
  navToday.classList.add("left");

  navToday.innerHTML = `
    <span class="nav__arrow-icon"><i class="fa-solid fa-chevron-left"></i></span>
  `;

  changeDays(daysCount);
  sortDays(navDays);
})

// нажатие на левую стрелку

navToday.addEventListener("click", () => {
  if(navToday.classList.contains("nav__arrow")) {
    daysCount--;

    if(daysCount > 0) {
      changeDays(daysCount);
      sortDays(navDays);
    } else if (daysCount === 0) {
      navToday.classList.remove("nav__arrow");
      navToday.classList.remove("left");
    
      navToday.innerHTML = `
        <span class="nav__current-date">Сегодня</span>
        <br><span class="nav__day-week"></span> <span class="nav__day-number"></span>
      `;
  
      setToday(currentDay);
      setDays();

      navDays.forEach(day => {
        if(!day.classList.contains("nav__day-chosen")) {
          navToday.classList.add("nav__day-chosen");

          selectedDate = currentDay.getDate();
          selectedMonth = currentDay.getMonth() + 1;
          selectedYear = currentDay.getFullYear();
        
          getDay(selectedDate, selectedMonth, selectedYear);
          localStorage.setItem("chosenDate", date);
        }
      })
  
      sortDays(navDays);
    } else {
      return;
    }

  } else {
    return;
  }
  
})

// нажатие на день

navDaysSorted.forEach(day => {
  day.addEventListener("click", () => {

    navDaysSorted.forEach(item => {
      item.classList.remove("nav__day-chosen");
    })

    if(!day.classList.contains("nav__arrow")) {
      day.classList.add("nav__day-chosen");

      chosenDate = new Date(day.dataset.date);

      selectedDate = chosenDate.getDate();
      selectedMonth = chosenDate.getMonth() + 1;
      selectedYear = chosenDate.getFullYear();
        
      getDay(selectedDate, selectedMonth, selectedYear);
      localStorage.setItem("chosenDate", date);

      markPastSeances();
      clickSeance();
    }
    
  })
})

// --------------------------------------------------------------- MOVIE LIST & API ---------------------------------

// список фильмов и сеансов

let dataFilms;
let dataSeances;
let dataHalls;

let hallsSeances;
let currentSeances;

function getMovies(data) {
  dataFilms = data.result.films;
  dataSeances = data.result.seances;
  dataHalls = data.result.halls.filter(hall => hall.hall_open === 1);

  dataFilms.forEach(film => {
    hallsSeances = "";

    dataHalls.forEach(hall => {


      currentSeances = dataSeances.filter(seance => (
        (Number(seance.seance_hallid) === Number(hall.id)) && 
        (Number(seance.seance_filmid) === Number(film.id))
      ));


      currentSeances.sort(function(a, b) {
        if ((a.seance_time.slice(0,2) - b.seance_time.slice(0,2)) < 0) {
          return -1;
        } else if ((a.seance_time.slice(0,2) - b.seance_time.slice(0,2)) > 0) {
          return 1;
        }
      });

      if (currentSeances.length > 0) {


        hallsSeances += `
        <h3 class="movie-seances__hall" data-hallid="${hall.id}">${hall.hall_name}</h3>
        <ul class="movie-seances__list">
        `;

        currentSeances.forEach(seance => {

          hallsSeances += `
          <li class="movie-seances__time" data-seanceid="${seance.id}" data-hallid="${hall.id}" data-filmid="${film.id}">
            ${seance.seance_time}
          </li>
          `;
        });
        
        hallsSeances += `</ul>`;
      };
    });
  
    if (hallsSeances) {

      main.insertAdjacentHTML("beforeend", `
        <section class="movie" data-filmid="${film.id}">
          <div class="movie__info">
            <div class="movie__poster">
              <img src="${film.film_poster}" alt="Постер фильма ${film.film_name}" class="movie__poster_image">
            </div>
            <div class="movie__description">
              <h2 class="movie__title">${film.film_name}</h2>
              <p class="movie__synopsis">${film.film_description}</p>
              <p class="movie__data">
                <span class="movie__data-length">${film.film_duration} минут</span>
                <span class="movie__data-country">${film.film_origin}</span>
              </p>
            </div>
          </div>

          <div class="movie-seances">
            ${hallsSeances}
          </div>
        </section>
      `);
    } 
  })

  markPastSeances();

  clickSeance();
}

// данные с сервера
(async function() {
  const apiService = new ApiService;

  try {
      const data = await apiService.getAllData();
      getMovies(data);
  } catch (error) {
      console.error("Ошибка при получении данных:", error);
  }
})();

// отмечаем прошедшие сеансы как неактивные


function markPastSeances() {

  const currentHours = currentDay.getHours();
  const currentMinutes = currentDay.getMinutes();

  movieSeancesList = document.querySelectorAll(".movie-seances__time");
  movieSeancesList.forEach(seance => {

    if (Number(selectedDate) === Number(currentDay.getDate())) {
   
      if(Number(currentHours) > Number(seance.textContent.trim().slice(0,2))) {
        seance.classList.add("movie-seances__time_disabled");
      } else if(Number(currentHours) === Number(seance.textContent.trim().slice(0,2))) {
        if(Number(currentMinutes) > Number(seance.textContent.trim().slice(3))) {
          seance.classList.add("movie-seances__time_disabled");

        } else {
          seance.classList.remove("movie-seances__time_disabled");
        }
      } else {
        seance.classList.remove("movie-seances__time_disabled");
      }
  
    } else {
      seance.classList.remove("movie-seances__time_disabled");
    }
  })
}

// переход в зал

let seanceId;

function clickSeance() {
  movieSeancesList = document.querySelectorAll(".movie-seances__time");

  movieSeancesList.forEach(seance => {
    if(!seance.classList.contains("movie-seances__time_disabled")) {
      seance.addEventListener("click", () => {
        seanceId = seance.dataset.seanceid;
        localStorage.setItem("seanceId", seanceId);

        window.location.href="./hall.html";
      })
    }
  })

}