
// import axios from "axios"
// import { ADD_PRODUCT_SUCCESS, ADD_User_SUCCESS, ADD_Video_SUCCESS, GET_PRODUCT_SUCCESS, GET_User_SUCCESS, GET_Video_SUCCESS, PATCH_PRODUCT_SUCCESS, PATCH_User_SUCCESS, PRODUCT_FAILURE, PRODUCT_REQUEST } from "./actionType"


// const token = JSON.parse(localStorage.getItem('user'))?.token || "";



// export const changeRole = (data,userId) => (dispatch) => {
//     dispatch({ type: PRODUCT_REQUEST });
//     fetch(`https://elearning-platform-using-mern-j5py.vercel.app/users/Teachme/${userId}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`
//       },
//       // GET requests don't have a body, so no need to stringify data
//     })
//       .then((res) => res.json())
//       .then((res) => {
//         dispatch({ type: ADD_PRODUCT_SUCCESS, payload: res.data });
//       })
//       .catch((e) => console.log(e));
// };

// export const getCourse = (data,userId) => (dispatch) => {
//   dispatch({ type: PRODUCT_REQUEST });
//   fetch(`https://elearning-platform-using-mern-j5py.vercel.app/courses/a/${userId}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`
//     },
//     // GET requests don't have a body, so no need to stringify data
//   })
//     .then((res) => res.json())
//     .then((res) => {
//       dispatch({ type: ADD_PRODUCT_SUCCESS, payload: res.data });
//     })
//     .catch((e) => console.log(e));
// };

// export const addProduct=(data)=>(dispatch)=>{
//   dispatch({type:PRODUCT_REQUEST})
//   fetch("https://elearning-platform-using-mern-j5py.vercel.app/courses/add",{
//     method:"POST",
//     headers:{
//       "Content-Type":"application/json",
//       Authorization:`Bearer ${token}`
//     },
//     body:JSON.stringify(data)
//   }).then(res=>res.json()).then((res)=>{console.log(res);
//       dispatch({type:ADD_PRODUCT_SUCCESS,payload:res.data})
//   }).catch(e=>console.log(e))
// }

// export const addUser=(data)=>(dispatch)=>{
//   dispatch({type:PRODUCT_REQUEST})
//   fetch("https://elearning-platform-using-mern-j5py.vercel.app/users/register",{
//     method:"POST",
//     headers:{
//       "Content-Type":"application/json",
//       Authorization:`Bearer ${token}`
//     },
//     body:JSON.stringify(data)
//   }).then(res=>res.json()).then((res)=>{console.log("userData",res);
//       dispatch({type:ADD_User_SUCCESS,payload:res.data})
//   }).catch(e=>console.log(e))
// }
// export const addVideo=(data,courseId)=>(dispatch)=>{
//   dispatch({type:PRODUCT_REQUEST})
//   delete data.courseId
//   fetch(`https://elearning-platform-using-mern-j5py.vercel.app/videos/add/${courseId}`,{
//     method:"POST",
//     headers:{
//       "Content-Type":"application/json",
//       Authorization:`Bearer ${token}`
//     },
//     body:JSON.stringify(data)
//   }).then(res=>res.json()).then((res)=>{console.log("userData",res);
//       dispatch({type:ADD_Video_SUCCESS,payload:res.data})
//   }).catch(e=>console.log(e))
// }


// export const getProduct=(page,limit,search,order)=>(dispatch)=>{
//     dispatch({type:PRODUCT_REQUEST})
//     axios.get(`https://elearning-platform-using-mern-j5py.vercel.app/courses?page=${page}&limit=${limit}&q=${search}&sortBy=price&sortOrder=${order}`,{
//       headers:{
//         Authorization:`Bearer ${token}`
//       }
//     }).then((res)=>{console.log("getProduct",res);
//     dispatch({type:GET_PRODUCT_SUCCESS,payload:res.data.course})
//     }).catch(e=>dispatch({type:PRODUCT_FAILURE}))
   
// }
// export const getUser=(page,limit,search,order)=>(dispatch)=>{
//     dispatch({type:PRODUCT_REQUEST})
//     axios.get(`https://elearning-platform-using-mern-j5py.vercel.app/users?page=${page}&limit=${limit}`,{
//       headers:{
//         Authorization:`Bearer ${token}`
//       }
//     }).then((res)=>{console.log("getUsers",res);
//     dispatch({type:GET_User_SUCCESS,payload:res.data.users})
//     }).catch(e=>dispatch({type:PRODUCT_FAILURE}))
   
// }
// export const getvideo=(page,limit,user)=>(dispatch)=>{
//     dispatch({type:PRODUCT_REQUEST})
//     axios.get(`https://elearning-platform-using-mern-j5py.vercel.app/videos?page=${page}&limit=${limit}&user=${user}`,{
//       headers:{
//         Authorization:`Bearer ${token}`
//       }
//     }).then((res)=>{console.log("getVideos",res.data);
//     dispatch({type:GET_Video_SUCCESS,payload:res.data})
//     }).catch(e=>dispatch({type:PRODUCT_FAILURE}))
   
// }

// export const patchProduct=(id,data)=>(dispatch)=>{
//   dispatch({type:PRODUCT_REQUEST})
//   fetch(`https://elearning-platform-using-mern-j5py.vercel.app/courses/update/${id}`,{
//     method:"PATCH",
//     headers:{
//       "Content-Type":"application/json",
//       Authorization:`Bearer ${token}`
//     },
//     body:JSON.stringify(data)
//   }).then(res=>res.json()).then((res)=>{console.log("patch data is",res.course);
//       dispatch({type:PATCH_PRODUCT_SUCCESS,payload:res.course})
//   }).catch(e=>console.log(e))
// }
// export const patchUser=(id,data)=>(dispatch)=>{
//   dispatch({type:PRODUCT_REQUEST})
//   fetch(`https://elearning-platform-using-mern-j5py.vercel.app/users/update/${id}`,{
//     method:"PATCH",
//     headers:{
//       "Content-Type":"application/json",
//       Authorization:`Bearer ${token}`
//     },
//     body:JSON.stringify(data)
//   }).then(res=>res.json()).then((res)=>{console.log("patch data is",res);
//       dispatch({type:PATCH_User_SUCCESS,payload:res})
//   }).catch(e=>console.log(e))
// }


// export const deleteProduct=(id)=>(dispatch)=>{
//     dispatch({type:PRODUCT_REQUEST});
//     axios.delete(`https://elearning-platform-using-mern-j5py.vercel.app/courses/delete/${id}`,{
//       headers:{
//         Authorization:`Bearer ${token}`
//       }
//     }).then((res)=>{console.log(res,"deleted");
//     dispatch(getProduct(4,3))}).catch(e=>dispatch({type:PRODUCT_FAILURE}))
// }
// export const deleteUsers=(id)=>(dispatch)=>{
//     dispatch({type:PRODUCT_REQUEST});
//     axios.delete(`https://elearning-platform-using-mern-j5py.vercel.app/users/delete/${id}`,{
//       headers:{
//         Authorization:`Bearer ${token}`
//       }
//     }).then((res)=>{console.log(res,"deleted");
//     dispatch(getUser(4,3))}).catch(e=>dispatch({type:PRODUCT_FAILURE}))
// }


// export default function convertDateFormat(dateString) {
//   const date = new Date(dateString);
//   const day = date.getDate();
//   const month = date.getMonth() + 1; 
//   const year = date.getFullYear().toString().slice(-2);

//   const formattedDate = `${day}/${month}/${year}`;

//   if(isNaN(day)){
//     return 'No Date Found'
//   }

//   return formattedDate;
// }

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
  GET_COURSE_ENROLLMENTS_REQUEST, // Import action types mới
  GET_COURSE_ENROLLMENTS_SUCCESS,
  GET_COURSE_ENROLLMENTS_FAILURE,
} from "./actionType";

const BASE_URL = "http://localhost:5001"; // Cập nhật URL backend localhost
const token = JSON.parse(localStorage.getItem("user"))?.token || "";

// Thay đổi Role của User
export const changeRole = (data, userId) => (dispatch) => {
  dispatch({ type: PRODUCT_REQUEST });
  fetch(`${BASE_URL}/users/Teachme/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      dispatch({ type: ADD_PRODUCT_SUCCESS, payload: res.data });
    })
    .catch((e) => console.log(e));
};

// Lấy thông tin khóa học theo User ID
export const getCourse = (data, userId) => (dispatch) => {
  dispatch({ type: PRODUCT_REQUEST });
  fetch(`${BASE_URL}/courses/a/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      dispatch({ type: ADD_PRODUCT_SUCCESS, payload: res.data });
    })
    .catch((e) => console.log(e));
};

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
      if (res.data) {
        dispatch({ type: ADD_PRODUCT_SUCCESS, payload: res.data });
      } else {
        console.error("Invalid response from server:", res);
      }
    })
    .catch((e) => console.error("Error adding course:", e));
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
export const getProduct = (page, limit, search, order) => async (dispatch) => {
  dispatch({ type: PRODUCT_REQUEST });

  const userData = JSON.parse(localStorage.getItem("user"));
  if (!userData || !userData.userId) {
    console.error("Error: userData is missing or invalid in localStorage.");
    alert("Unable to retrieve user ID. Please log in again.");
    return;
  }
  const userId = userData.userId;

  try {
    const res = await axios.get(
      `${BASE_URL}/courses?page=${page}&limit=${limit}&q=${search}&sortBy=price&sortOrder=${order}`,
      {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      }
    );
    console.log("API response data:", res.data); // Log response để xem cấu trúc

    const filteredCourses = res.data.course.filter(course => {
      if (course.teacherId?.$oid) {
        return course.teacherId.$oid === userId;
      }
      return course.teacherId === userId;
    });

    dispatch({
      type: GET_PRODUCT_SUCCESS,
      payload: {
        courses: filteredCourses, // Payload chính là object chứa courses và thông tin phân trang
        totalPages: res.data.totalPages, // Lấy totalPages từ response
        totalCourses: res.data.totalCourses, // Lấy totalCourses từ response (nếu có)
        currentPage: res.data.currentPage, // Lấy currentPage từ response (nếu có)
      },
    });
  } catch (e) {
    dispatch({ type: PRODUCT_FAILURE });
    console.error("Error fetching courses:", e);
  }
};



// Lấy danh sách User
export const getUser = (page, limit, search, order) => (dispatch) => {
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

// Cập nhật thông tin khóa học
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

// Cập nhật thông tin User
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
};


export const getCourseEnrollments = () => async (dispatch) => {
  dispatch({ type: GET_COURSE_ENROLLMENTS_REQUEST });
  try {
    const response = await axios.get(`${BASE_URL}/enrollments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch({ type: GET_COURSE_ENROLLMENTS_SUCCESS, payload: response.data }); 
    return response.data;
  } catch (error) {
    dispatch({ type: GET_COURSE_ENROLLMENTS_FAILURE });
    dispatch({ type: PRODUCT_FAILURE });
    console.error("Error fetching course enrollments:", error);
    return [];
  }
};


