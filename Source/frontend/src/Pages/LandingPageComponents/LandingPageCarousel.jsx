import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Spinner,
  Tag,
} from "@chakra-ui/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./LandingPageComponent.css";
import Card from "./Card";
import LoadingComponent from "../LoadingComponents/LoadingComponent";
import { useSelector } from "react-redux"; // Import useSelector

const LandingPageCarousel = ({ keyword }) => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [registeredCourseIds, setRegisteredCourseIds] = useState([]);

  // Lấy thông tin người dùng từ Redux store
  const userStore = useSelector((store) => store.UserReducer);
  const userId = userStore?.userId;
  const token = userStore?.token;

  useEffect(() => {
    const fetchCourses = async () => {
      const url = "http://localhost:5001/courses/all";
      setLoading(true);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Error: " + response.status);
        }
        const data = await response.json();

        if (keyword) {
          setCourses(
            data.course.filter((course) =>
              course.category.toLowerCase().includes(keyword.toLowerCase())
            )
          );
        } else {
          setCourses(data.course);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [keyword]);

  useEffect(() => {
    if (!userId || !token) {
      console.log("User not logged in or no token");
      return;
    }

    const fetchEnrollments = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/enrollments?userId=${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          console.error(`Error ${response.status}: Failed to fetch enrollments`);
          return;
        }

        const data = await response.json();
        console.log("ENROLLMENTS DATA:", data);

        // Log userId from localStorage
        console.log("userId from localStorage:", userId);

        // Filter enrollments to only include those belonging to the current user
        const filteredEnrollments = data.filter((enrollment) => {
          // Log userId from each enrollment
          console.log("enrollment.userId?._id:", enrollment.userId?._id);
          return enrollment.userId?._id === userId; // So sánh với enrollment.userId._id
        });

        console.log("FILTERED ENROLLMENTS:", filteredEnrollments);

        const enrolledCourseIds = filteredEnrollments
          .map((enrollment) => enrollment.courseId)
          .filter((id) => id != null);

        setRegisteredCourseIds(enrolledCourseIds);
        console.log("REGISTERED COURSE IDs:", enrolledCourseIds);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchEnrollments();
  }, [userId, token]);

  const isCourseRegistered = (courseId) => {
    return registeredCourseIds.includes(courseId);
  };

  const settings = {
    swipe: true,
    dots: true,
    infinite: courses.length > 4,
    speed: 500,
    slidesToShow: courses.length < 4 ? courses.length : 4,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: courses.length < 4 ? "0px" : "50px",
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: Math.min(4, courses.length),
          slidesToScroll: 1,
          centerMode: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(3, courses.length),
          slidesToScroll: 1,
          centerMode: true,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: Math.min(2, courses.length),
          slidesToScroll: 1,
          centerMode: true,
        },
      },
      {
        breakpoint: 500,
        settings: { slidesToShow: 1, slidesToScroll: 1, centerMode: true },
      },
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
        <ul style={{ margin: "0px", display: "flex", listStyleType: "none" }}>
          {" "}
          {dots}{" "}
        </ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        style={{
          width: "10px", // Giảm kích thước nút dots
          height: "10px",
          borderRadius: "50%",
          border: "2px solid #3182CE", // Viền của nút dots
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

  return (
    <Flex className="carousel-container" direction="column" p="20px" m="auto">
      <Heading textAlign="center" mb="20px" fontSize="2xl" color="teal.600">
        {keyword ? `Kết quả cho "${keyword}"` : "Các khóa học nổi bật"}
      </Heading>

      {loading ? (
        <Flex justifyContent="center" alignItems="center" height="200px">
          <Spinner size="xl" color="teal.500" />
        </Flex>
      ) : courses.length > 0 ? (
        <Slider {...settings}>
          {courses.map((el) => {
            const isRegistered = isCourseRegistered(el._id);
            const hasDiscount = el.discount > 0;
            
            return (
              <Box
                key={el._id}
                transform="scale(1)"
                transition="transform 0.3s ease-in-out"
                _hover={{ transform: "scale(1.05)" }}
                position="relative"
              >
                <Card {...el} />
                
                {/* Tags container to organize multiple tags */}
                <Flex 
                  position="absolute"
                  top="8px"
                  right="8px"
                  direction="column"
                  gap="4px"
                >
                  {/* Registration tag */}
                  {isRegistered && (
                    <Tag
                      size="sm"
                      colorScheme="green"
                    >
                      Đã đăng ký
                    </Tag>
                  )}
                  
                  {/* Discount tag */}
                  {hasDiscount && (
                    <Tag
                      size="sm"
                      colorScheme="red"
                      variant="solid"
                    >
                      -{el.discount}% 
                    </Tag>
                  )}
                </Flex>
              </Box>
            );
          })}
        </Slider>
      ) : (
        <Text textAlign="center" color="gray.500" fontSize="lg">
          Không tìm thấy khóa học nào phù hợp với từ khóa "{keyword}".
        </Text>
      )}
    </Flex>
  );
};

export default LandingPageCarousel;