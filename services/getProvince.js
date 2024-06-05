const axios = require('axios');
const API_PROVINCE = "https://vapi.vnappmob.com/api/province/";

module.exports.getProvince = async () => {
    try {
        const response = await axios.get(API_PROVINCE);
        return response.data.results;
    } catch (error) {
        console.error(error);
    }
}

module.exports.getDistrict = async (province_id) => {
    try {
        const response = await axios.get(API_PROVINCE + `district/${province_id}`);
        return response.data.results;
    } catch (error) {
        console.error(error);
    }
}
module.exports.getWard = async (district_id) => {
    try {
        const response = await axios.get(API_PROVINCE + `ward/${district_id}`);
        return response.data.results;
    } catch (error) {
        console.error(error);
    }
}