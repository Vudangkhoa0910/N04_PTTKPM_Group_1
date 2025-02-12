import {
  Box,
  Grid,
  Button,
  Text,
  Image,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  Heading,
  Divider,
  useColorMode,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProduct, getUser, getCourseEnrollments } from "../../Redux/TeacherReducer/action";
import { AiOutlineUser, AiOutlineMessage, AiOutlineBell } from "react-icons/ai";
import { IoPeopleSharp } from "react-icons/io5";
import { TiThLargeOutline } from "react-icons/ti";
import { BsFillSunFill, BsFillMoonStarsFill, BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
import convertDateFormat from "../../Redux/TeacherReducer/action";
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const TeacherDashboard = () => {
  const store = useSelector((store) => store.TeacherReducer.data);
  const userStore = useSelector((store) => store.TeacherReducer.users);
  const dispatch = useDispatch();
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [showContent, setShowContent] = useState("courses");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const reduxCourseEnrollments = useSelector((store) => store.TeacherReducer.courseEnrollments); // Lấy enrollments từ Redux store **ngoài** function
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [messages, setMessages] = useState([
    { sender: "Student 1", message: "Hi.", timestamp: new Date(Date.now() - 300000) },
    { sender: "Student 2", message: "Hi", timestamp: new Date(Date.now() - 3600000) },
    { sender: "Student 3", message: "He", timestamp: new Date(Date.now() - 86400000) },
    { sender: "Student 1", message: "He", timestamp: new Date(Date.now() - 172800000) },
  ]);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Nam Phan đẹp trai đã tham gia khoá học.", timestamp: new Date(Date.now() - 60000) },
    { id: 2, message: "Bài tập mới đã được giao cho khóa học Lập trình Web.", timestamp: new Date(Date.now() - 3600000) },
    { id: 3, message: "Có 3 học sinh đã hoàn thành bài kiểm tra cuối khóa.", timestamp: new Date(Date.now() - 86400000) },
  ]);
  const isLoadingEnrollments = useSelector((store) => store.TeacherReducer.isLoadingEnrollments);
  const isErrorEnrollments = useSelector((store) => store.TeacherReducer.isErrorEnrollments);
  const [page] = useState(1);
  const [search] = useState("");
  const [order] = useState("");
  const limit = 9999;

  const { colorMode, toggleColorMode } = useColorMode();
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData ? userData.userId : null;
  const token = userData ? userData.token : null;

  useEffect(() => {
    dispatch(getUser(1, 1000, "", ""));
  }, [dispatch]);

  useEffect(() => {
    if (userStore) {
      const studentsOnly = userStore.filter(user => user.role !== 'teacher' && user.role !== 'admin');
      setFilteredUsers(studentsOnly);
    }
  }, [userStore]);

  useEffect(() => {
    if (userId) {
      dispatch(getProduct(page, limit, search, order, userId))
    }
  }, [dispatch, userId, page, limit, search, order]);

  useEffect(() => {
    if (store) {
      const coursesForTeacher = store.filter(
        (course) => {
          const courseTeacherId = course.teacherId?.$oid || course.teacherId;
          return courseTeacherId === userId;
        }
      );
      setFilteredCourses(coursesForTeacher);
      setTotalCourses(coursesForTeacher.length);
    } else {
      setFilteredCourses([]);
      setTotalCourses(0);
    }
  }, [store, userId]);

  useEffect(() => {
    let revenue = 0;
    if (filteredCourses) {
      revenue = filteredCourses.reduce((acc, el) => acc + (el.price || 0), 0);
    }
    setTotalRevenue(revenue);
  }, [filteredCourses]);

  // **EFFECT ĐỂ FETCH TẤT CẢ ENROLLMENTS (chỉ dispatch action)**
  useEffect(() => {
    const fetchAllEnrollments = async () => {
      console.log("fetchAllEnrollments: Bắt đầu dispatch getCourseEnrollments..."); // LOG Bắt đầu fetch
      try {
        await dispatch(getCourseEnrollments()); // Gọi action lấy TẤT CẢ enrollments, chỉ dispatch, không xử lý trực tiếp ở đây
      } catch (error) {
        console.error("fetchAllEnrollments: Lỗi dispatch getCourseEnrollments:", error); // LOG Lỗi dispatch
        setTotalStudents(0); // Đặt totalStudents về 0 nếu lỗi fetch enrollments (tùy chọn)
      }
    };
    fetchAllEnrollments();
  }, [dispatch]); // Effect này chỉ phụ thuộc vào dispatch

  // **EFFECT ĐỂ TÍNH TOÁN totalStudents KHI reduxCourseEnrollments THAY ĐỔI**
  useEffect(() => {
    console.log("useEffect [reduxCourseEnrollments]: reduxCourseEnrollments vừa thay đổi:", reduxCourseEnrollments); // LOG: Kiểm tra effect này chạy khi nào

    if (reduxCourseEnrollments && Array.isArray(reduxCourseEnrollments)) {
      const allEnrollments = reduxCourseEnrollments; // Enrollments đã có trong Redux store

      console.log("useEffect [reduxCourseEnrollments]: Dữ liệu enrollments nhận được:", allEnrollments); // LOG Dữ liệu enrollments

      // Đếm số học sinh duy nhất
      const uniqueStudentIds = new Set();
      allEnrollments.forEach(enrollment => {
        if (enrollment.userId && enrollment.userId._id) {
          uniqueStudentIds.add(enrollment.userId._id);
        }
      });
      setTotalStudents(uniqueStudentIds.size);
      console.log("useEffect [reduxCourseEnrollments]: Số lượng học sinh duy nhất:", uniqueStudentIds.size); // LOG Số lượng học sinh duy nhất
    } else {
      console.warn("useEffect [reduxCourseEnrollments]: Không có enrollments hoặc dữ liệu không hợp lệ:", reduxCourseEnrollments); // LOG Cảnh báo dữ liệu không hợp lệ
      setTotalStudents(0); // Đặt totalStudents về 0 nếu không có dữ liệu hợp lệ
    }
  }, [reduxCourseEnrollments]); // Effect này chạy khi reduxCourseEnrollments thay đổi


  const handleShowContent = (contentType, courseId = null) => {
    setShowContent(contentType);
    setSelectedCourseId(courseId);
    if (contentType === "students-course-detail" && courseId) {
      dispatch(getCourseEnrollments(courseId))
        .catch(error => {
          console.error("Error in getCourseEnrollments action:", error);
        })
    } else if (contentType === "students") {
      setShowContent("students-courses");
    }
  };


  return (
    <Grid
      className="Nav"
      h="100vh"
      w="100%"
      placeItems="center"
      px={4}
      templateColumns={{ base: "1fr", md: "200px 1fr" }}
      gap={6}
    >
      {/* Sidebar */}
      <Box
        mt="90px"
        borderRadius="50px"
        boxShadow="md"
        bg={colorMode === "light" ? "gray.300" : "gray.500"}
        h="70vh"
        w="90px"
      >
        <Box
          p={4}
          display="flex"
          flexDirection="column"
          gap={4}
          justifyContent="space-around"
          height="100%"
        >
          {/* Home Icon */}
          <Flex
            justifyContent="center"
            bg="transparent"
            onClick={() => handleShowContent("courses")}
            cursor="pointer"
          >
            <TiThLargeOutline size={24} color={colorMode === "light" ? "black" : "white"} />
          </Flex>

          {/* Student Icon */}
          <Flex
            justifyContent="center"
            bg="transparent"
            onClick={() => handleShowContent("students")}
            cursor="pointer"
          >
            <IoPeopleSharp size={24} color={colorMode === "light" ? "black" : "white"} />
          </Flex>

          {/* Message Icon */}
          <Flex
            justifyContent="center"
            bg="transparent"
            onClick={() => handleShowContent("messages")}
            cursor="pointer"
          >
            <AiOutlineMessage size={24} color={colorMode === "light" ? "black" : "white"} />
          </Flex>

          {/* Notification Icon */}
          <Flex
            justifyContent="center"
            bg="transparent"
            onClick={() => handleShowContent("notifications")}
            cursor="pointer"
          >
            <AiOutlineBell size={24} color={colorMode === "light" ? "black" : "white"} />
          </Flex>
          <Button onClick={toggleColorMode} size={"sm"} bg="transparent">
            {colorMode === "light" ? (
              <BsFillMoonStarsFill size={20} color="black" />
            ) : (
              <BsFillSunFill size={20} color="white" />
            )}
          </Button>
        </Box>
      </Box>

      {/* Content Area */}
      <Box w="100%" mt="90px">
        {showContent === "courses" && (
          <>
            {/* Dashboard Cards */}
            <Grid templateColumns="repeat(4, 1fr)" gap={6} mb={6}>
              {/* Total Students Card */}
              <Box
                bg={colorMode === "light" ? "white" : "gray.700"}
                borderRadius="lg"
                boxShadow="md"
                p={4}
              >
                <Text fontSize="xl" fontWeight="bold" color={colorMode === "light" ? "black" : "white"}>
                  Tổng Học Sinh
                </Text>
                <Text color={colorMode === "light" ? "black" : "white"}>{totalStudents}</Text>
              </Box>
              {/* Total Courses Card */}
              <Box
                bg={colorMode === "light" ? "white" : "gray.700"}
                borderRadius="lg"
                boxShadow="md"
                p={4}
              >
                <Text fontSize="xl" fontWeight="bold" color={colorMode === "light" ? "black" : "white"}>
                  Tổng Số Khóa Học
                </Text>
                <Text color={colorMode === "light" ? "black" : "white"}>{totalCourses}</Text>
              </Box>
              {/* Average Rating Card */}
              <Box
                bg={colorMode === "light" ? "white" : "gray.700"}
                borderRadius="lg"
                boxShadow="md"
                p={4}
              >
                <Text fontSize="xl" fontWeight="bold" color={colorMode === "light" ? "black" : "white"}>
                  Đánh Giá Trung Bình
                </Text>
                <Flex alignItems="center" mt={2}>
                  <BsStarFill color="gold" />
                  <BsStarFill color="gold" />
                  <BsStarFill color="gold" />
                  <BsStarFill color="gold" />
                  <BsStarHalf color="gold" />
                  <Text ml={2} color={colorMode === "light" ? "black" : "white"}>4.7</Text>
                </Flex>
              </Box>
              {/* Revenue Card */}
              <Box
                bg={colorMode === "light" ? "white" : "gray.700"}
                borderRadius="lg"
                boxShadow="md"
                p={4}
              >
                <Text fontSize="xl" fontWeight="bold" color={colorMode === "light" ? "black" : "white"}>
                  Doanh Thu
                </Text>
                <Text color={colorMode === "light" ? "black" : "white"}>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalRevenue)}
                </Text>
              </Box>
            </Grid>

            {/* Courses Grid */}
            <Box
              w="100%"
              bg={colorMode === "light" ? "gray.100" : "gray.600"}
              borderRadius="lg"
              boxShadow="md"
              p={4}
            >
              <Box w="100%">
                <Grid
                  templateColumns={{
                    base: "repeat(2, 1fr)",
                    md: "repeat(4, 1fr)",
                    lg: "repeat(6, 1fr)",
                  }}
                  gap={6}
                >
                  {isLoadingEnrollments ? (
                    <Text textAlign="center" color={colorMode === "light" ? "black" : "white"}>Loading courses...</Text>
                  ) : filteredCourses?.length > 0 ? (
                    filteredCourses.map((el, i) => (
                      <Box
                        key={i}
                        borderRadius="lg"
                        boxShadow="md"
                        overflow="hidden"
                        bg={colorMode === "light" ? "white" : "gray.700"}
                      >
                        <Image
                          display="block"
                          src={el.img || "https://via.placeholder.com/150"}
                          alt={el.title || "Course Image"}
                          w="100%"
                          h="100px"
                          objectFit="cover"
                        />
                        <Box p={4}>
                          <Text fontSize="xl" fontWeight="bold" mb={2} color={colorMode === "light" ? "black" : "white"}>
                            {el.title || "N/A"}
                          </Text>
                          <Text fontSize="md" mb={2} color={colorMode === "light" ? "black" : "white"}>
                            {el.description || "N/A"}
                          </Text>
                          <Text fontSize="lg" fontWeight="bold" color={colorMode === "light" ? "black" : "white"}>
                            ${el.price || "N/A"}
                          </Text>
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Text color={colorMode === "light" ? "black" : "white"}>No data available for this teacher</Text>
                  )}
                </Grid>
              </Box>
            </Box>
          </>
        )}

        {showContent === "students-courses" && (
          <Box
            w="100%"
            bg={colorMode === "light" ? "gray.100" : "gray.600"}
            borderRadius="lg"
            boxShadow="md"
            p={4}
          >
            <Text fontSize="xl" fontWeight="bold" mb={4} color={colorMode === "light" ? "black" : "white"}>Danh sách khóa học của bạn</Text>
            {/* Thay thế Grid bằng Box và ScrollView */}
            <Box maxH="400px" overflowY="auto"> {/* Sử dụng Box làm container cuộn */}
              <VStack spacing={4} align="stretch">
                {filteredCourses?.length > 0 ? (
                  filteredCourses.map((course, index) => (
                    <Box
                      key={index}
                      borderRadius="lg"
                      boxShadow="md"
                      p={4}
                      bg={colorMode === "light" ? "white" : "gray.700"}
                      cursor="pointer"
                      onClick={() => handleShowContent("students-course-detail", course._id.$oid || course._id)}
                      _hover={{ bg: colorMode === "light" ? "gray.200" : "gray.600" }}
                    >
                      <Text fontSize="lg" fontWeight="bold" color={colorMode === "light" ? "black" : "white"}>{course.title}</Text>
                      {/* Thêm thông tin khác về khóa học nếu muốn */}
                    </Box>
                  ))
                ) : (
                  <Text color={colorMode === "light" ? "black" : "white"}>Không có khóa học nào.</Text>
                )}
              </VStack>
            </Box>
          </Box>
        )}

        {showContent === "students-course-detail" && (
          <Box
            w="100%"
            bg={colorMode === "light" ? "gray.100" : "gray.600"}
            borderRadius="lg"
            boxShadow="md"
            p={4}
            overflowX="auto"
          >
            <Text fontSize="xl" fontWeight="bold" mb={4} color={colorMode === "light" ? "black" : "white"}>
              Danh sách học sinh khóa học: {filteredCourses.find(c => (c._id.$oid || c._id) === selectedCourseId)?.title || "N/A"}
            </Text>
            {isLoadingEnrollments ? (
              <Text textAlign="center" color={colorMode === "light" ? "black" : "white"}>Loading students...</Text>
            ) : isErrorEnrollments ? (
              <Text textAlign="center" color="red.500">Error fetching students.</Text>
            ) : (
              <Table variant="simple" colorScheme={colorMode === "light" ? "teal" : "gray"} size="sm">
                <Thead>
                  <Tr>
                    <Th color={colorMode === "light" ? "black" : "white"}>Name</Th>
                    <Th color={colorMode === "light" ? "black" : "white"}>Email</Th>
                    <Th color={colorMode === "light" ? "black" : "white"}>Role</Th>
                    <Th color={colorMode === "light" ? "black" : "white"}>Joined Date</Th>
                    <Th color={colorMode === "light" ? "black" : "white"}>Enrollment Date</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {reduxCourseEnrollments?.length > 0 ? (
                    reduxCourseEnrollments.map((enrollment, index) => {
                      const user = enrollment.userId;
                      return (
                        <Tr key={index}>
                          <Td color={colorMode === "light" ? "black" : "white"}>{user?.name || "N/A"}</Td>
                          <Td color={colorMode === "light" ? "black" : "white"}>{user?.email || "N/A"}</Td>
                          <Td color={colorMode === "light" ? "black" : "white"}>{user?.role || "N/A"}</Td>
                          <Td color={colorMode === "light" ? "black" : "white"}>{convertDateFormat(user?.createdAt) || "N/A"}</Td>
                          <Td color={colorMode === "light" ? "black" : "white"}>{convertDateFormat(enrollment.enrollmentDate) || "N/A"}</Td>
                        </Tr>
                      );
                    })
                  ) : (
                    <Tr>
                      <Td colSpan={5} textAlign="center" color={colorMode === "light" ? "black" : "white"}>Không có học sinh nào đăng ký khóa học này.</Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            )}
          </Box>
        )}

        {showContent === "students" && (
          <Box
            w="100%"
            bg={colorMode === "light" ? "gray.100" : "gray.600"}
            borderRadius="lg"
            boxShadow="md"
            p={4}
            overflowX="auto"
          >
            <Text fontSize="xl" fontWeight="bold" mb={4} color={colorMode === "light" ? "black" : "white"}>Student List (Tính năng này đã được thay đổi)</Text>
            <Text color={colorMode === "light" ? "black" : "white"}>
              Vui lòng chọn biểu tượng Học viên để xem danh sách các khóa học của bạn, sau đó chọn một khóa học để xem danh sách học viên của khóa học đó.
            </Text>
          </Box>
        )}


        {showContent === "messages" && (
          <Box
            w="100%"
            bg={colorMode === "light" ? "gray.100" : "gray.600"}
            borderRadius="lg"
            boxShadow="md"
            p={4}
          >
            <Heading size="md" mb={4} color={colorMode === "light" ? "black" : "white"}>Student Messages</Heading>
            <VStack spacing={4} align="stretch">
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <Box
                    key={index}
                    bg={colorMode === "light" ? "white" : "gray.700"}
                    borderRadius="md"
                    p={3}
                    boxShadow="sm"
                  >
                    <Flex justify="space-between" align="center" mb={2}>
                      <Text fontWeight="bold" color={colorMode === "light" ? "blue.500" : "blue.300"}>{msg.sender}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {formatDistanceToNow(msg.timestamp, { addSuffix: true, locale: vi })}
                      </Text>
                    </Flex>
                    <Divider mb={2} />
                    <Text color={colorMode === "light" ? "black" : "white"}>{msg.message}</Text>
                  </Box>
                ))
              ) : (
                <Text color="gray.500">No messages yet.</Text>
              )}
            </VStack>
          </Box>
        )}

        {showContent === "notifications" && (
          <Box
            w="100%"
            bg={colorMode === "light" ? "gray.100" : "gray.600"}
            borderRadius="lg"
            boxShadow="md"
            p={4}
          >
            <Heading size="md" mb={4} color={colorMode === "light" ? "black" : "white"}>Thông báo</Heading>
            <VStack spacing={4} align="stretch">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <Box
                    key={notification.id}
                    bg={colorMode === "light" ? "white" : "gray.700"}
                    borderRadius="md"
                    p={3}
                    boxShadow="sm"
                  >
                    <Flex justify="space-between" align="center" mb={2}>
                      <Text fontWeight="bold" color={colorMode === "light" ? "green.500" : "green.300"}>Thông báo mới</Text>
                      <Text fontSize="sm" color="gray.500">
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true, locale: vi })}
                      </Text>
                    </Flex>
                    <Divider mb={2} />
                    <Text color={colorMode === "light" ? "black" : "white"}>{notification.message}</Text>
                  </Box>
                ))
              ) : (
                <Text color="gray.500">Không có thông báo mới.</Text>
              )}
            </VStack>
          </Box>
        )}
      </Box>
    </Grid>
  );
};

export default TeacherDashboard;