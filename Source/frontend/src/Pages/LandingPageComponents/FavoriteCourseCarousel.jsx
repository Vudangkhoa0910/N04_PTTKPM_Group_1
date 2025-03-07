import React, { useState, useEffect } from "react";
import { Box, Flex, Spinner, Text, Tag } from "@chakra-ui/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector } from "react-redux";
import Card from "./Card";

const FavoriteCourseCarousel = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [courses, setCourses] = useState([]);
  
  // Get user data from Redux store
  const userStore = useSelector((store) => store.UserReducer);
  const userId = userStore?.userId;
  const token = userStore?.token;

  // Slider settings
  const settings = {
    dots: true,
    infinite: courses.length > 4,
    speed: 500,
    slidesToShow: courses.length < 4 ? courses.length || 1 : 4,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: courses.length < 4 ? "0px" : "50px",
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: Math.min(3, courses.length || 1), centerMode: true } },
      { breakpoint: 1024, settings: { slidesToShow: Math.min(2, courses.length || 1), centerMode: true } },
      { breakpoint: 600, settings: { slidesToShow: 1, centerMode: false } },
    ],
    swipe: true,
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
        <ul style={{ margin: "0px", display: "flex", listStyleType: "none" }}>{dots}</ul>
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
  };

  useEffect(() => {
    if (!userId || !token) {
      setLoading(false);
      return;
    }

    const fetchFavoriteCourses = async () => {
      try {
        // 1. Fetch user favorite courses
        const favoritesResponse = await fetch(
          `http://localhost:5001/favoritecourses/user/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          }
        );

        if (!favoritesResponse.ok) {
          throw new Error(`Error ${favoritesResponse.status}: Failed to fetch favorites`);
        }

        const favoritesData = await favoritesResponse.json();
        setFavorites(favoritesData);

        if (favoritesData.length === 0) {
          setCourses([]);
          setLoading(false);
          return;
        }

        // 2. Extract course details from the populated courseId field
        const coursesData = favoritesData
          .map(fav => fav.courseId)
          .filter(course => course !== null);
          
        setCourses(coursesData);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteCourses();
  }, [userId, token]);

  return (
    <Flex
      className="carousel-container"
      direction="column"
      p="20px"
      m="auto"
      overflow="hidden"
    >
      {loading ? (
        <Flex justifyContent="center" alignItems="center" height="200px">
          <Spinner size="xl" color="teal.500" />
        </Flex>
      ) : error ? (
        <Text textAlign="center" color="red.500" fontSize="lg" mt="4">
          {error}
        </Text>
      ) : courses.length > 0 ? (
        <Slider {...settings}>
          {courses.map((course) => (
            <Box 
              key={course._id} 
              p={2}
              transform="scale(1)"
              transition="transform 0.3s ease-in-out"
              _hover={{ transform: "scale(1.05)" }}
              position="relative"
            >
              <Card 
                _id={course._id}
                title={course.title}
                category={course.category} 
                description={course.description || "No description available"}
                img={course.img}
                course={course.teacher || "Unknown Instructor"}
              />
              
              {course.discount > 0 && (
                <Box position="absolute" top="8px" right="8px">
                  <Tag size="sm" colorScheme="red" variant="solid">
                    -{course.discount}% 
                  </Tag>
                </Box>
              )}
            </Box>
          ))}
        </Slider>
      ) : (
        <Text textAlign="center" color="gray.500" fontSize="lg" mt="4">
          No favorite courses found. Find courses you like and add them to your favorites!
        </Text>
      )}
    </Flex>
  );
};

export default FavoriteCourseCarousel;