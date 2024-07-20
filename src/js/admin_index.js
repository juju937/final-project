// спойлеры блоков

const headerArrow = document.querySelectorAll(".admin__header_arrow");

headerArrow.forEach(arrow => {
  arrow.addEventListener("click", () => {
    let headerElement = arrow.closest(".admin__header");
    let adminWrapper = headerElement.nextElementSibling;

    arrow.classList.toggle("admin__header_arrow-hide");
    adminWrapper.classList.toggle("hidden");
  })
})

// popups

const popups = Array.from(document.querySelectorAll(".popup"));
const popupClose = Array.from(document.querySelectorAll(".popup__close"));
const popupForms = Array.from(document.querySelectorAll(".popup__form"));
const popupCancel = Array.from(document.querySelectorAll(".popup__button_cancel"));

popups.forEach(popup => {
  popupClose.forEach(element => {
    element.addEventListener("click", () => {
      popup.classList.add("hidden");
    })
  })

  popupForms.forEach(form => {
    popupCancel.forEach(element => {
      element.addEventListener("click", () => {
        popup.classList.add("hidden");
      })
    })
  })
})

// данные с сервера

fetch("https://shfe-diplom.neto-server.ru/alldata")
  .then(response => response.json())
  .then(function(data) {
    console.log(data);
    hallsOperations(data);
    moviesOperations(data);
    seancesOperations(data);
  })