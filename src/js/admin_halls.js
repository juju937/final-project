// Управление залами

const sectionSpoiler = document.querySelectorAll(".admin__section-header")
const hallsInfo = document.querySelector(".conf-step__wrapper-text");
const hallsList = document.querySelector(".wrapper__halls-list");
const hallButton = document.querySelector(".admin__button-hall");
let hallRemoveButton;

// popup Добавление зала

const popupHallNew = document.querySelector(".popup__manage-halls");
const formAddHall = document.querySelector(".popup__form.add-hall");
const inputAddHall = document.querySelector(".add-hall-input");
const buttonHallAdd = document.querySelector(".popup__add-hall_button_add");
const popupClose = document.querySelector('.popup__close')

// Проверка наличия залов в блоке "Доступные залы"

function checkHallsList() {
  if (hallsList.innerText) {
    hallsInfo.classList.remove("hidden");
    hallsList.classList.remove("hidden");
    hallsConfig.classList.remove("hidden");
    movieSeancesTimelines.classList.remove("hidden");
    openSells.classList.remove("hidden");
  } else {
    hallsInfo.classList.add("hidden");
    hallsList.classList.add("hidden");
    hallsConfig.classList.add("hidden");
    movieSeancesTimelines.classList.add("hidden");
    openSells.classList.add("hidden");
  }
}

// Открыть popup "Добавить зал"

hallButton.addEventListener("click", (e) => {
  e.preventDefault();
  popupHallNew.classList.remove("hidden");
})

// Закрыть popup "Добавить зал" нажатием на крестик

popupClose.addEventListener('click', () => {
  popupHallNew.classList.add("hidden");
})

// Открыть/ скрыть блоки нажатием на заголовок блока (или стрелку справа)

  sectionSpoiler.forEach((element) => {
    element.addEventListener('click', () => {
      element.nextElementSibling.classList.toggle("hidden");
      if (element.nextElementSibling.classList.contains('hidden')) {
        element.querySelector(".spoiler_button").innerHTML = `
          <i class="fa-solid fa-chevron-down" title="Скрыть/открыть блок"></i>
        `;
      } else {
          element.querySelector(".spoiler_button").innerHTML = `
          <i class="fa-solid fa-chevron-up" title="Скрыть/открыть блок"></i>
        `;
      }
    })
  })

// Добавить зал

formAddHall.addEventListener("submit", (e) => {
  e.preventDefault();
  addHall(inputAddHall);
})

function addHall(inputAddHall) {
  const formData = new FormData();
  formData.set("hallName", `${inputAddHall.value}`);

  if(inputAddHall.value.trim()) {
    fetch("https://shfe-diplom.neto-server.ru/hall", {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(function(data) {
        console.log(data);  
        hallsList.insertAdjacentHTML("beforeend", `
        <li class="halls-list__item">
          <span class="halls-list__item-name" data-id="${data.result.halls.id}">${inputAddHall.value}</span> <button class="admin__button-remove halls-remove"><i class="fa-solid fa-trash" title="Удалить зал"></i></button>
        </li>
        `);

        inputAddHall.value = "";
        location.reload(); 
      })
  } 
}

// Удаление зала в блоке "Доступные залы"

function deleteHall(hallId) {
  fetch(`https://shfe-diplom.neto-server.ru/hall/${hallId}`, {
    method: "DELETE",
  })
  .then(response => response.json())
  .then(function(data) {
    console.log(data);
    location.reload();
  })
}

//Получение информации по залам

function manageHalls(data) {

  for(let i = 0; i < data.result.halls.length; i++) {

    // Заполнение блока "Доступные залы"

    hallsList.insertAdjacentHTML("beforeend", `
      <li class="halls-list__item">
        <span class="halls-list__item-name" data-id="${data.result.halls[i].id}">${data.result.halls[i].hall_name}</span> <button class="admin__button-remove halls-remove"><i class="fa-solid fa-trash" title="Удалить зал"></i></button>
      </li>
    `);

    // Проверка наличия залов в списке

    checkHallsList();
  }
}

// Удалить зал

hallRemoveButton = document.querySelectorAll(".halls-remove");

hallRemoveButton.forEach(item => {
  item.addEventListener("click", (e) => {
    let hallId = e.target.previousElementSibling.dataset.id;
    deleteHall(hallId);
  })  
})