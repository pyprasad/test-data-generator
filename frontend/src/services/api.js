import axios from "axios";

const api = {
    generateTestData: (fields, types, constraints, strategy) => {
        return axios.post("http://localhost:5050/api/testdata/generate", {
            fields, types, constraints, strategy
        });
    },
    generateJsonFromSchema: (prompt) => {
        return axios.post("http://localhost:5050/api/testdata/generate-json", { prompt });
    }


};

export default api;
