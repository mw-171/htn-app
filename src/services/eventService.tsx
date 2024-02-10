import axios from "axios";

const API_URL = "https://api.hackthenorth.com/v3/events";

class EventService {
  getEvents() {
    return axios.get(API_URL);
  }

  getEventId(eventId: number) {
    return axios.get(API_URL + "/" + eventId);
  }
}

export default new EventService();
