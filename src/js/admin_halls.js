// управление залами

const sectionSpoiler = document.querySelectorAll(".admin__section-header")
const hallsInfo = document.querySelector(".conf-step__wrapper-text");
const hallsList = document.querySelector(".wrapper__halls-list");
const hallButton = document.querySelector(".admin__button-hall");
let hallRemoveButton;

// popup добавление зала

const popupHallNew = document.querySelector(".popup__manage-halls");
const formAddHall = document.querySelector(".popup__form.add-hall");
const inputAddHall = document.querySelector(".add-hall-input");
const buttonHallAdd = document.querySelector(".popup__add-hall_button_add");
const popupClose = document.querySelector('.popup__close')

// открыть popup "Добавить зал"

hallButton.addEventListener("click", (e) => {
  e.preventDefault();
  popupHallNew.classList.remove("hidden");
})

// закрыть popup "Добавить зал" нажатием на крестик

popupClose.addEventListener('click', () => {
  popupHallNew.classList.add("hidden");
})

// открыть/ скрыть блоки нажатием на заголовок блока (или стрелку справа)

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

// добавить зал

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

// удаление зала в блоке "Доступные залы"

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

//получение информации по залам

function manageHalls(data) {

  for(let i = 0; i < data.result.halls.length; i++) {

    // заполнение блока "Доступные залы"

    hallsList.insertAdjacentHTML("beforeend", `
      <li class="halls-list__item">
        <span class="halls-list__item-name" data-id="${data.result.halls[i].id}">${data.result.halls[i].hall_name}</span> <button class="admin__button-remove halls-remove"><i class="fa-solid fa-trash" title="Удалить зал"></i></button>
      </li>
    `);

    // проверка наличия залов в списке

    checkHallsList();
  }
}

// удалить зал

hallRemoveButton = document.querySelectorAll(".halls-remove");

hallRemoveButton.forEach(item => {
  item.addEventListener("click", (e) => {
    let hallId = e.target.previousElementSibling.dataset.id;
    deleteHall(hallId);
  })  
})