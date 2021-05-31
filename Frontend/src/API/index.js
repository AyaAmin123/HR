import Axios from "./api";
import history from "../utilities/History";
export const post = async (url, body) => {
  try {
    if (Axios.defaults.headers.token || url === "auth/login") {
      const { data } = await Axios.post(`${url}`, body);
      return data;
    } else {
      history.push("/hr");
      return {
        valid: false,
        msg: "يجب اعادة الدخول مرة اخري",
      };
    }
  } catch (error) {
    return (
      (error.response && error.response.data) ||
      (error.request && {
        valid: false,
        msg: "تم ارسال الطلب ولكن لم يتم الرد",
      }) || {
        valid: false,
        msg: "حدث مشكلة اثناء الاتصال بالسيرفر",
      }
    );
  }
};

export const get = async (url, params = {}) => {
  try {
    if (Axios.defaults.headers.token) {
      const { data } = await Axios.get(`${url}`, { params });
      return data;
    } else {
      history.push("/hr");
      return {
        valid: false,
        msg: "يجب اعادة الدخول مرة اخري",
      };
    }
  } catch (error) {
    return (
      (error.response && error.response.data) ||
      (error.request && {
        valid: false,
        msg: "تم ارسال الطلب ولكن لم يتم الرد",
      }) || {
        valid: false,
        msg: "حدث مشكلة اثناء الاتصال بالسيرفر",
      }
    );
  }
};
