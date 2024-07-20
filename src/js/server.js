class ApiService {
  constructor() {
      this.baseURL = "https://shfe-diplom.neto-server.ru";
  }

  async fetchData(endpoint) {
      try {
          const response = await fetch(`${this.baseURL}${endpoint}`);
          if (!response.ok) {
              throw new Error(`Ошибка: ${response.status}`);
          }
          return await response.json();
      } catch (error) {
          console.error("Не удалось получить данные:", error);
          throw error;
      }
  }

  async getAllData() {
      return await this.fetchData("/alldata");
  }

  // метод для получения схемы зала
  async getHallConfig(seanceId, chosenDate) {
    const endpoint = `/hallconfig?seanceId=${seanceId}&date=${chosenDate}`;
    try {
      const data = await this.fetchData(endpoint);
      showHallScheme(data);
      choosePlaces(hallSchemeRows);
      clickButton();
  } catch (error) {
      console.error("Ошибка при загрузке схемы зала:", error);
  }
  }
}