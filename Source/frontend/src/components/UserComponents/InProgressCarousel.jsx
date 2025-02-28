import React, { useEffect, useState } from "react";
import { Box, Flex, Heading, Image, Text, Spinner } from "@chakra-ui/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../Pages/LandingPageComponents/LandingPageComponent.css";
import Card from "../../Pages/LandingPageComponents/Card";
import axios from "axios";

const InProgressCarousel = () => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState({}); // State courses sẽ là một object map courseId -> courseData
  const [enrollments, setEnrollments] = useState([]); // State enrollments để lưu danh sách đăng ký
  const [error, setError] = useState(null);

  const settings = {
    swipe: true,
    dots: true,
    infinite: Object.keys(courses).length > 4, // Sử dụng Object.keys(courses).length
    speed: 500,
    slidesToShow: Object.keys(courses).length < 4 ? Object.keys(courses).length : 4, // Sử dụng Object.keys(courses).length
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: Object.keys(courses).length < 4 ? "0px" : "50px", // Sử dụng Object.keys(courses).length
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: Math.min(4, Object.keys(courses).length), slidesToScroll: 1, centerMode: true } },
      { breakpoint: 1024, settings: { slidesToShow: Math.min(3, Object.keys(courses).length), slidesToScroll: 1, centerMode: true } },
      { breakpoint: 800, settings: { slidesToShow: Math.min(2, Object.keys(courses).length), slidesToScroll: 1, centerMode: true } },
      { breakpoint: 500, settings: { slidesToShow: 1, slidesToScroll: 1, centerMode: true } },
    ],
    appendDots: (dots) => (
      <div
        style={{
          padding: "10px",
          display: "flex",
          justifyContent: "center",
          position: "absolute",
          bottom: "-40px",
          width: "100%",
          zIndex: "10",
        }}
      >
        <ul style={{ margin: "0px", display: "flex", listStyleType: "none" }}> {dots} </ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          border: "2px solid #3182CE",
          margin: "0 5px",
          transition: "transform 0.3s ease",
        }}
      />
    ),
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    initialSlide: 0,
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token; // Lấy token từ user trong localStorage (nếu có)
    const userId = user?.userId;

    if (!userId || !token) {
      console.warn("Không có userId hoặc token. Có thể người dùng chưa đăng nhập.");
      setError("Bạn cần đăng nhập để xem khóa học đang học.");
      setLoading(false);
      return;
    }

    const fetchEnrollmentsAndCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch Enrollments
        const enrollmentsResponse = await fetch(
          `http://localhost:5001/enrollments?userId=${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          }
        );

        if (!enrollmentsResponse.ok) {
          throw new Error(
            `Lỗi khi fetch enrollments: ${enrollmentsResponse.status}`
          );
        }

        const enrollmentsData = await enrollmentsResponse.json();
        setEnrollments(enrollmentsData);

        if (enrollmentsData.length === 0) {
          setCourses({}); // Không có enrollments, set courses rỗng
          setLoading(false);
          return; // Không fetch courses nếu không có enrollments
        }

        // 2. Fetch Course Details for each enrolled course
        const courseIds = [...new Set(enrollmentsData.map((en) => en.courseId))];
        const coursesDataArray = await Promise.all(
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
            if (!res.ok) {
              console.warn(`Không thể fetch course details cho courseId ${id}, status: ${res.status}`);
              return null; // Trả về null nếu fetch course detail lỗi, không làm promise all bị reject
            }
            return res.json();
          })
        );

        // 3. Process Course Data and create coursesMap
        const coursesMap = coursesDataArray.reduce((acc, courseData) => {
          if (courseData && courseData.course) { // Kiểm tra courseData và courseData.course khác null
            acc[courseData.course._id] = courseData.course; // Lưu trữ courseData.course vào coursesMap
          }
          return acc;
        }, {});
        setCourses(coursesMap);

      } catch (error) {
        console.error("Lỗi fetch enrollments và courses:", error);
        setError("Không thể tải dữ liệu khóa học. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollmentsAndCourses();
  }, []);

  // Chuyển đổi courses object thành array để map trong Slider
  const coursesArray = Object.values(courses);

  return (
    <Flex
      className="carousel-container"
      direction="column"
      p="20px"
      m="auto"
      overflow="hidden"
    >
      <Heading textAlign="center" mb="20px" fontSize="2xl" color="teal.600">
        Khóa học đang học
      </Heading>

      {loading ? (
        <Flex justifyContent="center" alignItems="center" height="200px">
          <Spinner size="xl" color="teal.500" />
        </Flex>
      ) : error ? (
        <Text textAlign="center" color="red.500" fontSize="lg" mt="4">
          {error}
        </Text>
      ) : coursesArray.length > 0 ? ( // Sử dụng coursesArray.length để kiểm tra
        <Slider {...settings}>
          {coursesArray.map((el) => ( // Map qua coursesArray
            <Box
              key={el._id}
              transform="scale(1)"
              transition="transform 0.3s ease-in-out"
              _hover={{ transform: "scale(1.05)" }}
            >
              <Card {...el} />
            </Box>
          ))}
        </Slider>
      ) : (
        <Box
          display="flex"
          flexDir="column"
          alignItems="center"
          bg="#F7F3EA"
          p="4"
          borderRadius="md"
          textAlign="center"
          mt="4"
        >
          <Box w={{ base: "80%", md: "50%", lg: "30%" }} mb="4">
            <Image
              display="block"
              src="https://cdn.dribbble.com/users/1693462/screenshots/3504905/media/6d5a0df598037bf7a872f1f8aef118b8.gif"
              alt="Empty"
              mx="auto"
            />
          </Box>
          <Text fontWeight="bold" color="gray.600" fontSize="lg">
            Bạn chưa đăng ký khóa học nào.
          </Text>
        </Box>
      )}
    </Flex>
  );
};

export default InProgressCarousel;