import React, { useRef, useState } from "react";
import Navbar from "../Pages/Navbar";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Spinner,
  Text,
  useToast,
  Checkbox,
} from "@chakra-ui/react";

import { AiOutlineEyeInvisible, AiFillEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signUpFetch } from "../Redux/UserReducer/action";
import { actionsingUpError } from "../Redux/UserReducer/actionType";

export const showToast = ({ toast, message, color }) => {
  toast({
    position: "top-right",
    duration: 3000,
    render: () => (
      <Box color="white" p={3} borderRadius="md" bg={color}>
        {message || "Something went wrong. Please try again."}
      </Box>
    ),
  });
};

const SignUp = () => {
  const emailInput = useRef(null);
  const passwordInput = useRef(null);
  const nameInput = useRef(null);
  const confirmPasswordInput = useRef(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    isPromotion: false,
  });

  const navigate = useNavigate();
  const userStore = useSelector((store) => store.UserReducer);
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(false);
  const [eyeClose, setEyeClose] = useState(false);
  const toast = useToast();

  const handleInput = (e) => {
    const { value, name } = e.target;
    setForm({ ...form, [name]: value });
  };

  const showPassword = () => {
    setEyeClose(!eyeClose);
    passwordInput.current.type =
      passwordInput.current.type === "password" ? "text" : "password";
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    setForm({ ...form, isPromotion: !isChecked });
  };

  const handleSignUp = async () => {
    const { email, password, confirmPassword, name } = form;
    if (!email || !password || !confirmPassword || !name) {
      dispatch(actionsingUpError("All fields are required"));
      return;
    }
    if (confirmPassword !== password) {
      dispatch(actionsingUpError("Passwords do not match"));
      return;
    }
    if (password.length < 8) {
      dispatch(
        actionsingUpError("Password must be at least 8 characters long")
      );
      return;
    }

    dispatch(signUpFetch(form)).then((res) => {
      if (!userStore?.isError) {
        setForm({ email: "", password: "", confirmPassword: "", name: "" });
        showToast({ toast, message: "Sign up successful", color: "green" });
        navigate("/login");
      } else {
        showToast({ toast, message: userStore?.isError, color: "red" });
      }
    });
  };

  return (
    <Box>
      <Navbar />
      <Flex justify="center" pt="3rem">
        <Box
          w={{ base: "90%", sm: "80%", md: "40%", lg: "30%" }}
          bg="gray.50"
          p="2.5rem"
          borderRadius="xl"
          boxShadow="md"
          color="black"
        >
          <Heading size="lg" textAlign="center" mb="1.5rem">
            Sign Up
          </Heading>
          <Box>
            {/* Name */}
            <Box mb="1.5rem">
              <Text fontWeight="semibold" mb="0.5rem">
                Name
              </Text>
              <Input
                ref={nameInput}
                placeholder="Enter your name"
                name="name"
                value={form.name}
                onChange={handleInput}
                borderColor="gray.300"
                focusBorderColor="blue.400"
                borderRadius="lg"
                p="1.2rem"
              />
            </Box>
            {/* Email */}
            <Box mb="1.5rem">
              <Text fontWeight="semibold" mb="0.5rem">
                Email
              </Text>
              <Input
                ref={emailInput}
                placeholder="Enter your email"
                name="email"
                value={form.email}
                onChange={handleInput}
                borderColor="gray.300"
                focusBorderColor="blue.400"
                borderRadius="lg"
                p="1.2rem"
              />
            </Box>
            {/* Password */}
            <Box mb="1.5rem">
              <Text fontWeight="semibold" mb="0.5rem">
                Password
              </Text>
              <Flex align="center">
                <Input
                  ref={passwordInput}
                  type="password"
                  placeholder="Enter your password"
                  name="password"
                  value={form.password}
                  onChange={handleInput}
                  borderColor="gray.300"
                  focusBorderColor="blue.400"
                  borderRadius="lg"
                  p="1.2rem"
                />
                <Box ml="0.5rem" onClick={showPassword} cursor="pointer">
                  {eyeClose ? (
                    <AiFillEye size="24px" />
                  ) : (
                    <AiOutlineEyeInvisible size="24px" />
                  )}
                </Box>
              </Flex>
            </Box>
            {/* Confirm Password */}
            <Box mb="1.5rem">
              <Text fontWeight="semibold" mb="0.5rem">
                Confirm Password
              </Text>
              <Input
                ref={confirmPasswordInput}
                type="password"
                placeholder="Confirm your password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleInput}
                borderColor="gray.300"
                focusBorderColor="blue.400"
                borderRadius="lg"
                p="1.2rem"
              />
            </Box>
            {/* Checkbox */}
            <Box mb="1.5rem">
              <Checkbox
                isChecked={isChecked}
                onChange={handleCheckboxChange}
                colorScheme="blue"
              >
                Accept the terms and comply with the system regulations.
              </Checkbox>
            </Box>
            {/* Sign Up Button */}
            <Button
              w="100%"
              colorScheme="blue"
              onClick={handleSignUp}
              isLoading={userStore.loading}
              loadingText="Signing Up"
              borderRadius="lg"
              p="1.5rem"
              _hover={{ bg: "blue.600" }}
            >
              Sign Up
            </Button>
            <Flex justify="center" mt="1.5rem">
              <Text>Already have an account?</Text>
              <Link to="/login">
                <Text
                  ml="0.5rem"
                  color="blue.500"
                  fontWeight="bold"
                  _hover={{ textDecoration: "underline" }}
                >
                  Login
                </Text>
              </Link>
            </Flex>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default SignUp;
