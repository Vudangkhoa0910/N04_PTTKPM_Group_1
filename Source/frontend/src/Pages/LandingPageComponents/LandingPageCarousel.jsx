import React, { useEffect, useState } from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./LandingPageComponent.css";
import Card from "./Card";
import LoadingComponent from "../LoadingComponents/LoadingComponent";

const LandingPageCarousel = ({ keyword }) => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const arr = [1, 2, 3, 4];

  const settings = {
    swipe: true,
    dots: true,
    infinite: courses.length > 4, // Vô hạn chỉ khi có nhiều hơn 4 phần tử
    speed: 500,
    slidesToShow: courses.length < 4 ? courses.length : 4, // Hiển thị đúng số lượng phần tử
    slidesToScroll: 1,
    centerMode: true, // Bật chế độ căn giữa
    centerPadding: courses.length < 4 ? "0px" : "50px", // Điều chỉnh padding khi ít phần tử
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: Math.min(4, courses.length), slidesToScroll: 1, centerMode: true } },
      { breakpoint: 1024, settings: { slidesToShow: Math.min(3, courses.length), slidesToScroll: 1, centerMode: true } },
      { breakpoint: 800, settings: { slidesToShow: Math.min(2, courses.length), slidesToScroll: 1, centerMode: true } },
      { breakpoint: 500, settings: { slidesToShow: 1, slidesToScroll: 1, centerMode: true } },
    ],
  };
  
  

  useEffect(() => {
    const url = "http://localhost:5000/courses/all";
    setLoading(true);

    fetch(url)
      .then((response) => {
        if (response.ok) return response.json();
        else throw new Error("Error: " + response.status);
      })
      .then((data) => {
        if (keyword) {
          // Lọc các khóa học có title chứa từ khóa
          setCourses(
            data.course.filter((course) =>
              course.category.toLowerCase().includes(keyword.toLowerCase())
            )
          );
        } else {
          setCourses(data.course); // Hiển thị tất cả nếu không có từ khóa
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, [keyword]);

  return (
    <Flex direction={"column"} width="80%" p={"20px"} m={"auto"}>
      <Slider {...settings}>
        {!loading
          ? courses?.map((el) => <Card {...el} key={el._id} />)
          : arr.map((el, i) => <LoadingComponent key={i} />)}
      </Slider>
    </Flex>
  );
};

export default LandingPageCarousel;