import {
  Box,
  Flex,
  Input,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoSearchCircleOutline } from "react-icons/io5";
import { AiOutlineQuestionCircle, AiOutlineBell } from "react-icons/ai";
import { useSelector } from "react-redux";

const TeacherNavTop = ({ handleSearch }) => {
  const userStore = useSelector((store) => store.UserReducer);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Flex h="10vh" justifyContent="space-between" mt="15px" px={5}>
      <Flex w="60%" alignItems="center">
        <Link>
          <IoSearchCircleOutline
            style={{
              fontSize: "8vh",
              color: "gray",
              marginRight: "15px",
              transition: "all 0.3s ease", // Thêm hiệu ứng khi hover
            }}
            _hover={{ transform: "scale(1.2)", color: "#4A90E2" }} // Tạo hiệu ứng phóng to và đổi màu khi hover
          />
        </Link>
        <Box w="50%">
          <Input
            placeholder="Search Anything"
            border="2px solid #CBD5E0" // Thêm viền cho ô search
            borderRadius="8px" // Đường viền mềm mại
            h="8vh"
            w="100%"
            onChange={handleSearch}
            fontSize="1.2rem"
            _focus={{
              borderColor: "#4A90E2", // Thay đổi màu viền khi focus
            }}
          />
        </Box>
      </Flex>

      <Flex
        gap={5}
        flexDirection="row"
        display={{ base: "none", md: "flex" }}
        alignItems="center"
      >
        <Link to="#">
          <AiOutlineQuestionCircle
            style={{ fontSize: "4vh", color: "black", marginTop: "10px" }}
          />
        </Link>
        <Link>
          <AiOutlineBell
            style={{ fontSize: "4vh", color: "black", marginTop: "10px" }}
          />
        </Link>

        <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
          <MenuButton
            as={Button}
            borderRadius="50%"
            border="1px solid"
            bg="#CFD8DC"
            cursor="pointer"
            textAlign="center"
            w="40px"
            h="40px"
            p={0}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Text fontSize="18px" mt="-2px" color="black">
              {userStore?.name[0]}
            </Text>
          </MenuButton>
          {userStore?.role === "teacher" && (
            <MenuList
              borderRadius="8px"
              boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)" // Đổ bóng nhẹ để làm nổi bật
              bg="#ffffff"
              border="1px solid #CBD5E0" // Viền màu xám nhẹ để tạo sự mềm mại
              p="1rem"
              width="220px"
              zIndex={1}
            >
              <MenuItem
                _hover={{
                  bg: "#E5F7F5", // Nền màu xanh nhẹ khi hover
                  color: "teal.600", // Màu chữ khi hover
                  borderLeft: "4px solid teal", // Thêm viền trái cho menu item khi hover
                }}
                borderRadius="8px"
                p="0.8rem 1rem"
              >
                <Link to="/profile">
                  <Text fontSize="1rem">Your Account</Text>
                </Link>
              </MenuItem>

              <MenuItem
                _hover={{
                  bg: "#E5F7F5",
                  color: "teal.600",
                  borderLeft: "4px solid teal",
                }}
                borderRadius="8px"
                p="0.8rem 1rem"
              >
                <Link to="/home">
                  <Text fontSize="1rem">User Dashboard</Text>
                </Link>
              </MenuItem>

              <MenuItem
                _hover={{
                  bg: "#E5F7F5",
                  color: "teal.600",
                  borderLeft: "4px solid teal",
                }}
                borderRadius="8px"
                p="0.8rem 1rem"
              >
                <Link to="/Teacherdashboard">
                  <Text fontSize="1rem">Teacher Dashboard</Text>
                </Link>
              </MenuItem>

              <MenuItem
                _hover={{
                  bg: "#E5F7F5",
                  color: "teal.600",
                  borderLeft: "4px solid teal",
                }}
                borderRadius="8px"
                p="0.8rem 1rem"
              >
                <Link to="/Teacher/courses">
                  <Text fontSize="1rem">Courses</Text>
                </Link>
              </MenuItem>

              <MenuItem
                _hover={{
                  bg: "#E5F7F5",
                  color: "teal.600",
                  borderLeft: "4px solid teal",
                }}
                borderRadius="8px"
                p="0.8rem 1rem"
              >
                <Link to="/Teacher/add">
                  <Text fontSize="1rem">Add Videos</Text>
                </Link>
              </MenuItem>

              <MenuItem
                _hover={{
                  bg: "#E5F7F5",
                  color: "teal.600",
                  borderLeft: "4px solid teal",
                }}
                borderRadius="8px"
                p="0.8rem 1rem"
              >
                <Link to="/Teacher/setting">
                  <Text fontSize="1rem">Settings</Text>
                </Link>
              </MenuItem>
            </MenuList>
          )}
        </Menu>
      </Flex>
    </Flex>
  );
};

export default TeacherNavTop;
