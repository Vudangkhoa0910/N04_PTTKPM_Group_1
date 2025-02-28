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
import {
  getProduct,
  getUser,
  getCourseEnrollments,
} from "../../Redux/TeacherReducer/action";
import { AiOutlineUser, AiOutlineMessage, AiOutlineBell } from "react-icons/ai";
import { IoPeopleSharp } from "react-icons/io5";
import { TiThLargeOutline } from "react-icons/ti";
import {
  BsFillSunFill,
  BsFillMoonStarsFill,
  BsStar,
  BsStarFill,
  BsStarHalf,
} from "react-icons/bs";
import convertDateFormat from "../../Redux/TeacherReducer/action";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

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
  const reduxCourseEnrollments = useSelector(
    (store) => store.TeacherReducer.courseEnrollments
  );
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  // const [messages, setMessages] = useState([
  //   {
  //     sender: "Student 1",
  //     message: "Hi.",
  //     timestamp: new Date(Date.now() - 300000),
  //   },
  //   {
  //     sender: "Student 2",
  //     message: "Hi",
  //     timestamp: new Date(Date.now() - 3600000),
  //   },
  //   {
  //     sender: "Student 3",
  //     message: "He",
  //     timestamp: new Date(Date.now() - 86400000),
  //   },
  //   {
  //     sender: "Student 1",
  //     message: "He",
  //     timestamp: new Date(Date.now() - 172800000),
  //   },
  // ]);
  const [messages, setMessages] = useState([]);

  // Thêm useEffect để fetch comments
  useEffect(() => {
    const fetchAllCourseComments = async () => {
      try {
        // Lấy tất cả comments từ các khóa học của giáo viên
        const allComments = await Promise.all(
          filteredCourses.map(async (course) => {
            const courseId = course._id.$oid || course._id;
            const response = await fetch(
              `http://localhost:5001/comments/${courseId}`
            );
            if (!response.ok) throw new Error("Failed to fetch comments");
            const comments = await response.json();
            return comments.map((comment) => ({
              ...comment,
              courseName: course.title, // Thêm tên khóa học vào mỗi comment
            }));
          })
        );

        // Gộp tất cả comments và chuyển đổi format
        const formattedMessages = allComments
          .flat()
          .map((comment) => ({
            crouse: `Khoá học: ${comment.courseName}` || "Unknown User",
            message: `Học viên: ${comment.name}\n ${comment.text}`,
            timestamp: new Date(comment.createdAt),
            courseId: comment.courseId,
            userId: comment.userId?._id,
          }))
          .sort((a, b) => b.timestamp - a.timestamp);

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    if (filteredCourses?.length > 0) {
      fetchAllCourseComments();
    }
  }, [filteredCourses]);
  const [notifications, setNotifications] = useState([]);
  // const [notifications, setNotifications] = useState([
  //   {
  //     id: 1,
  //     message: "Nam Phan đẹp trai đã tham gia khoá học.",
  //     timestamp: new Date(Date.now() - 60000),
  //   },
  //   {
  //     id: 2,
  //     message: "Bài tập mới đã được giao cho khóa học Lập trình Web.",
  //     timestamp: new Date(Date.now() - 3600000),
  //   },
  //   {
  //     id: 3,
  //     message: "Có 3 học sinh đã hoàn thành bài kiểm tra cuối khóa.",
  //     timestamp: new Date(Date.now() - 86400000),
  //   },
  // ]);
  const isLoadingEnrollments = useSelector(
    (store) => store.TeacherReducer.isLoadingEnrollments
  );
  const isErrorEnrollments = useSelector(
    (store) => store.TeacherReducer.isErrorEnrollments
  );
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
      const studentsOnly = userStore.filter(
        (user) => user.role !== "teacher" && user.role !== "admin"
      );
      setFilteredUsers(studentsOnly);
    }
  }, [userStore]);

  useEffect(() => {
    if (userId) {
      dispatch(getProduct(page, limit, search, order, userId));
    }
  }, [dispatch, userId, page, limit, search, order]);

  useEffect(() => {
    if (store) {
      const coursesForTeacher = store.filter((course) => {
        const courseTeacherId = course.teacherId?.$oid || course.teacherId;
        return courseTeacherId === userId;
      });
      setFilteredCourses(coursesForTeacher);
      setTotalCourses(coursesForTeacher.length);
    } else {
      setFilteredCourses([]);
      setTotalCourses(0);
    }
  }, [store, userId]);

  // **EFFECT ĐỂ TÍNH DOANH THU (ĐÃ SỬA LỖI VÀ THÊM LOGS)**
  useEffect(() => {
    let calculatedRevenue = 0;
    if (filteredCourses && reduxCourseEnrollments) {
      console.log("Tính toán doanh thu: Bắt đầu...");
      filteredCourses.forEach((course) => {
        console.log(
          "Tính toán doanh thu cho khóa học:",
          course.title,
          course._id
        );
        const enrollmentsForCourse = reduxCourseEnrollments.filter(
          (enrollment) => {
            const enrollmentCourseId =
              enrollment.courseId?._oid || enrollment.courseId;
            const currentCourseId = course._id?._oid || course._id;
            const match = enrollmentCourseId === currentCourseId;
            console.log(
              `  Enrollment Course ID: ${enrollmentCourseId}, Current Course ID: ${currentCourseId}, Match: ${match}`
            ); // Log so sánh ID
            return match;
          }
        );
        const coursePrice = course.price || 0;
        const courseRevenue = enrollmentsForCourse.length * coursePrice;
        console.log(
          `  Số enrollments cho khóa học ${course.title}:`,
          enrollmentsForCourse.length
        ); // Log số enrollments
        console.log(`  Giá khóa học ${course.title}:`, coursePrice); // Log giá khóa học
        console.log(`  Doanh thu khóa học ${course.title}:`, courseRevenue); // Log doanh thu từng khóa học
        calculatedRevenue += courseRevenue;
      });
      console.log("Tổng doanh thu tính toán được:", calculatedRevenue); // Log tổng doanh thu
    } else {
      console.log(
        "Không tính toán doanh thu: filteredCourses hoặc reduxCourseEnrollments không có dữ liệu."
      );
    }
    setTotalRevenue(calculatedRevenue);
  }, [filteredCourses, reduxCourseEnrollments]); // Tính toán lại khi khóa học hoặc enrollments thay đổi

  // **EFFECT ĐỂ FETCH TẤT CẢ ENROLLMENTS (chỉ dispatch action)**
  useEffect(() => {
    const fetchAllEnrollments = async () => {
      console.log(
        "fetchAllEnrollments: Bắt đầu dispatch getCourseEnrollments..."
      );
      try {
        await dispatch(getCourseEnrollments());
      } catch (error) {
        console.error(
          "fetchAllEnrollments: Lỗi dispatch getCourseEnrollments:",
          error
        );
        setTotalStudents(0);
      }
    };
    fetchAllEnrollments();
  }, [dispatch]);

  // **EFFECT ĐỂ TÍNH TOÁN totalStudents KHI reduxCourseEnrollments THAY ĐỔI**
  useEffect(() => {
    console.log(
      "useEffect [reduxCourseEnrollments]: reduxCourseEnrollments vừa thay đổi:",
      reduxCourseEnrollments
    );

    if (reduxCourseEnrollments && Array.isArray(reduxCourseEnrollments)) {
      const allEnrollments = reduxCourseEnrollments;

      console.log(
        "useEffect [reduxCourseEnrollments]: Dữ liệu enrollments nhận được:",
        allEnrollments
      );

      const uniqueStudentIds = new Set();
      allEnrollments.forEach((enrollment) => {
        if (enrollment.userId && enrollment.userId._id) {
          uniqueStudentIds.add(enrollment.userId._id);
        }
      });
      setTotalStudents(uniqueStudentIds.size);
      console.log(
        "useEffect [reduxCourseEnrollments]: Số lượng học sinh duy nhất:",
        uniqueStudentIds.size
      );
    } else {
      console.warn(
        "useEffect [reduxCourseEnrollments]: Không có enrollments hoặc dữ liệu không hợp lệ:",
        reduxCourseEnrollments
      );
      setTotalStudents(0);
    }
  }, [reduxCourseEnrollments]);

  const handleShowContent = (contentType, courseId = null) => {
    setShowContent(contentType);
    setSelectedCourseId(courseId);
    if (contentType === "students-course-detail" && courseId) {
      dispatch(getCourseEnrollments(courseId)).catch((error) => {
        console.error("Error in getCourseEnrollments action:", error);
      });
    } else if (contentType === "students") {
      setShowContent("students-courses");
    }
  };

  useEffect(() => {
    if (!token) return;

    const fetchEnrollments = async () => {
      try {
        const response = await fetch(`http://localhost:5001/enrollments`, {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok)
          throw new Error(
            `Error ${response.status}: Failed to fetch enrollments`
          );

        const data = await response.json();

        // Fetch thông tin khóa học
        const courseIds = [...new Set(data.map((en) => en.courseId))];
        const coursesData = await Promise.all(
          courseIds.map(async (id) => {
            const res = await fetch(
              `http://localhost:5001/videos/courseVideos/${id}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  authorization: `Bearer ${token}`,
                },
              }
            );

            if (!res.ok) return null;
            const courseData = await res.json();
            return { id, title: courseData?.course?.title || "Unknown" };
          })
        );

        const coursesMap = coursesData.reduce((acc, course) => {
          if (course) acc[course.id] = course;
          return acc;
        }, {});

        // Tạo notifications với timestamp
        const newNotifications = data.map((enrollment) => ({
          id: enrollment._id,
          message: `Người dùng Vũ Đăng Khoa đã đăng ký khóa học ${
            coursesMap[enrollment.courseId]?.title || "Unknown"
          }`,
          timestamp: new Date(enrollment.createdAt || Date.now()),
        }));

        // Sắp xếp notifications theo thời gian mới nhất
        newNotifications.sort((a, b) => b.timestamp - a.timestamp);

        setNotifications(newNotifications);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchEnrollments();
  }, [token]);

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
            <TiThLargeOutline
              size={24}
              color={colorMode === "light" ? "black" : "white"}
            />
          </Flex>

          {/* Student Icon */}
          <Flex
            justifyContent="center"
            bg="transparent"
            onClick={() => handleShowContent("students")}
            cursor="pointer"
          >
            <IoPeopleSharp
              size={24}
              color={colorMode === "light" ? "black" : "white"}
            />
          </Flex>

          {/* Message Icon */}
          <Flex
            justifyContent="center"
            bg="transparent"
            onClick={() => handleShowContent("messages")}
            cursor="pointer"
          >
            <AiOutlineMessage
              size={24}
              color={colorMode === "light" ? "black" : "white"}
            />
          </Flex>

          {/* Notification Icon */}
          <Flex
            justifyContent="center"
            bg="transparent"
            onClick={() => handleShowContent("notifications")}
            cursor="pointer"
          >
            <AiOutlineBell
              size={24}
              color={colorMode === "light" ? "black" : "white"}
            />
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
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  color={colorMode === "light" ? "black" : "white"}
                >
                  Tổng Học Sinh
                </Text>
                <Text color={colorMode === "light" ? "black" : "white"}>
                  {totalStudents}
                </Text>
              </Box>
              {/* Total Courses Card */}
              <Box
                bg={colorMode === "light" ? "white" : "gray.700"}
                borderRadius="lg"
                boxShadow="md"
                p={4}
              >
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  color={colorMode === "light" ? "black" : "white"}
                >
                  Tổng Số Khóa Học
                </Text>
                <Text color={colorMode === "light" ? "black" : "white"}>
                  {totalCourses}
                </Text>
              </Box>
              {/* Average Rating Card */}
              <Box
                bg={colorMode === "light" ? "white" : "gray.700"}
                borderRadius="lg"
                boxShadow="md"
                p={4}
              >
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  color={colorMode === "light" ? "black" : "white"}
                >
                  Đánh Giá Trung Bình
                </Text>
                <Flex alignItems="center" mt={2}>
                  <BsStarFill color="gold" />
                  <BsStarFill color="gold" />
                  <BsStarFill color="gold" />
                  <BsStarFill color="gold" />
                  <BsStarHalf color="gold" />
                  <Text
                    ml={2}
                    color={colorMode === "light" ? "black" : "white"}
                  >
                    4.7
                  </Text>
                </Flex>
              </Box>
              {/* Revenue Card */}
              <Box
                bg={colorMode === "light" ? "white" : "gray.700"}
                borderRadius="lg"
                boxShadow="md"
                p={4}
              >
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  color={colorMode === "light" ? "black" : "white"}
                >
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
            <Box overflowX="auto" whiteSpace="nowrap" maxW="1400px">
               <Box display="flex" gap={6} flexWrap="nowrap" minWidth="fit-content">
                  {isLoadingEnrollments ? (
                  <Text textAlign="center" color={colorMode === "light" ? "black" : "white"}>
                     Loading courses...
                   </Text>
                  ) : filteredCourses?.length > 0 ? (
                    filteredCourses.map((el, i) => (
                      <Box
                        key={i}
                        borderRadius="lg"
                        boxShadow="md"
                        overflow="hidden"
                        bg={colorMode === "light" ? "white" : "gray.700"}
                        minW="180px"
                        maxW="300px"
                        height="350px"
                        flexShrink={0}
                      >
                        <Image
                          display="block"
                          src={el.img || "https://via.placeholder.com/150"}
                          alt={el.title || "Course Image"}
                          w="100%"
                          h="120px"
                          objectFit="cover"
                        />
                        <Box p={4}>
                          <Text
                            fontSize="xl"
                            fontWeight="bold"
                            mb={2}
                            color={colorMode === "light" ? "black" : "white"}
                          >
                            {el.title || "N/A"}
                          </Text>
                          <Text 
                            fontSize="md" 
                            mb={2} 
                            color={colorMode === "light" ? "black" : "white"}
                            whiteSpace="normal" // Chỉ description được xuống dòng
                          >
                            {el.description || "N/A"}
                          </Text>
                          <Text
                            fontSize="lg"
                            fontWeight="bold"
                            color={colorMode === "light" ? "black" : "white"}
                          >
                            ${el.price || "N/A"}
                          </Text>
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Text color={colorMode === "light" ? "black" : "white"}>
                      No data available for this teacher
                    </Text>
                  )}
              </Box>
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
            <Text
              fontSize="xl"
              fontWeight="bold"
              mb={4}
              color={colorMode === "light" ? "black" : "white"}
            >
              Danh sách khóa học của bạn
            </Text>
            {/* Thay thế Grid bằng Box và ScrollView */}
            <Box maxH="400px" overflowY="auto">
              {" "}
              {/* Sử dụng Box làm container cuộn */}
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
                      onClick={() =>
                        handleShowContent(
                          "students-course-detail",
                          course._id.$oid || course._id
                        )
                      }
                      _hover={{
                        bg: colorMode === "light" ? "gray.200" : "gray.600",
                      }}
                    >
                      <Text
                        fontSize="lg"
                        fontWeight="bold"
                        color={colorMode === "light" ? "black" : "white"}
                      >
                        {course.title}
                      </Text>
                      {/* Thêm thông tin khác về khóa học nếu muốn */}
                    </Box>
                  ))
                ) : (
                  <Text color={colorMode === "light" ? "black" : "white"}>
                    Không có khóa học nào.
                  </Text>
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
            <Text
              fontSize="xl"
              fontWeight="bold"
              mb={4}
              color={colorMode === "light" ? "black" : "white"}
            >
              Danh sách học sinh khóa học:{" "}
              {filteredCourses.find(
                (c) => (c._id.$oid || c._id) === selectedCourseId
              )?.title || "N/A"}
            </Text>
            {isLoadingEnrollments ? (
              <Text
                textAlign="center"
                color={colorMode === "light" ? "black" : "white"}
              >
                Loading students...
              </Text>
            ) : isErrorEnrollments ? (
              <Text textAlign="center" color="red.500">
                Error fetching students.
              </Text>
            ) : (
              <Table
                variant="simple"
                colorScheme={colorMode === "light" ? "teal" : "gray"}
                size="sm"
              >
                <Thead>
                  <Tr>
                    <Th color={colorMode === "light" ? "black" : "white"}>
                      Name
                    </Th>
                    <Th color={colorMode === "light" ? "black" : "white"}>
                      Email
                    </Th>
                    <Th color={colorMode === "light" ? "black" : "white"}>
                      Role
                    </Th>
                    {/* <Th color={colorMode === "light" ? "black" : "white"}>Joined Date</Th> */}
                    <Th color={colorMode === "light" ? "black" : "white"}>
                      Enrollment Date
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {reduxCourseEnrollments?.length > 0 ? (
                    reduxCourseEnrollments
                      .filter(
                        (enrollment) =>
                          (enrollment.courseId?._oid || enrollment.courseId) ===
                          selectedCourseId
                      )
                      .map((enrollment, index) => {
                        const user = enrollment.userId;
                        return (
                          <Tr key={index}>
                            <Td
                              color={colorMode === "light" ? "black" : "white"}
                            >
                              {user?.name || "N/A"}
                            </Td>
                            <Td
                              color={colorMode === "light" ? "black" : "white"}
                            >
                              {user?.email || "N/A"}
                            </Td>
                            <Td
                              color={colorMode === "light" ? "black" : "white"}
                            >
                              {user?.role || "N/A"}
                            </Td>
                            {/* <Td color={colorMode === "light" ? "black" : "white"}>{convertDateFormat(user?.createdAt) || "N/A"}</Td> */}
                            <Td
                              color={colorMode === "light" ? "black" : "white"}
                            >
                              {convertDateFormat(enrollment.enrollmentDate) ||
                                "N/A"}
                            </Td>
                          </Tr>
                        );
                      })
                  ) : (
                    <Tr>
                      <Td
                        colSpan={5}
                        textAlign="center"
                        color={colorMode === "light" ? "black" : "white"}
                      >
                        Không có học sinh nào đăng ký khóa học này.
                      </Td>
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
            <Text
              fontSize="xl"
              fontWeight="bold"
              mb={4}
              color={colorMode === "light" ? "black" : "white"}
            >
              Student List (Tính năng này đã được thay đổi)
            </Text>
            <Text color={colorMode === "light" ? "black" : "white"}>
              Vui lòng chọn biểu tượng Học viên để xem danh sách các khóa học
              của bạn, sau đó chọn một khóa học để xem danh sách học viên của
              khóa học đó.
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
            <Heading
              size="md"
              mb={4}
              color={colorMode === "light" ? "black" : "white"}
            >
              Bình luận từ học viên
            </Heading>
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
                      <Text
                        fontWeight="bold"
                        color={
                          colorMode === "light" ? "green.500" : "green.300"
                        }
                      >
                        {msg.crouse}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {formatDistanceToNow(msg.timestamp, {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </Text>
                    </Flex>
                    <Divider mb={2} />
                    <Text
                      color={colorMode === "light" ? "black" : "white"}
                      whiteSpace="pre-line"
                      sx={{
                        "& span": {
                          color:
                            colorMode === "light" ? "blue.600" : "blue.300",
                          fontWeight: "bold",
                        },
                      }}
                    >
                      {msg.message.split("\n").map((line, index) =>
                        index === 0 ? (
                          // Dòng đầu tiên (Học viên: userId)
                          <span key={index}>{line}</span>
                        ) : (
                          // Dòng thứ hai (nội dung text)
                          <React.Fragment key={index}>
                            <br />
                            {line}
                          </React.Fragment>
                        )
                      )}
                    </Text>
                  </Box>
                ))
              ) : (
                <Text color="gray.500">Chưa có bình luận nào.</Text>
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
            <Heading
              size="md"
              mb={4}
              color={colorMode === "light" ? "black" : "white"}
            >
              Thông báo
            </Heading>
            <VStack spacing={4} align="stretch">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <Box
                    key={notification.id}
                    bg={colorMode === "light" ? "white" : "gray.700"}
                    borderRadius="md"
                    p={3}
                    boxShadow="sm"
                  >
                    <Flex justify="space-between" align="center" mb={2}>
                      <Text
                        fontWeight="bold"
                        color={
                          colorMode === "light" ? "green.500" : "green.300"
                        }
                      >
                        Thông báo mới
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {formatDistanceToNow(notification.timestamp, {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </Text>
                    </Flex>
                    <Divider mb={2} />
                    <Text color={colorMode === "light" ? "black" : "white"}>
                      {notification.message}
                    </Text>
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
