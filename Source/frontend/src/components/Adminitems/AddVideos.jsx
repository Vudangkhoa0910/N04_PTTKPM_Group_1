import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { addVideo } from "../../Redux/AdminReducer/action";

const AddVideo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id, title } = location.state;

  const obj = {
    title: title,
    description: "",
    link: "",
    views: "",
    img: "",
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
    navigate("/admin/videos");
  };

  return (
    <Grid
      h="100vh"
      w="100%"
      templateColumns="1fr"
      justifyItems="center"
      alignItems="center"
      p={6}
      bg="gray.50"
      mt={9}
    >
      <Box
        w={{ base: "100%", sm: "90%", md: "70%", lg: "50%" }}
        p={8}
        bg="white"
        borderRadius="md"
        boxShadow="lg"
        borderWidth={1}
        borderColor="gray.200"
      >
        <Text fontSize="2xl" fontWeight="bold" color="teal.600" mb={6} textAlign="center">
          Add New Video
        </Text>

        <VStack spacing={6} align="stretch">
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              placeholder="Enter Video Title"
              name="title"
              value={detail.title}
              onChange={handleChange}
              borderColor="gray.300"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Course ID</FormLabel>
            <Input
              type="text"
              placeholder="Enter the Course ID to add video"
              name="courseId"
              value={detail.courseId}
              onChange={handleChange}
              borderColor="gray.300"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              placeholder="Enter Description"
              name="description"
              value={detail.description}
              onChange={handleChange}
              borderColor="gray.300"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Link</FormLabel>
            <Input
              type="text"
              placeholder="Enter video Link"
              name="link"
              value={detail.link}
              onChange={handleChange}
              borderColor="gray.300"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Views</FormLabel>
            <Input
              type="number"
              placeholder="Enter Total Views"
              name="views"
              value={detail.views}
              onChange={handleChange}
              borderColor="gray.300"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Thumbnail</FormLabel>
            <Input
              type="text"
              placeholder="Enter Video Thumbnail URL"
              name="img"
              value={detail.img}
              onChange={handleChange}
              borderColor="gray.300"
            />
          </FormControl>

          <Button
            colorScheme="teal"
            size="lg"
            isFullWidth
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </VStack>
      </Box>
    </Grid>
  );
};

export default AddVideo;