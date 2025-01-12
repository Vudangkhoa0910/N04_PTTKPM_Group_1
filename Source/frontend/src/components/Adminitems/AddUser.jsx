import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Text,
  Textarea,
  useBreakpointValue,
  Flex,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../../Redux/AdminReducer/action";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let obj = {
    name: "",
    email: "",
    password: "",
    city: "",
    age: "",
    job: "",
    image: "",
  };

  const [detail, setDetail] = useState(obj);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetail((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = () => {
    dispatch(addUser(detail));
    alert("User Added Successfully");
    navigate("/admin/users");
  };

  // Responsive layout based on screen size
  const formWidth = useBreakpointValue({ base: "100%", md: "70%", lg: "50%" });

  return (
    <Grid
      h="100vh"
      templateRows="auto 1fr"
      gap={10}
      p={5}
      bg="gray.50"
      mt="5vh"
    >
      {/* Main Content */}
      <Flex justify="center" align="center" w="100%" p={5}>
        <Box
          w={formWidth}
          border="1px solid #ccc"
          borderRadius="8px"
          p={8}
          bg="white"
          shadow="lg"
        >
          <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
            Add New User
          </Text>

          {/* Form Inputs */}
          <FormControl mb={4}>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              placeholder="Enter User's Name"
              name="name"
              value={detail.name}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Email</FormLabel>
            <Textarea
              type="email"
              placeholder="Enter User's Email"
              name="email"
              value={detail.email}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter Password"
              name="password"
              value={detail.password}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>City</FormLabel>
            <Input
              type="text"
              placeholder="Enter City"
              name="city"
              value={detail.city}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Age</FormLabel>
            <Input
              type="number"
              placeholder="Enter Age"
              name="age"
              value={detail.age}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Job</FormLabel>
            <Input
              type="text"
              placeholder="Enter Job"
              name="job"
              value={detail.job}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Image</FormLabel>
            <Input
              type="text"
              placeholder="Enter Image URL"
              name="image"
              value={detail.image}
              onChange={handleChange}
            />
          </FormControl>

          {/* Submit Button */}
          <Button
            mt={4}
            colorScheme="teal"
            size="lg"
            width="100%"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </Flex>
    </Grid>
  );
};

export default AddUser;