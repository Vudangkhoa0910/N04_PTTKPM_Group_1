import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Textarea,
  Text
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import TeacherNavTop from "./TeacherNavTop";
import { useDispatch } from "react-redux";
import { addProduct } from "../../Redux/TeacherReducer/action";
import { useNavigate } from "react-router-dom";

const AddTeacherCourse = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem("user"));
  const teacherNameFromStorage = userData?.name || ""; // Default to empty string if no name

  // Initial object structure - teacherName is pre-filled
  let obj = {
    title: "",
    description: "",
    category: "",
    price: "",
    img: "",
    teacherName: teacherNameFromStorage, // Pre-fill teacherName from localStorage
  };

  const [detail, setDetail] = useState(obj);

  useEffect(() => {
    // Update teacherName in state if it changes in localStorage (unlikely in this component's lifecycle, but good practice)
    if (detail.teacherName !== teacherNameFromStorage) {
      setDetail(prev => ({ ...prev, teacherName: teacherNameFromStorage }));
    }
  }, [teacherNameFromStorage]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetail((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = () => {
    const userData = JSON.parse(localStorage.getItem("user"));

    if (!userData || !userData.userId) {
      console.error("Error: userData is missing or invalid in localStorage.", userData);
      alert("Unable to retrieve user ID. Please log in again.");
      return;
    }

    const userId = userData.userId;

    // No need to check if teacherName is entered manually anymore, as it's auto-filled

    // Create the course data object with userId
    const courseData = { ...detail, userId };

    // Dispatch action to add product (course)
    dispatch(addProduct(courseData));

    alert("Course Added Successfully");
    navigate("/Teacher/courses");
  };

  return (
    <Grid className="Nav" h={"99vh"} w="100%" placeItems="center">
      <Box mt="90px" width="90vw" maxWidth="container.lg">
        <Box
          border={"2px solid gray"}
          borderRadius={10}
          p={10}
          h="auto"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="stretch"
        >
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              placeholder="Enter Course Title"
              name="title"
              value={detail.title}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              placeholder="Enter Course description"
              name="description"
              value={detail.description}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Category</FormLabel>
            <Input
              type="text"
              placeholder="Enter Course Category"
              name="category"
              value={detail.category}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Price</FormLabel>
            <Input
              type="number"
              placeholder="Enter Course price"
              name="price"
              value={detail.price}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Thumbnail</FormLabel>
            <Input
              type="text"
              placeholder="Enter Course thumbnail Link"
              name="img"
              value={detail.img}
              onChange={handleChange}
            />
          </FormControl>
          {/* Removed Teacher Name Input - Now auto-filled */}
          <FormControl mt={4}>
            <FormLabel>Teacher Name</FormLabel>
            <Input
              type="text"
              name="teacherName"
              value={detail.teacherName}
              isReadOnly // Make it read-only to prevent manual editing
            />
          </FormControl>

          <Button
            mt={4}
            colorScheme="blue"
            size="md"
            isFullWidth
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Grid>
  );
};

export default AddTeacherCourse;