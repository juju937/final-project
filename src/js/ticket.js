const seanceId = Number(localStorage.getItem("seanceId"));
const chosenDate = localStorage.getItem("chosenDate");
const tickets = JSON.parse(localStorage.getItem("tickets"));
const ticketsInfo = JSON.parse(localStorage.getItem("ticketsInfo"));

const movieInfo = document.querySelector(".ticket__info-movie");
const placesInfo = document.querySelector(".ticket__info-places");
const hallInfo = document.querySelector(".ticket__info-hall");
const timeInfo = document.querySelector(".ticket__info-time");

const ticketQr = document.querySelector(".ticket__info-qr");
let textQr;
let qrCode;

let places = [];
let coast = [];
let finalSumm;

// данные о билете

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

  // QR-код

  textQr = `
    Дата: ${chosenDate}, 
    Время: ${timeInfo.textContent}, 
    Название фильма: ${movieInfo.textContent}, 
    Зал: ${hallInfo.textContent}, 
    Ряд/Место: ${places.join(", ")}, 
    Стоимость: ${finalSumm}, 
    Билет действителен строго на свой сеанс
  `

  qrCode = QRCreator(textQr, 
    { mode: -1,
      eccl: 0,
      version: -1,
      mask: -1,
      image: "PNG",
      modsize: 3,
      margin: 3
    });

  ticketQr.append(qrCode.result);

  localStorage.clear();
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