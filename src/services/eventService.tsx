import axios from "axios";

//backend endpoint
const API_URL = "https://api.hackthenorth.com/v3/events";

//OOP class for axios calls
class EventService {
  getEvents() {
    return axios.get(API_URL);
  }

  getEventId(eventId: number) {
    return axios.get(API_URL + "/" + eventId);
  }
}

export default new EventService();
