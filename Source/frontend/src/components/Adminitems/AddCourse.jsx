import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Textarea,
  Flex,
  Select,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { IoSearchCircleOutline } from "react-icons/io5";
import { AddIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addProduct } from "../../Redux/AdminReducer/action";

const AddCourse = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let obj = {
    title: "",
    description: "",
    category: "",
    price: "",
    img: "",
  };

  const [detail, setDetail] = useState(obj);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetail((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = () => {
    dispatch(addProduct(detail));

    alert("Course Added Successfully");
    navigate("/admin/courses");
  };

  return (
    <Grid className="Nav" h={"99vh"} w="100%" gap={10}>
      <Box mt="80px">
        {/* Search Bar and Action Buttons */}
        <Flex
          h="10vh"
          justifyContent="space-between"
          align="center"
          bg="white"
          p={3}
          borderRadius="lg"
          shadow="md"
          zIndex={1}
          position="sticky"
          top={0}
          mb={5}
          mt={2}
          mr={10}
          ml={10}
        >
          {/* Input tìm kiếm */}
          <Flex align="center" w="50%">
            <IoSearchCircleOutline
              style={{ fontSize: "4vh", color: "gray", marginRight: "8px" }}
            />
            <Input
              placeholder="Search Anything"
              border="1px solid"
              borderColor="gray.300"
              h="6vh"
              w="100%"
              focusBorderColor="teal.500"
            />
          </Flex>

          {/* Select và nút thêm */}
          <Flex align="center" gap={3}>
            <Link to="/admin/addCourse">
              <Button colorScheme="teal" leftIcon={<AddIcon />}>
                Add New Course
              </Button>
            </Link>
          </Flex>
        </Flex>

        {/* Form for Course Details */}
        <Box
          border={"2px solid #e2e8f0"}
          borderRadius="10px"
          p={8}
          bg="white"
          shadow="lg"
          maxWidth="600px"
          margin="auto"
        >
          <FormControl mb={6}>
            <FormLabel fontSize="lg" fontWeight="bold" color="teal.600">
              Title
            </FormLabel>
            <Input
              type="text"
              placeholder="Enter Course Title"
              name="title"
              value={detail.title}
              onChange={handleChange}
              borderColor="teal.300"
              focusBorderColor="teal.500"
              _hover={{ borderColor: "teal.400" }}
              h="50px"
              p="10px"
            />
          </FormControl>
          <FormControl mb={6}>
            <FormLabel fontSize="lg" fontWeight="bold" color="teal.600">
              Description
            </FormLabel>
            <Textarea
              placeholder="Enter Course description"
              name="description"
              value={detail.description}
              onChange={handleChange}
              borderColor="teal.300"
              focusBorderColor="teal.500"
              _hover={{ borderColor: "teal.400" }}
              h="150px"
              p="10px"
            />
          </FormControl>
          <FormControl mb={6}>
            <FormLabel fontSize="lg" fontWeight="bold" color="teal.600">
              Category
            </FormLabel>
            <Input
              type="text"
              placeholder="Enter Course Category"
              name="category"
              value={detail.category}
              onChange={handleChange}
              borderColor="teal.300"
              focusBorderColor="teal.500"
              _hover={{ borderColor: "teal.400" }}
              h="50px"
              p="10px"
            />
          </FormControl>
          <FormControl mb={6}>
            <FormLabel fontSize="lg" fontWeight="bold" color="teal.600">
              Price
            </FormLabel>
            <Input
              type="number"
              placeholder="Enter Course Price"
              name="price"
              value={Number(detail.price)}
              onChange={handleChange}
              borderColor="teal.300"
              focusBorderColor="teal.500"
              _hover={{ borderColor: "teal.400" }}
              h="50px"
              p="10px"
            />
          </FormControl>
          <FormControl mb={6}>
            <FormLabel fontSize="lg" fontWeight="bold" color="teal.600">
              Thumbnail
            </FormLabel>
            <Input
              type="text"
              placeholder="Enter Course Thumbnail Link"
              name="img"
              value={detail?.img}
              onChange={handleChange}
              borderColor="teal.300"
              focusBorderColor="teal.500"
              _hover={{ borderColor: "teal.400" }}
              h="50px"
              p="10px"
            />
          </FormControl>
          <Button
            mt={4}
            colorScheme="teal"
            size="lg"
            isFullWidth
            onClick={handleSubmit}
            _hover={{ bg: "teal.600" }}
            _active={{ bg: "teal.700" }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Grid>
  );
};

export default AddCourse;