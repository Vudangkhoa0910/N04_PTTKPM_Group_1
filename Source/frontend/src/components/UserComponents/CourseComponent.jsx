import React from "react";
import { Box, Heading, Stack, Wrap } from "@chakra-ui/react";
import LandingPageCarousel from "../../Pages/LandingPageComponents/LandingPageCarousel";
import InProgressCarousel from "./InProgressCarousel";
import FavoriteCourseCarousel from "../../Pages/LandingPageComponents/FavoriteCourseCarousel";

const CourseComponent = () => {
  return (
    <Box p={4}>
      <Stack spacing={4} mb={4}>
        <Heading as="h2" size="lg">
          All Courses
        </Heading>
        <Wrap spacing={4}>
          <LandingPageCarousel keyword="" /> {/* Hiển thị tất cả khóa học */}
        </Wrap>
      </Stack>

      <Stack spacing={4} mb={4}>
        <Heading as="h2" size="lg">
          In Progress Courses
        </Heading>
        <Wrap spacing={4}>
          <InProgressCarousel />
        </Wrap>
      </Stack>

      <Stack spacing={4} mb={4}>
        <Heading as="h2" size="lg">
          Top courses in Business
        </Heading>
        <Wrap spacing={4}>
          <LandingPageCarousel keyword="Business" />{" "}
          {/* Lọc khóa học có title chứa "Business" */}
        </Wrap>
      </Stack>

      <Stack spacing={4} mb={4}>
        <Heading as="h2" size="lg">
          Top courses in IT & Software
        </Heading>
        <Wrap spacing={4}>
          <LandingPageCarousel keyword="IT" />{" "}
          {/* Lọc khóa học có title chứa "IT" */}
        </Wrap>
      </Stack>

      <Stack spacing={4} mb={4}>
        <Heading as="h2" size="lg">
          Favorite Courses
        </Heading>
        <Wrap spacing={4}>
          <FavoriteCourseCarousel />
        </Wrap>
      </Stack>
    </Box>
  );
};

export default CourseComponent;
