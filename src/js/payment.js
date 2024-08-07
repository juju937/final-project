const seanceId = Number(localStorage.getItem("seanceId"));
const chosenDate = localStorage.getItem("chosenDate");
const tickets = JSON.parse(localStorage.getItem("tickets"));

const movieInfo = document.querySelector(".ticket__info-movie");
const placesInfo = document.querySelector(".ticket__info-places");
const hallInfo = document.querySelector(".ticket__info-hall");
const timeInfo = document.querySelector(".ticket__info-time");
const priceInfo = document.querySelector(".ticket__info-price");

let places = [];
let coast = [];
let finalSumm;

const ticketButton = document.querySelector(".ticket__button");

// инфо о билете

function getInfo(data) {
  let seanceIndex = data.result.seances.findIndex(item => item.id === Number(seanceId));
  let movieIndex = data.result.films.findIndex(item => item.id === data.result.seances[seanceIndex].seance_filmid);
  let hallIndex = data.result.halls.findIndex(item => item.id === data.result.seances[seanceIndex].seance_hallid);

  movieInfo.textContent = data.result.films[movieIndex].film_name;
  hallInfo.textContent = data.result.halls[hallIndex].hall_name;
  timeInfo.textContent = data.result.seances[seanceIndex].seance_time;

  tickets.forEach(ticket => {
    places.push(ticket.row + "/" + ticket.place);

    coast.push(ticket.coast);
  })

  placesInfo.textContent = places.join(", ");

  finalSumm = coast.reduce((acc, price) => acc + price, 0);
  priceInfo.textContent = finalSumm;
}

// данные с сервера

(async function() {
  const apiService = new ApiService;

  try {
      const data = await apiService.getAllData();
      getInfo(data);
  } catch (error) {
      console.error("Ошибка при получении данных:", error);
  }
})();

// кнопка "Получить код бронирования"

ticketButton.addEventListener("click", event => {
  event.preventDefault();

  const params = new FormData();
    params.set("seanceId", seanceId);
    params.set("ticketDate", chosenDate);
    params.set("tickets", JSON.stringify(tickets));
  
    fetch("https://shfe-diplom.neto-server.ru/ticket", {
      method: "POST",
      body: params
      })
      .then(response => response.json())
      .then(function(data) {
        console.log(data); 
        
        if(data.success === true) { 
          localStorage.setItem("ticketsInfo", JSON.stringify(data));
          window.location.href="./ticket.html";
        } else {
          alert("Места недоступны для бронирования!");
          return;
        }
    })  
})