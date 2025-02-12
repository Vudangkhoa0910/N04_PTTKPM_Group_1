import {
  ADD_PRODUCT_SUCCESS,
  ADD_User_SUCCESS,
  ADD_Video_SUCCESS,
  DELETE_PRODUCT_SUCCESS,
  DELETE_User_SUCCESS,
  DELETE_Video_SUCCESS,
  GET_PRODUCT_SUCCESS,
  GET_User_SUCCESS,
  GET_Video_SUCCESS,
  PATCH_PRODUCT_SUCCESS,
  PATCH_User_SUCCESS,
  PATCH_Video_SUCCESS,
  PRODUCT_FAILURE,
  PRODUCT_REQUEST,
  GET_COURSE_ENROLLMENTS_REQUEST,
  GET_COURSE_ENROLLMENTS_SUCCESS,
  GET_COURSE_ENROLLMENTS_FAILURE,
} from "./actionType";

const initState = {
  videos: [],
  users: [],
  data: [], // Sẽ chứa danh sách khóa học cho trang hiện tại
  isLoading: false,
  isError: false,
  courseEnrollments: [],
  isLoadingEnrollments: false,
  isErrorEnrollments: false,
  totalPages: 1,      // Thêm totalPages vào initState, mặc định là 1
  totalCourses: 0,     // Thêm totalCourses vào initState, mặc định là 0
  currentPage: 1,      // Thêm currentPage vào initState, mặc định là 1 (nếu cần)
};

export const reducer = (state = initState, { type, payload }) => {
  switch (type) {
    case PRODUCT_REQUEST:
      return { ...state, isLoading: true, isError: false };
    case PRODUCT_FAILURE:
      return { ...state, isLoading: false, isError: true };
    case GET_PRODUCT_SUCCESS:
      console.log("Updated courses with pagination data:", payload); // Log payload mới
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: payload.courses,           // Cập nhật danh sách khóa học từ payload.courses
        totalPages: payload.totalPages,     // Cập nhật totalPages từ payload
        totalCourses: payload.totalCourses,   // Cập nhật totalCourses từ payload (nếu có)
        currentPage: payload.currentPage,     // Cập nhật currentPage từ payload (nếu có)
      };
    case GET_User_SUCCESS:
      return { ...state, isLoading: false, users: payload };
    case GET_Video_SUCCESS:
      return { ...state, isLoading: false, videos: payload };
    case ADD_PRODUCT_SUCCESS:
      return { ...state, isLoading: false, data: [...state.data, payload] };
    case ADD_User_SUCCESS:
      return { ...state, isLoading: false, data: [...state.users, payload] };
    case ADD_Video_SUCCESS:
      return { ...state, isLoading: false, data: [...state.videos, payload] };
    case PATCH_PRODUCT_SUCCESS:
      return { ...state, isLoading: false, data: [...state.data, payload] };
    case PATCH_User_SUCCESS:
      return { ...state, isLoading: false, data: [...state.users, payload] };
    case PATCH_Video_SUCCESS:
      return { ...state, isLoading: false, data: [...state.videos, payload] };
    case DELETE_PRODUCT_SUCCESS:
      return { ...state, isLoading: false, data: payload };
    case DELETE_User_SUCCESS:
      return { ...state, isLoading: false, data: payload };
    case DELETE_Video_SUCCESS:
      return { ...state, isLoading: false, data: payload };

    // Cases cho Course Enrollments (giữ nguyên)
    case GET_COURSE_ENROLLMENTS_REQUEST:
      return { ...state, isLoadingEnrollments: true, isErrorEnrollments: false, courseEnrollments: [] };
    case GET_COURSE_ENROLLMENTS_SUCCESS:
      return { ...state, isLoadingEnrollments: false, isErrorEnrollments: false, courseEnrollments: payload };
    case GET_COURSE_ENROLLMENTS_FAILURE:
      return { ...state, isLoadingEnrollments: false, isErrorEnrollments: true, courseEnrollments: [] };

    default:
      return state;
  }
};