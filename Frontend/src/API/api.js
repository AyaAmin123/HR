import axios from "axios";

export default axios.create({
  // baseURL: "http://10.22.1.33:8080/hr/", UAT
  baseURL: "http://localhost:3001/",
  // baseURL: "http://10.43.30.26:3001/", Hr Server
  // baseURL: "/hr/",
});
