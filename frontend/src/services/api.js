import axios from "axios";

const api = {
  generateTestData: (fields, types, strategy) => {
    return axios.post("http://localhost:5050/api/testdata/generate", {
      fields,
      types,
      strategy
    });
  }
};

export default api;
