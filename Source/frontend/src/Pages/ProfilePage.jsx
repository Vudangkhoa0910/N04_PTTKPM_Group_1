import React, { useState } from "react";
import {
  ChakraProvider,
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Avatar,
  Center,
  useToast,
  HStack,
  SimpleGrid,
  GridItem,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import UserNavbar from "../components/UserComponents/UserNavbar";
import { useDispatch, useSelector } from "react-redux";
import { actionLoginSuccess } from "../Redux/UserReducer/actionType";
import { showToast } from "../components/SignUp";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const userStore = useSelector((store) => store.UserReducer);

  const [name, setName] = useState(userStore?.name || "");
  const [email, setEmail] = useState(userStore?.email || "");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState(userStore?.age || "");
  const [city, setCity] = useState(userStore?.place || "");
  const [job, setJob] = useState(
    (userStore?.job !== "null" && userStore?.job) || ""
  );
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSave = () => {
    const obj = {
      name,
      email,
      password,
      age,
      city,
      job,
    };

    const id = userStore?.userId;

    axios
  .patch(`http://localhost:5000/users/update/${id}`, obj)
  .then((res) => {
    console.log('API Response:', res);
    console.log("User ID:", id);
    dispatch(actionLoginSuccess(res?.data));
    localStorage.setItem(
      "user",
      JSON.stringify({
        email: res.data.user.email,
        name: res.data.user.name,
        role: res.data.user.role,
        token: res.data.token,
        isAuth: true,
        userId: res.data.user._id,
        age: res.data.user.age,
        job: res.data.user.job,
        place: res.data.user.city,
      })
    );
    navigate(-1);
    showToast({ toast, message: "Profile Updated", color: "green" });
  })
  .catch((err) => {
    console.error('Error during profile update:', err);
    showToast({ toast, message: "Error occurred", color: "red" });
  });
  };

  const cardBg = useColorModeValue("white", "gray.800");
  const cardShadow = useColorModeValue("md", "dark-lg");

  return (
    <Box pb="2rem" bg="gray.100" minH="100vh">
      <UserNavbar />
      <Box
        maxW="800px"
        mx="auto"
        p="8"
        pt="90px"
        bg={cardBg}
        shadow={cardShadow}
        rounded="lg"
        mt={30}
      >
        <Center>
          <Avatar
            size="2xl"
            name={name}
            src="/path/to/profile-image.jpg"
            bg="teal.500"
          />
        </Center>
        <Heading mt="6" mb="6" fontSize="2xl" textAlign="center" color="teal.600">
          Edit Profile
        </Heading>
        <SimpleGrid columns={2} spacing={6}>
          {/* Name */}
          <GridItem>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                bg="gray.50"
                _focus={{ borderColor: "teal.400" }}
              />
            </FormControl>
          </GridItem>

          {/* Email */}
          <GridItem>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                bg="gray.50"
                _focus={{ borderColor: "teal.400" }}
              />
            </FormControl>
          </GridItem>

          {/* Password */}
          <GridItem>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                bg="gray.50"
                _focus={{ borderColor: "teal.400" }}
              />
            </FormControl>
          </GridItem>

          {/* Age */}
          <GridItem>
            <FormControl isRequired>
              <FormLabel>Age</FormLabel>
              <Input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                bg="gray.50"
                _focus={{ borderColor: "teal.400" }}
              />
            </FormControl>
          </GridItem>

          {/* City */}
          <GridItem>
            <FormControl isRequired>
              <FormLabel>City</FormLabel>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                bg="gray.50"
                _focus={{ borderColor: "teal.400" }}
              />
            </FormControl>
          </GridItem>

          {/* Job */}
          <GridItem>
            <FormControl isRequired>
              <FormLabel>Job</FormLabel>
              <Input
                value={job}
                onChange={(e) => setJob(e.target.value)}
                bg="gray.50"
                _focus={{ borderColor: "teal.400" }}
              />
            </FormControl>
          </GridItem>
        </SimpleGrid>

        <Button
          mt="8"
          width="full"
          colorScheme="teal"
          isDisabled={
            name === "" || email === "" || age === "" || city === "" || job === ""
          }
          onClick={handleSave}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default ProfilePage;