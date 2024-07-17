// управление залами

const hallsInfo = document.querySelector(".halls__info");
const hallsList = document.querySelector(".halls__list");
const hallButton = document.querySelector(".admin__button_hall");
let hallRemoveButton;

// конфигурация залов

const hallsConfig = document.querySelector(".hall-config");
const hallsConfigList = document.querySelector(".hall-config__list");
let hallsConfigItems;
const hallsConfigWrapper = document.querySelector(".hall-config__wrapper");
let hallConfigArray = [];

// схема зала

let currentHallConfig;
let currentHallConfigIndex;
let newHallConfigArray;

let hallConfigForm;
let hallConfigRows;
let hallConfigPlaces;
let hallScheme;
let hallSchemeRows;
let hallSchemePlaces;
let hallChairs;
let hallConfigCancel;
let hallConfigSave;

// конфигурация цен

const priceConfig = document.querySelector(".price-config");
const priceConfigList = document.querySelector(".price-config__list");
let priceConfigItems;
const priceConfigWrapper = document.querySelector(".price-config__wrapper");
let priceConfigForm;
let priceConfigStandart;
let priceConfigVip;
let priceConfigCancel;
let priceConfigSave;

let currentPriceConfig;

// открыть продажи

const openSells = document.querySelector(".open");
const openList = document.querySelector(".open__list");
const openWrapper = document.querySelector(".open__wrapper");
let openInfo;
let openButton;
let currentOpen;

let hallCurrentStatus;
let hallNewStatus;

// залы в Сетке сеансов

const movieSeancesTimelines = document.querySelector(".movie-seances__timelines");
let timelineDelete;

// проверка наличия залов в блоке "Доступные залы"

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

// popup "Добавить зал"

hallButton.addEventListener("click", () => {
  popupHallAdd.classList.remove("hidden");
})

const popupHallAdd = document.querySelector(".popup__hall_add");
const formAddHall = document.querySelector(".popup__form_add-hall");
const inputAddHall = document.querySelector(".add-hall_input");
const buttonHallAdd = document.querySelector(".popup__add-hall_button_add");

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
        <li class="halls__list_item">
          <span class="halls__list_name" data-id="${data.result.halls.id}>${inputAddHall.value}</span> <span class="admin__button_remove hall_remove"></span>
        </li>
        `);

        inputAddHall.value = "";
        location.reload(); 
      })
  } 
}

// удалить зал в блоке "Доступные залы"

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

// отображение зала

function showHall(data, currentHallConfigIndex) {
  hallConfigRows.value = data.result.halls[currentHallConfigIndex].hall_rows;
  hallConfigPlaces.value = data.result.halls[currentHallConfigIndex].hall_places;
  
  hallScheme.innerHTML = "";
  hallConfigArray.splice(0, hallConfigArray.length);

  data.result.halls[currentHallConfigIndex].hall_config.forEach(element => {
    hallScheme.insertAdjacentHTML("beforeend", `<div class="hall-config__hall_row"></div>`);
  })

  hallSchemeRows = document.querySelectorAll(".hall-config__hall_row");

  for(let i = 0; i < hallSchemeRows.length; i++) {
    for(let j = 0; j < data.result.halls[currentHallConfigIndex].hall_config[0].length; j++) {
      hallSchemeRows[i].insertAdjacentHTML("beforeend", `<span class="hall-config__hall_chair" data-type="${data.result.halls[currentHallConfigIndex].hall_config[i][j]}"></span>`);
    }
  }

  hallChairs = document.querySelectorAll(".hall-config__hall_chair");

  hallChairs.forEach(element => {
    if (element.dataset.type === "vip") {
      element.classList.add("place_vip");
    } else if (element.dataset.type === "standart") {
      element.classList.add("place_standart");
    } else {
      element.classList.add("place_block");
    }
  })

  hallConfigArray = JSON.parse(JSON.stringify(data.result.halls[currentHallConfigIndex].hall_config));
}

// изменение типа мест на схеме зала

function changePlaces(hallSchemeRows, data) {
  newHallConfigArray = JSON.parse(JSON.stringify(hallConfigArray));

  let hallChangeRows = Array.from(hallSchemeRows);
  hallChangeRows.forEach(row => {
    let rowIndex = hallChangeRows.findIndex(currentRow => currentRow === row);
    let hallChangePlaces = Array.from(row.children);
    hallChangePlaces.forEach(place => {
      place.style.cursor = "pointer";
      let placeIndex = hallChangePlaces.findIndex(currentPlace => currentPlace === place);
      
      place.addEventListener("click", () => {
        if(place.classList.contains("place_standart")) {
          place.classList.replace("place_standart", "place_vip");
          place.dataset.type = "vip";
          newHallConfigArray[rowIndex][placeIndex] = "vip";
        } else if (place.classList.contains("place_vip")) {
          place.classList.replace("place_vip", "place_block");
          place.dataset.type = "disabled";
          newHallConfigArray[rowIndex][placeIndex] = "disabled";
        } else {
          place.classList.replace("place_block", "place_standart");
          place.dataset.type = "standart";
          newHallConfigArray[rowIndex][placeIndex] = "standart";
        }

        if(JSON.stringify(newHallConfigArray) !== JSON.stringify(data.result.halls[currentHallConfigIndex].hall_config)) {
          hallConfigCancel.classList.remove("button_disabled");
          hallConfigSave.classList.remove("button_disabled");
        } else {
          hallConfigCancel.classList.add("button_disabled");
          hallConfigSave.classList.add("button_disabled");
        }
      })
    })
  })
}

// изменение размера зала

function changeHallSize(newHallConfigArray, data) {
  hallConfigForm.addEventListener("input", () => {
    newHallConfigArray.splice(0, newHallConfigArray.length);

    hallScheme.innerHTML = "";

    for(let i = 0; i < hallConfigRows.value; i++) {
      hallScheme.insertAdjacentHTML("beforeend", `<div class="hall-config__hall_row"></div>`);
      newHallConfigArray.push(new Array());
    }

    hallSchemeRows = Array.from(document.querySelectorAll(".hall-config__hall_row"));
      
    for(let i = 0; i < hallConfigRows.value; i++) {
      for(let j = 0; j < hallConfigPlaces.value; j++) {
        hallSchemeRows[i].insertAdjacentHTML("beforeend", `<span class="hall-config__hall_chair place_standart" data-type="standart"></span>`);
        newHallConfigArray[i].push("standart");
      }
    }

    if(JSON.stringify(newHallConfigArray) !== JSON.stringify(data.result.halls[currentHallConfigIndex].hall_config)) {
      hallConfigCancel.classList.remove("button_disabled");
      hallConfigSave.classList.remove("button_disabled");
    } else {
      hallConfigCancel.classList.add("button_disabled");
      hallConfigSave.classList.add("button_disabled");
    }

    changePlaces(hallSchemeRows, data);
  })
}

// сохранить конфигурацию зала

function saveConfig(currentHallConfig, newHallConfigArray) {
  const params = new FormData();

  params.set("rowCount", `${hallConfigRows.value}`);
  params.set("placeCount", `${hallConfigPlaces.value}`);
  params.set("config", JSON.stringify(newHallConfigArray)); 

  fetch(`https://shfe-diplom.neto-server.ru/hall/${currentHallConfig}`, {
    method: "POST",
    body: params 
    })
      .then(response => response.json())
      .then(function(data) { 
        console.log(data);
        alert("Конфигурация зала сохранена!");
        location.reload();
      })
}

// отображение цен

function showPrices(data, currentPriceConfig) {
  for(let i = 0; i < data.result.halls.length; i++) {
    if(data.result.halls[i].id === Number(currentPriceConfig)) {
      priceConfigStandart.value = data.result.halls[i].hall_price_standart;
      priceConfigVip.value = data.result.halls[i].hall_price_vip;
      
      priceConfigForm.addEventListener("input", () => {
        if(priceConfigStandart.value === data.result.halls[i].hall_price_standart && priceConfigVip.value ===data.result.halls[i].hall_price_vip) {
          priceConfigCancel.classList.add("button_disabled");
          priceConfigSave.classList.add("button_disabled");
        } else {
          priceConfigCancel.classList.remove("button_disabled");
          priceConfigSave.classList.remove("button_disabled");
        }
      })
    }
  }
}

// сохранить конфигурацию цен

function savePrices(currentPriceConfig) {
  const params = new FormData();
  params.set("priceStandart", `${priceConfigStandart.value}`);
  params.set("priceVip", `${priceConfigVip.value}`);

  fetch(`https://shfe-diplom.neto-server.ru/price/${currentPriceConfig}`, {
    method: "POST",
    body: params 
  })
    .then(response => response.json())
    .then(function(data) { 
      console.log(data);
      alert("Конфигурация цен сохранена!");
      location.reload();
    })
}

// проверить открыт ли зал

function checkHallOpen(data, currentOpen) {
  openInfo = document.querySelector(".open__info");
  openButton = document.querySelector(".admin__button_open");
  let hasSeances = 0;

  for(let i = 0; i < data.result.halls.length; i++) {
    if(data.result.halls[i].id === Number(currentOpen)) {
      hallCurrentStatus = data.result.halls[i].hall_open;
    }
  }

  // проверить установлены ли сеансы для зала

  for (let i = 0; i < data.result.seances.length; i++) {
    if(data.result.seances[i].seance_hallid === Number(currentOpen)) {
      hasSeances++;
    }
  }

  if((hallCurrentStatus === 0) && (hasSeances === 0)) {
    openButton.textContent = "Открыть продажу билетов";
    openInfo.textContent = "Добавьте сеансы в зал для открытия";
    openButton.classList.add("button_disabled");
  } else if ((hallCurrentStatus === 0) && (hasSeances > 0)) {
    openButton.textContent = "Открыть продажу билетов";
    hallNewStatus = 1;
    openInfo.textContent = "Всё готово к открытию";
    openButton.classList.remove("button_disabled");
  } else {
    openButton.textContent = "Приостановить продажу билетов";
    hallNewStatus = 0;
    openInfo.textContent = "Зал открыт";
    openButton.classList.remove("button_disabled");
  }
}

// изменить статус зала

function openCloseHall(currentOpen, hallNewStatus) {
  const params = new FormData();
  params.set("hallOpen", `${hallNewStatus}`)
  fetch( `https://shfe-diplom.neto-server.ru/open/${currentOpen}`, {
    method: "POST",
    body: params 
  })
  
  .then(response => response.json())
  .then(function(data) { 
    console.log(data);
    alert("Статус зала изменен!");
  })
}

// информация по залам

function hallsOperations(data) {

  for(let i = 0; i < data.result.halls.length; i++) {

    hallsList.insertAdjacentHTML("beforeend", `
      <li class="halls__list_item">
        <span class="halls__list_name" data-id="${data.result.halls[i].id}">${data.result.halls[i].hall_name}</span> <span class="admin__button_remove hall_remove"></span>
      </li>
    `);

    checkHallsList();

    hallsConfigList.insertAdjacentHTML("beforeend", `
      <li class="hall__item hall-config__item" data-id="${data.result.halls[i].id}">${data.result.halls[i].hall_name}</li>
    `);

    priceConfigList.insertAdjacentHTML("beforeend", `
      <li class="hall__item price-config__item" data-id="${data.result.halls[i].id}">${data.result.halls[i].hall_name}</li>
    `);

    openList.insertAdjacentHTML("beforeend", `
    <li class="hall__item open__item" data-id="${data.result.halls[i].id}">${data.result.halls[i].hall_name}</li>
    `);

    movieSeancesTimelines.insertAdjacentHTML("beforeend", `
    <section class="movie-seances__timeline">
      <div class="timeline__delete">
         <img class="timeline__delete_image" src="./src/images/delete.png" alt="Удалить сеанс">
      </div>
      <h3 class="timeline__hall_title">${data.result.halls[i].hall_name}</h3>
      <div class="timeline__seances" data-id="${data.result.halls[i].id}">
      </div>
    </section>
    `);

    timelineDelete = document.querySelectorAll(".timeline__delete");

    timelineDelete.forEach(element => {
      element.classList.add("hidden");
    })

  }

  hallsConfigList.firstElementChild.classList.add("hall_item-selected");
  currentHallConfig = hallsConfigList.firstElementChild.getAttribute("data-id");

  hallConfigForm = document.querySelector(".hall-config__size");
  hallConfigRows = document.querySelector(".hall-config__rows");
  hallConfigPlaces = document.querySelector(".hall-config__places");

  hallScheme = document.querySelector(".hall-config__hall_wrapper");

  currentHallConfigIndex = data.result.halls.findIndex(hall => hall.id === Number(currentHallConfig));

  hallConfigRows.value = data.result.halls[currentHallConfigIndex].hall_rows;
  hallConfigPlaces.value = data.result.halls[currentHallConfigIndex].hall_places;

  hallConfigCancel = document.querySelector(".hall-config__batton_cancel");
  hallConfigSave = document.querySelector(".hall-config__batton_save");

  showHall(data, currentHallConfigIndex);
  changePlaces(hallSchemeRows, data);
  changeHallSize(newHallConfigArray, data);

  hallConfigCancel.addEventListener("click", event => {
    if(hallConfigCancel.classList.contains("button_disabled")) {
      event.preventDefault();
    } else {
      event.preventDefault();
      hallConfigCancel.classList.add("button_disabled");
      hallConfigSave.classList.add("button_disabled");

      showHall(data, currentHallConfigIndex);
      changePlaces(hallSchemeRows, data);
    }
  })

  hallConfigSave.addEventListener("click", event => {
    if(hallConfigSave.classList.contains("button_disabled")) {
      event.preventDefault();
    } else {
      event.preventDefault();
      saveConfig(currentHallConfig, newHallConfigArray);
    }
  })

  priceConfigList.firstElementChild.classList.add("hall_item-selected");
  currentPriceConfig = priceConfigList.firstElementChild.getAttribute("data-id");

  priceConfigForm = document.querySelector(".price-config__form");

  priceConfigStandart = document.querySelector(".price-config__input_standart");
  priceConfigVip = document.querySelector(".price-config__input_vip");
  
  showPrices(data, currentPriceConfig);

  priceConfigCancel = document.querySelector(".price-config__batton_cancel");
  priceConfigSave = document.querySelector(".price-config__batton_save");

  priceConfigCancel.addEventListener("click", event => {
    if(priceConfigCancel.classList.contains("button_disabled")) {
      event.preventDefault();
    } else {
      event.preventDefault();
      priceConfigCancel.classList.add("button_disabled");
      priceConfigSave.classList.add("button_disabled");

      showPrices(data, currentPriceConfig)
    }
  })

  priceConfigSave.addEventListener("click", event => {
    if(priceConfigSave.classList.contains("button_disabled")) {
      event.preventDefault();
    } else {
      savePrices(currentPriceConfig);
    }
  })

  openList.firstElementChild.classList.add("hall_item-selected");
  currentOpen = openList.firstElementChild.getAttribute("data-id");

  checkHallOpen(data, currentOpen);

  hallsConfigItems = document.querySelectorAll(".hall-config__item");

  hallsConfigItems.forEach(item => {
    item.addEventListener("click", () => {
      hallsConfigItems.forEach(i => {
        i.classList.remove("hall_item-selected");
      })

      item.classList.add("hall_item-selected");

      if(item.classList.contains("hall_item-selected")) {
        currentHallConfig = item.getAttribute("data-id");
      }

      hallConfigCancel.classList.add("button_disabled");
      hallConfigSave.classList.add("button_disabled");

      currentHallConfigIndex = data.result.halls.findIndex(hall => hall.id === Number(currentHallConfig));

      hallConfigRows.value = data.result.halls[currentHallConfigIndex].hall_rows;
      hallConfigPlaces.value = data.result.halls[currentHallConfigIndex].hall_places;

      showHall(data, currentHallConfigIndex);
      changePlaces(hallSchemeRows, data);

      changeHallSize(newHallConfigArray, data);

    })

  })

  // выбор зала в блоке "Конфигурация цен"

  priceConfigItems = document.querySelectorAll(".price-config__item");

  priceConfigItems.forEach(item => {
    item.addEventListener("click", () => {
      priceConfigItems.forEach(i => {
        i.classList.remove("hall_item-selected");
      })
  
      item.classList.add("hall_item-selected");

      if(item.classList.contains("hall_item-selected")) {
        currentPriceConfig = item.getAttribute("data-id");
      }

      priceConfigCancel.classList.add("button_disabled");
      priceConfigSave.classList.add("button_disabled");

      showPrices(data, currentPriceConfig);
    })

  })

  // выбор зала в блоке "Открыть продажи"

  openItems = document.querySelectorAll(".open__item");

  openItems.forEach(item => {
    item.addEventListener("click", () => {
      openItems.forEach(i => {
        i.classList.remove("hall_item-selected");
      })
  
      item.classList.add("hall_item-selected");

      if(item.classList.contains("hall_item-selected")) {
        currentOpen = item.getAttribute("data-id");
      }

      checkHallOpen(data, currentOpen);
    })
  }) 

  // кнопка "Открыть продажи"

  openButton.addEventListener("click", event => {
    if(openButton.classList.contains("button_disabled")) {
      event.preventDefault();
    } else {
      event.preventDefault();

      openCloseHall(currentOpen, hallNewStatus);

      for(let i = 0; i < data.result.halls.length; i++) {
        if(data.result.halls[i].id === Number(currentOpen)) {
          hallCurrentStatus = data.result.halls[i].hall_open;
        }
      }
    
      if (hallNewStatus === 0) {
        openButton.textContent = "Открыть продажу билетов";
        openInfo.textContent = "Всё готово к открытию";
        hallNewStatus = 1;
      } else {
        openButton.textContent = "Приостановить продажу билетов";
        openInfo.textContent = "Зал открыт";
        hallNewStatus = 0;
      }
    }
  })

  // удалить зал

  hallRemoveButton = document.querySelectorAll(".hall_remove");

  hallRemoveButton.forEach(item => {
    item.addEventListener("click", (e) => {
      let hallId = e.target.previousElementSibling.dataset.id;
      deleteHall(hallId);
    })  
  })

}