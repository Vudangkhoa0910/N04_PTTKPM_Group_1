import {
  Box,
  Flex,
  Grid,
  Text,
  Heading,
  Card,
  CardHeader,
  CardBody,
  useColorModeValue,
  Stack,
  Icon,
  SimpleGrid,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import React, { useEffect, useState, useRef } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  registerables,
} from "chart.js";
import { useSelector } from "react-redux";
import Navbar from "../UserComponents/UserNavbar";
import Footer from "../../Pages/Footer";
import { FaDollarSign, FaChartPie, FaVideo, FaUsers, FaExpand } from "react-icons/fa"; // Thêm các icon

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  ...registerables
);

function Statistics() {
  const userStore = useSelector((store) => store.UserReducer);
  const userId = userStore?.userId;
  const token = userStore?.token;

  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]); // Danh sách tất cả các khóa học
  const [videos, setVideos] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChartType, setSelectedChartType] = useState(null); // Loại biểu đồ được chọn (bar, pie, line)
  const { isOpen, onOpen, onClose } = useDisclosure();
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Lấy danh sách enrollments
        const enrollmentsResponse = await fetch(
          "http://localhost:5001/enrollments",
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          }
        );
        if (!enrollmentsResponse.ok)
          throw new Error(
            `Failed to fetch enrollments: ${enrollmentsResponse.status}`
          );
        const enrollmentsData = await enrollmentsResponse.json();
        setEnrollments(enrollmentsData);

        // Lấy danh sách courses
        const coursesResponse = await fetch("http://localhost:5001/courses", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        });
        if (!coursesResponse.ok)
          throw new Error(`Failed to fetch courses: ${coursesResponse.status}`);
        const coursesData = await coursesResponse.json();
        setCourses(coursesData.course); // Lưu ý: API trả về {course: [...]}

        // Lấy danh sách videos
        const videosResponse = await fetch("http://localhost:5001/videos", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        });
        if (!videosResponse.ok)
          throw new Error(`Failed to fetch videos: ${videosResponse.status}`);
        const videosData = await videosResponse.json();
        setVideos(videosData);

        const usersResponse = await fetch("http://localhost:5001/users", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        });
        if (!usersResponse.ok)
          throw new Error(`Failed to fetch Users: ${usersResponse.status}`);
        const usersData = await usersResponse.json();
        setUsers(Array.isArray(usersData?.users) ? usersData.users : []);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Thống kê số lượng người dùng theo role
  const numTeachers = Array.isArray(users)
    ? users.filter((user) => user.role && user.role.toLowerCase() === "teacher").length
    : 0;
  const numRegularUsers = Array.isArray(users)
    ? users.filter((user) => user.role && user.role.toLowerCase() === "user").length
    : 0;

  // Dữ liệu cho biểu đồ
  const totalRevenue = enrollments.reduce((sum, e) => sum + e.price, 0);
  const numCourses = courses.length;
  const numVideos = videos.length;
  const numUsers = users.length;

  const paymentMethodCounts = enrollments.reduce((acc, e) => {
    acc[e.paymentMethod] = (acc[e.paymentMethod] || 0) + 1;
    return acc;
  }, {});

  const courseEnrollmentCounts = enrollments.reduce((acc, e) => {
    acc[e.courseId] = (acc[e.courseId] || 0) + 1;
    return acc;
  }, {});

  const mostEnrolledCourseId = Object.keys(courseEnrollmentCounts).reduce(
    (a, b) => (courseEnrollmentCounts[a] > courseEnrollmentCounts[b] ? a : b),
    null
  );

  const mostEnrolledCourse =
    courses.find((course) => course._id === mostEnrolledCourseId) || null;

  // Cấu hình biểu đồ
  const barChartData = {
    labels: Object.keys(paymentMethodCounts),
    datasets: [
      {
        label: "Payment Methods",
        data: Object.values(paymentMethodCounts),
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: courses.map((course) => course.title),
    datasets: [
      {
        label: "Course Enrollments",
        data: courses.map(
          (course) => courseEnrollmentCounts[course._id] || 0
        ),
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: videos.map((video) => video.title),
    datasets: [
      {
        label: "Video Views",
        data: videos.map((video) => video.views),
        fill: false,
        backgroundColor: "rgba(75,192,192,0.8)",
        borderColor: "rgba(75,192,192,1)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Quan trọng: Cho phép biểu đồ tự điều chỉnh kích thước
    plugins: {
      legend: {
        position: "bottom", // Đặt legend xuống dưới
      },
      title: {
        display: true,
        text: "Analytics Overview",
        font: {
          size: 18,
        },
      },
    },
  };

  const cardBgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleChartClick = (chartType) => {
    setSelectedChartType(chartType); // Lưu lại loại biểu đồ được chọn
    onOpen();
  };


  return (
    <div style={{ marginTop: "100px" }}>
      <Navbar />
      <Box
        maxWidth="90%"
        margin="auto"
        padding={8} // Tăng padding
        bg={useColorModeValue("gray.100", "gray.800")} // Màu nền sáng/tối
        borderRadius="xl"
        boxShadow="xl" // Tăng độ nổi
        color={textColor}
      >
        <Heading
          as="h2"
          size="2xl" // Cỡ chữ lớn hơn
          textAlign="center"
          mb={8} // Tăng khoảng cách
          fontWeight="semibold" // In đậm vừa phải
          color={useColorModeValue("teal.500", "teal.300")} // Màu tiêu đề nổi bật
        >
          Statistics Dashboard
        </Heading>

        {loading && <Text textAlign="center">Loading statistics...</Text>}
        {error && <Text color="red">Error: {error}</Text>}

        {!loading && !error && (
          <>
            <SimpleGrid columns={{ sm: 1, md: 2, lg: 4 }} spacing={8} mb={10}>
              {/* Tổng quan - Card nhỏ */}
              <Card
                bg={cardBgColor}
                boxShadow="md"
                border="1px solid"
                borderColor={borderColor}
              >
                <CardBody>
                  <Stack align="center" spacing={2}>
                    <Icon as={FaDollarSign} color="green.500" fontSize="2xl" />
                    <Text fontWeight="bold">Tổng doanh thu</Text>
                    <Heading size="md">${totalRevenue}</Heading>
                  </Stack>
                </CardBody>
              </Card>

              <Card
                bg={cardBgColor}
                boxShadow="md"
                border="1px solid"
                borderColor={borderColor}
              >
                <CardBody>
                  <Stack align="center" spacing={2}>
                    <Icon as={FaChartPie} color="blue.500" fontSize="2xl" />
                    <Text fontWeight="bold">Số lượng khóa học</Text>
                    <Heading size="md">{numCourses}</Heading>
                  </Stack>
                </CardBody>
              </Card>

              <Card
                bg={cardBgColor}
                boxShadow="md"
                border="1px solid"
                borderColor={borderColor}
              >
                <CardBody>
                  <Stack align="center" spacing={2}>
                    <Icon as={FaVideo} color="purple.500" fontSize="2xl" />
                    <Text fontWeight="bold">Số lượng video</Text>
                    <Heading size="md">{numVideos}</Heading>
                  </Stack>
                </CardBody>
              </Card>

              <Card
                bg={cardBgColor}
                boxShadow="md"
                border="1px solid"
                borderColor={borderColor}
              >
                <CardBody>
                  <Stack align="center" spacing={2}>
                    <Icon as={FaUsers} color="orange.500" fontSize="2xl" />
                    <Text fontWeight="bold">Số lượng người dùng</Text>
                    <Heading size="md">{numUsers - 1}</Heading>
                    <Text fontSize="sm">Giáo viên: {numTeachers}</Text>
                    <Text fontSize="sm">Học viên: {numRegularUsers}</Text>
                  </Stack>
                </CardBody>
              </Card>
            </SimpleGrid>

            <Grid
              templateColumns={{ sm: "1fr", md: "1fr", lg: "1fr 1fr" }}
              gap={8}
            >
              {/* Biểu đồ phương thức thanh toán */}
              <Card
                bg={cardBgColor}
                boxShadow="md"
                border="1px solid"
                borderColor={borderColor}
              >
                <CardHeader>
                  <Flex justify="space-between" align="center">
                    <Heading size="md" fontWeight="semibold">
                      Thống kê phương thức thanh toán
                    </Heading>
                    <Flex>
                      <IconButton
                        aria-label="Phóng to"
                        icon={<FaExpand />}
                        size="sm"
                        onClick={() => handleChartClick('bar')}
                      />

                    </Flex>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <Box height="300px">
                    {/* Thiết lập chiều cao cố định */}
                    <Bar ref={chartRef} data={barChartData} options={chartOptions} height={300} />
                  </Box>
                </CardBody>
              </Card>

              {/* Biểu đồ số lượng đăng ký khóa học */}
              <Card
                bg={cardBgColor}
                boxShadow="md"
                border="1px solid"
                borderColor={borderColor}
              >
                <CardHeader>
                  <Flex justify="space-between" align="center">
                    <Heading size="md" fontWeight="semibold">
                      Số lượng đăng ký khóa học
                    </Heading>
                    <Flex>
                      <IconButton
                        aria-label="Phóng to"
                        icon={<FaExpand />}
                        size="sm"
                        onClick={() => handleChartClick('pie')}
                      />

                    </Flex>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <Box height="300px">
                    {/* Thiết lập chiều cao cố định */}
                    <Pie ref={chartRef} data={pieChartData} options={chartOptions} height={300} />
                  </Box>
                </CardBody>
              </Card>

              {/* Biểu đồ lượt xem video */}
              <Card
                bg={cardBgColor}
                boxShadow="md"
                border="1px solid"
                borderColor={borderColor}
              >
                <CardHeader>
                  <Flex justify="space-between" align="center">
                    <Heading size="md" fontWeight="semibold">
                      Thống kê lượt xem video
                    </Heading>
                    <Flex>
                      <IconButton
                        aria-label="Phóng to"
                        icon={<FaExpand />}
                        size="sm"
                        onClick={() => handleChartClick('line')}
                      />

                    </Flex>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <Box height="300px">
                    {/* Thiết lập chiều cao cố định */}
                    <Line ref={chartRef} data={lineChartData} options={chartOptions} height={300} />
                  </Box>
                </CardBody>
              </Card>

              {mostEnrolledCourse && (
                <Card
                  bg={cardBgColor}
                  boxShadow="md"
                  border="1px solid"
                  borderColor={borderColor}
                >
                  <CardHeader>
                    <Heading size="md" fontWeight="semibold">
                      Khóa học được đăng ký nhiều nhất
                    </Heading>
                  </CardHeader>
                  <CardBody>
                    <Stack spacing={3}>
                      <Text fontWeight="bold" fontSize="lg">
                        {mostEnrolledCourse.title}
                      </Text>
                      <Flex align="center" justify="space-between">
                        <Text>Số lượng đăng ký:</Text>
                        <Text fontWeight="bold">
                          {courseEnrollmentCounts[mostEnrolledCourse._id]}
                        </Text>
                      </Flex>
                      <Flex align="center" justify="space-between">
                        <Text>Giá:</Text>
                        <Text fontWeight="bold">
                          ${mostEnrolledCourse.price}
                        </Text>
                      </Flex>
                      <Flex align="center" justify="space-between">
                        <Text>Giáo viên:</Text>
                        <Text fontWeight="bold">{mostEnrolledCourse.teacher}</Text>
                      </Flex>
                      <Text>
                        Mô tả:{" "}
                        {mostEnrolledCourse.description?.substring(0, 100)}...
                      </Text>
                    </Stack>
                  </CardBody>
                </Card>
              )}
            </Grid>
          </>
        )}
      </Box>
      <Footer />

      {/* Modal để phóng to biểu đồ */}
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Biểu đồ chi tiết</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              width="100%"
              height="80vh" /* Chiếm 80% chiều cao màn hình */
            >
              {selectedChartType && (
                <>
                  {selectedChartType === "bar" && (
                    <Bar data={barChartData} options={{ ...chartOptions, responsive: true, maintainAspectRatio: false }} />
                  )}
                  {selectedChartType === "pie" && (
                    <Pie data={pieChartData} options={{ ...chartOptions, responsive: true, maintainAspectRatio: false }} />
                  )}
                  {selectedChartType === "line" && (
                    <Line data={lineChartData} options={{ ...chartOptions, responsive: true, maintainAspectRatio: false }} />
                  )}
                </>
              )}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Statistics;