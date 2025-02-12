import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { addVideo } from "../../Redux/TeacherReducer/action";

const AddTeacherVideos = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state;
  let obj = {
    title: "",
    description: "",
    link: "",
    views: "",
    img: "",
    detail: "", // Thêm trường Detail
    courseId: id,
  };

  const [detail, setDetail] = useState(obj);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetail((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = () => {
    dispatch(addVideo(detail, detail.courseId));
    alert("Video Added Successfully");
    navigate("/Teacher/add");
  };

  return (
    <Grid className="Nav" h="100vh" w="100%" placeItems="center" px={4}>
      <Box mt="90px" width="90vw" maxWidth="container.lg">
        <Box
          border="2px solid #ccc"
          borderRadius={10}
          p={5}
          bg="white"
          boxShadow="md"
          display="flex"
          flexDirection="column"
        >
          {/* <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
            Add Video
          </Text> */}
          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Title</FormLabel>
            <Input
              type="text"
              placeholder="Enter Video Title"
              name="title"
              value={detail.title}
              onChange={handleChange}
              borderColor="#ccc"
              _hover={{ borderColor: "blue.500" }}
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px blue.500",
              }}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Description</FormLabel>
            <Textarea
              type="text"
              placeholder="Enter Description"
              name="description"
              value={detail.description}
              onChange={handleChange}
              borderColor="#ccc"
              _hover={{ borderColor: "blue.500" }}
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px blue.500",
              }}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Detail</FormLabel>
            <Textarea
              type="text"
              placeholder="Enter detailed information"
              name="detail"
              value={detail.detail}
              onChange={handleChange}
              borderColor="#ccc"
              _hover={{ borderColor: "blue.500" }}
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px blue.500",
              }}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Link</FormLabel>
            <Input
              type="text"
              placeholder="Enter video Link"
              name="link"
              value={detail.link}
              onChange={handleChange}
              borderColor="#ccc"
              _hover={{ borderColor: "blue.500" }}
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px blue.500",
              }}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Views</FormLabel>
            <Input
              type="number"
              placeholder="Enter Total Views"
              name="views"
              value={detail.views}
              onChange={handleChange}
              borderColor="#ccc"
              _hover={{ borderColor: "blue.500" }}
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px blue.500",
              }}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Thumbnail</FormLabel>
            <Input
              type="text"
              placeholder="Enter Video Thumbnail"
              name="img"
              value={detail.img}
              onChange={handleChange}
              borderColor="#ccc"
              _hover={{ borderColor: "blue.500" }}
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px blue.500",
              }}
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

export default AddTeacherVideos;
