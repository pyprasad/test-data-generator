import axios from "axios";

const api = {
    generateTestData: (fields, types, constraints, strategy) => {
        return axios.post("http://localhost:5050/api/testdata/generate", {
            fields, types, constraints, strategy
        });
    }

};

export default api;
