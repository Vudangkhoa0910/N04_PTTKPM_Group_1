import React, { useEffect, useRef, useState } from "react";
import Navbar from "../Pages/Navbar";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Spinner,
  Text,
  keyframes,
  useToast,
} from "@chakra-ui/react";

import { useDispatch, useSelector, useStore } from "react-redux";
import { loginFetch } from "../Redux/UserReducer/action";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "./SignUp";

const Login = () => {
  const emailInput = useRef(null);
  const backgroundRef = useRef(null);
  const emailbox = useRef(null);
  const passwordInput = useRef(null);
  const passwordbox = useRef(null);
  const [form, setForm] = useState({ email: "", password: "" });

  const userStore = useSelector((store) => store.UserReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  // will show the input element when click on element
  function showInput(e) {
    const ele = e.target.id;
    if (ele === "email") {
      emailInput.current.style.display = "block";
      emailInput.current.focus();
      emailbox.current.style.padding = "5px 20px";
    } else if (ele === "password") {
      passwordInput.current.style.display = "block";
      passwordInput.current.focus();
      passwordbox.current.style.padding = "5px 20px";
    }
  }

  // will block the input element when click on backgrond
  function blockInput(event) {
    if (event.target === backgroundRef.current && !form.email) {
      emailInput.current.style.display = "none";
      emailbox.current.style.padding = "20px";
    }
    if (event.target === backgroundRef.current && !form.password) {
      passwordInput.current.style.display = "none";
      passwordbox.current.style.padding = "20px";
    }
  }

  // form management

  function handleInput(e) {
    const { value, name } = e.target;
    if (name === "email") {
      setForm({ ...form, email: value });
    } else {
      setForm({ ...form, password: value });
    }
  }

  // login function
  function handleLogin() {
    dispatch(loginFetch(form)).then((res) => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.message) {
        showToast({ toast, message: "Login Successful", color: "green" });
        setForm({ email: "", password: "" });
      } else {
        showToast({ toast, message: userStore?.isError, color: "red" });
      }
    });
  }

  useEffect(() => {
    // if isAuth is true move to dashboard;

    if (userStore.isAuth) {
      if (userStore?.role === "user") {
        navigate("/home");
      } else if (userStore?.role === "admin") {
        navigate("/admin/dashboard");
      } else if (userStore?.role === "teacher") {
        navigate("/TeacherDashboard");
      }
    }
  }, [userStore?.isAuth, userStore?.role]);

  return (
    <Box pb="2rem" bg="#F9FAFB" minH="100vh">
      <Navbar />
      <Flex justify="center" align="center" pt="4rem">
        <Box
          w={{ base: "90%", sm: "80%", md: "40%", lg: "30%" }}
          p="2.5rem"
          bg="white"
          borderRadius="md"
          boxShadow="lg"
        >
          <Heading size="md" mb="1.5rem" textAlign="center">
            Log in to your eLearning Account
          </Heading>

          {/* Email Input */}
          <Box
            border="1px solid #E0E0E0"
            p="1.5rem"
            borderRadius="md"
            mb="1rem"
            ref={emailbox}
            onClick={showInput}
            id="email"
            _hover={{ borderColor: "#90CAF9" }}
          >
            <Text fontWeight="bold" fontSize="sm" color="gray.700">
              Email
            </Text>
            <Input
              display="none"
              ref={emailInput}
              border="none"
              p="0px"
              focusBorderColor="transparent"
              _focus={{ outline: "none" }}
              name="email"
              value={form.email}
              onChange={handleInput}
            />
          </Box>

          {/* Password Input */}
          <Box
            border="1px solid #E0E0E0"
            p="1.5rem"
            borderRadius="md"
            mb="1.5rem"
            ref={passwordbox}
            onClick={showInput}
            id="password"
            _hover={{ borderColor: "#90CAF9" }}
          >
            <Text fontWeight="bold" fontSize="sm" color="gray.700">
              Password
            </Text>
            <Input
              type="password"
              display="none"
              ref={passwordInput}
              border="none"
              size="sm"
              focusBorderColor="transparent"
              _focus={{ outline: "none" }}
              name="password"
              value={form.password}
              onChange={handleInput}
            />
          </Box>

          {/* Sign Up Link */}
          <Flex justify="center" mb="1rem" fontSize="sm">
            <Text>Don't have an account?</Text>
            <Link to="/signup">
              <Text
                ml="0.5rem"
                color="blue.600"
                fontWeight="bold"
                _hover={{ textDecoration: "underline" }}
              >
                Sign Up
              </Text>
            </Link>
          </Flex>

          {/* Login Button */}
          <Button
            w="100%"
            colorScheme="blue"
            borderRadius="md"
            p="1.5rem"
            onClick={handleLogin}
            isLoading={userStore.loading}
            loadingText="Logging in"
            _hover={{ bg: "blue.600" }}
          >
            Log in
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default Login;
