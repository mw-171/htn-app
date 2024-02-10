import axios from "axios";

const API_URL = "https://api.hackthenorth.com/v3/graphql";

class EventService {
  getUsers() {
    return axios.get(API_URL);
  }

  getEventId(eventId) {
    return axios.get(API_URL + "/" + eventId);
  }
}

export default new EventService();
