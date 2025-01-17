import axios from "axios";
import {
  ADD_PRODUCT_SUCCESS,
  ADD_User_SUCCESS,
  ADD_Video_SUCCESS,
  GET_PRODUCT_SUCCESS,
  GET_User_SUCCESS,
  GET_Video_SUCCESS,
  PATCH_PRODUCT_SUCCESS,
  PATCH_User_SUCCESS,
  PRODUCT_FAILURE,
  PRODUCT_REQUEST,
} from "./actionType";

const BASE_URL = "http://localhost:5001";
const token = JSON.parse(localStorage.getItem('user'))?.token || "";

// Thêm khóa học mới
export const addProduct = (data) => (dispatch) => {
  dispatch({ type: PRODUCT_REQUEST });
  fetch(`${BASE_URL}/courses/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      dispatch({ type: ADD_PRODUCT_SUCCESS, payload: res.data });
    })
    .catch((e) => console.log(e));
};

// Thêm User mới
export const addUser = (data) => (dispatch) => {
  dispatch({ type: PRODUCT_REQUEST });
  fetch(`${BASE_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("userData", res);
      dispatch({ type: ADD_User_SUCCESS, payload: res.data });
    })
    .catch((e) => console.log(e));
};

// Thêm Video vào khóa học
export const addVideo = (data, courseId) => (dispatch) => {
  dispatch({ type: PRODUCT_REQUEST });
  delete data.courseId;
  fetch(`${BASE_URL}/videos/add/${courseId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("userData", res);
      dispatch({ type: ADD_Video_SUCCESS, payload: res.data });
    })
    .catch((e) => console.log(e));
};

// Lấy danh sách khóa học
export const getProduct = (page, limit, search, order) => (dispatch) => {
  dispatch({ type: PRODUCT_REQUEST });
  axios
    .get(`${BASE_URL}/courses?page=${page}&limit=${limit}&q=${search}&sortBy=price&sortOrder=${order}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      console.log("getProduct", res);
      dispatch({ type: GET_PRODUCT_SUCCESS, payload: res.data.course });
    })
    .catch((e) => dispatch({ type: PRODUCT_FAILURE }));
};

// Lấy danh sách User
export const getUser = (page, limit) => (dispatch) => {
  dispatch({ type: PRODUCT_REQUEST });
  axios
    .get(`${BASE_URL}/users?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      console.log("getUsers", res);
      dispatch({ type: GET_User_SUCCESS, payload: res.data.users });
    })
    .catch((e) => dispatch({ type: PRODUCT_FAILURE }));
};

// Lấy danh sách Video
export const getvideo = (page, limit, user) => (dispatch) => {
  dispatch({ type: PRODUCT_REQUEST });
  axios
    .get(`${BASE_URL}/videos?page=${page}&limit=${limit}&user=${user}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      console.log("getVideos", res.data);
      dispatch({ type: GET_Video_SUCCESS, payload: res.data });
    })
    .catch((e) => dispatch({ type: PRODUCT_FAILURE }));
};

// Cập nhật khóa học
export const patchProduct = (id, data) => (dispatch) => {
  dispatch({ type: PRODUCT_REQUEST });
  fetch(`${BASE_URL}/courses/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("patch data is", res.course);
      dispatch({ type: PATCH_PRODUCT_SUCCESS, payload: res.course });
    })
    .catch((e) => console.log(e));
};

// Cập nhật User
export const patchUser = (id, data) => (dispatch) => {
  dispatch({ type: PRODUCT_REQUEST });
  fetch(`${BASE_URL}/users/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("patch data is", res);
      dispatch({ type: PATCH_User_SUCCESS, payload: res });
    })
    .catch((e) => console.log(e));
};

// Xóa khóa học
export const deleteProduct = (id) => (dispatch) => {
  dispatch({ type: PRODUCT_REQUEST });
  axios
    .delete(`${BASE_URL}/courses/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      console.log(res, "deleted");
      dispatch(getProduct(4, 3));
    })
    .catch((e) => dispatch({ type: PRODUCT_FAILURE }));
};

// Xóa User
export const deleteUsers = (id) => (dispatch) => {
  dispatch({ type: PRODUCT_REQUEST });
  axios
    .delete(`${BASE_URL}/users/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      console.log(res, "deleted");
      dispatch(getUser(4, 3));
    })
    .catch((e) => dispatch({ type: PRODUCT_FAILURE }));
};

// Định dạng ngày tháng
export default function convertDateFormat(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear().toString().slice(-2);

  const formattedDate = `${day}/${month}/${year}`;

  if (isNaN(day)) {
    return "No Date Found";
  }

  return formattedDate;
}