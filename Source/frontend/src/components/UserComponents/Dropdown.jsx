import React, { useState } from "react";
import {
  ChakraProvider,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Flex,
  Text,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Checkbox,
} from "@chakra-ui/react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { actionUserLogout } from "../../Redux/UserReducer/actionType";
import { BiUserCircle } from "react-icons/bi";
import { FaUserShield } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import { capitalizeFirstLetter } from "../../Redux/UserReducer/action";
import { FaUser, FaTachometerAlt, FaCog, FaHistory } from "react-icons/fa";

const Dropdown = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userStore = useSelector((store) => store.UserReducer);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    profession: "",
    field: "",
    experience: "",
    description: "",
    cv: "",
  });

  const handleProfileClick = () => {
    // Handle profile click logic
    navigate("/profile");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, commitment: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Lấy user từ localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.userId;

    console.log("Debug: Retrieved User:", user);
    console.log("Debug: Retrieved User ID:", userId);

    if (!userId) {
      alert("User ID is missing. Please log in again.");
      return;
    }

    if (!formData.cv) {
      alert("Please provide a CV link.");
      return;
    }

    const data = {
      ...formData,
      userId, // Gửi kèm userId
    };

    try {
      const response = await axios.post(
        "http://localhost:5001/instructors/register",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        alert("Instructor request submitted successfully!");
      } else {
        alert("Failed to submit request. Response status: " + response.status);
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      if (error.response) {
        alert(`Error: ${error.response.data.message || "Unknown error"}`);
      } else {
        alert("Error submitting request.");
      }
    }
  };

  const handleLogoutClick = () => {
    const token = userStore?.token;
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    axios
      .post("http://localhost:5001/users/logout", {}, { headers })
      .then((res) => {
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: "",
            name: "",
            role: "",
            token: "",
            isAuth: "",
            isError: "",
            loading: false,
            success: false,
            isUser: false,
            userId: "",
            place: "",
            age: "",
          })
        );
        dispatch(actionUserLogout());
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <ChakraProvider>
      <Box>
        <Menu>
          <MenuButton
            as={Button}
            bgColor={"#003366"}
            color={"white"}
            variant="outline"
            _hover={{
              bg: "white",
              color: "#0056d2",
              border: "2px solid black",
              cursor: "pointer",
            }}
          >
            <Flex alignItems="center">
              <Text>Profile</Text>
              <Box ml="0.2rem">
                <FiMoreVertical />
              </Box>
            </Flex>
          </MenuButton>
          <MenuList
            p={5}
            w="20vw"
            overflow={userStore?.role === "admin" ? "scroll" : ""}
            h={userStore?.role === "admin" ? "90vh" : ""}
            pb="4"
          >
            {/* user options  */}
            <Box>
              <Flex justify="space-between" alignItems="center">
                <Box p="1.5rem 0">
                  {userStore?.role === "admin" ||
                  userStore?.role === "teacher" ? (
                    <Flex alignItems={"center"}>
                      <Box>
                        <FaUserShield size="2rem" color="#0056d2" />
                        <Text fontSize="0.6rem" fontWeight="bold">
                          {capitalizeFirstLetter(userStore?.role)}
                        </Text>
                      </Box>
                      <Heading size="sm" ml="1rem">
                        {capitalizeFirstLetter(userStore?.name)}
                      </Heading>
                    </Flex>
                  ) : userStore?.role === "user" ? (
                    <Flex alignItems={"center"}>
                      <BiUserCircle size="2rem" color="#0056d2" />
                      <Heading size="sm" ml="1rem">
                        {capitalizeFirstLetter(userStore?.name)}
                      </Heading>
                    </Flex>
                  ) : null}
                </Box>
                <Button
                  fontSize="0.8rem"
                  p="1rem"
                  colorScheme="blue"
                  fontWeight={"bold"}
                  onClick={handleLogoutClick}
                >
                  Logout
                </Button>
              </Flex>
            </Box>

            {/* users options  */}
            {userStore?.role === "user" && (
              <Box>
                <MenuItem
                  p="0.7rem 0"
                  onClick={handleProfileClick}
                  fontWeight="500"
                >
                  <FaUser style={{ marginRight: "8px" }} />{" "}
                  {/* Icon cho "Your Account" */}
                  Your Account
                </MenuItem>

                <Link to="/home">
                  <MenuItem
                    p="0.7rem 0"
                    fontWeight="500"
                    borderTop="1px solid #D7DBDD"
                  >
                    <FaTachometerAlt style={{ marginRight: "8px" }} />{" "}
                    {/* Icon cho "DashBoard" */}
                    DashBoard
                  </MenuItem>
                </Link>

                <Link to="/history">
                  <MenuItem
                    p="0.7rem 0"
                    fontWeight="500"
                    borderTop="1px solid #D7DBDD"
                  >
                    <FaHistory style={{ marginRight: "8px" }} />{" "}
                    {/* Icon mới */}
                    History
                  </MenuItem>
                </Link>
                <MenuList>
                  <MenuItem onClick={() => setIsModalOpen(true)}>
                    Upgrade Instructor
                  </MenuItem>
                </MenuList>
              </Box>
            )}

            {/* admin options */}

            {userStore?.role === "admin" && (
              <Box>
                <Link to="/profile">
                  <MenuItem
                    p="0.7rem 0"
                    fontWeight="500"
                    borderTop="1px solid #D7DBDD"
                  >
                    Your Account
                  </MenuItem>
                </Link>
                <Link to="/home">
                  <MenuItem
                    p="0.7rem 0"
                    fontWeight="500"
                    borderTop="1px solid #D7DBDD"
                  >
                    User Dashboard
                  </MenuItem>
                </Link>
                <Link to="/admin/dashboard">
                  <MenuItem
                    p="0.7rem 0"
                    fontWeight="500"
                    borderTop="1px solid #D7DBDD"
                  >
                    Admin Dashboard
                  </MenuItem>
                </Link>
                <Link to="/admin/courses">
                  <MenuItem
                    p="0.7rem 0"
                    fontWeight="500"
                    borderTop="1px solid #D7DBDD"
                  >
                    Courses
                  </MenuItem>
                </Link>
                <Link to="/admin/users">
                  <MenuItem
                    p="0.7rem 0"
                    fontWeight="500"
                    borderTop="1px solid #D7DBDD"
                  >
                    Users
                  </MenuItem>
                </Link>
                <Link to="/admin/Add">
                  <MenuItem
                    p="0.7rem 0"
                    fontWeight="500"
                    borderTop="1px solid #D7DBDD"
                  >
                    Add videos
                  </MenuItem>
                </Link>
                <Link to="/admin/videos">
                  <MenuItem
                    p="0.7rem 0"
                    fontWeight="500"
                    borderTop="1px solid #D7DBDD"
                  >
                    AllVideos
                  </MenuItem>
                </Link>
                <Link to="/admin/discount">
                  <MenuItem
                    p="0.7rem 0"
                    fontWeight="500"
                    borderTop="1px solid #D7DBDD"
                  >
                    Discount
                  </MenuItem>
                </Link>
                <Link to="/admin/giftcard">
                  <MenuItem
                    p="0.7rem 0"
                    fontWeight="500"
                    borderTop="1px solid #D7DBDD"
                  >
                    GiftCards
                  </MenuItem>
                </Link>
                <Link to="/admin/statistic">
                  <MenuItem
                    p="0.7rem 0"
                    fontWeight="500"
                    borderTop="1px solid #D7DBDD"
                  >
                    Statistics
                  </MenuItem>
                </Link>
                <Link to="/admin/setting">
                  <MenuItem
                    p="0.7rem 0"
                    fontWeight="500"
                    borderTop="1px solid #D7DBDD"
                  >
                    Settings
                  </MenuItem>
                </Link>
              </Box>
            )}

            {/* Teacher options */}

            {userStore?.role === "teacher" && (
              <Box>
                <Link to="/profile">
                  <MenuItem
                    p="0.7rem 0"
                    fontWeight="500"
                    borderTop="1px solid #D7DBDD"
                  >
                    Your Account
                  </MenuItem>
                </Link>
                <Link to="/home">
                  <MenuItem
                    p="0.7rem 0"
                    fontWeight="500"
                    borderTop="1px solid #D7DBDD"
                  >
                    User Dashboard
                  </MenuItem>
                </Link>
                <Link to="/TeacherDashboard">
                  <MenuItem
                    p="0.7rem 0"
                    fontWeight="500"
                    borderTop="1px solid #D7DBDD"
                  >
                    Teacher Dashboard
                  </MenuItem>
                </Link>
                <Link to="/Teacher/courses">
                  <MenuItem
                    p="0.7rem 0"
                    fontWeight="500"
                    borderTop="1px solid #D7DBDD"
                  >
                    Courses
                  </MenuItem>
                </Link>
                {/* <Link to="/Teacher/users">
                  <MenuItem
                    p="0.7rem 0"
                    fontWeight="500"
                    borderTop="1px solid #D7DBDD"
                  >
                    Users
                  </MenuItem>
                </Link> */}
                {/* <Link to="/Teacher/videos">
                  <MenuItem
                    p="0.7rem 0"
                    fontWeight="500"
                    borderTop="1px solid #D7DBDD"
                  >
                    All Videos
                  </MenuItem>
                </Link> */}
                <Link to="/Teacher/add">
                  <MenuItem
                    p="0.7rem 0"
                    fontWeight="500"
                    borderTop="1px solid #D7DBDD"
                  >
                    Add Videos
                  </MenuItem>
                </Link>
                {/* <Link to="/admin/discount">
                  <MenuItem
                    p="0.7rem 0"
                    fontWeight="500"
                    borderTop="1px solid #D7DBDD"
                  >
                    Discount
                  </MenuItem>
                </Link>
                <Link to="/admin/giftcard">
                  <MenuItem
                    p="0.7rem 0"
                    fontWeight="500"
                    borderTop="1px solid #D7DBDD"
                  >
                    GiftCards
                  </MenuItem>
                </Link>
                <Link to="/admin/statistic">
                  <MenuItem
                    p="0.7rem 0"
                    fontWeight="500"
                    borderTop="1px solid #D7DBDD"
                  >
                    Statistics
                  </MenuItem>
                </Link> */}
                <Link to="/admin/setting">
                  <MenuItem
                    p="0.7rem 0"
                    fontWeight="500"
                    borderTop="1px solid #D7DBDD"
                  >
                    Settings
                  </MenuItem>
                </Link>
              </Box>
            )}
            {/* Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Upgrade to Instructor</ModalHeader>
                <ModalBody>
                  <FormControl>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel>Age</FormLabel>
                    <Input
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="Enter your age"
                    />
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel>Profession</FormLabel>
                    <Input
                      name="profession"
                      value={formData.profession}
                      onChange={handleInputChange}
                      placeholder="Enter your profession"
                    />
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel>Field of Expertise</FormLabel>
                    <Input
                      name="field"
                      value={formData.field}
                      onChange={handleInputChange}
                      placeholder="Enter your field of expertise"
                    />
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel>Experience</FormLabel>
                    <Input
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="Enter your years of experience"
                    />
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel>Short Description</FormLabel>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Provide a short description about yourself"
                    />
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel>CV Link (Drive URL)</FormLabel>
                    <Input
                      name="cv"
                      placeholder="Enter CV link"
                      value={formData.cv}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  <FormControl mt={4}>
                    <Checkbox
                      isChecked={formData.commitment}
                      onChange={handleCheckboxChange}
                    >
                      I agree to the terms and conditions and commit to
                      maintaining the quality as an instructor.
                    </Checkbox>
                  </FormControl>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                    Submit
                  </Button>
                  <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </MenuList>
        </Menu>
      </Box>
    </ChakraProvider>
  );
};

export default Dropdown;
