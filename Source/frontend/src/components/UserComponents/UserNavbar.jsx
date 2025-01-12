import React, { useState } from "react";
import {
  Flex,
  Box,
  Input,
  IconButton,
  useBreakpointValue,
  Text,
  Link,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FaSearch, FaBars } from "react-icons/fa";
import Dropdown from "./Dropdown";
import { useLocation, useNavigate } from "react-router-dom";
import { NavBarDrawer } from "../NavBarDrawer";
import { showToast } from "../SignUp";

const Navbar = () => {
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [showSearchBar, setShowSearchBar] = useState(false);
  const toast = useToast();
  const location = useLocation();
  function home() {
    navigate("/home");
  }

  function handleShowSearchBar() {
    setShowSearchBar(!showSearchBar);
    if (showSearchBar && location.pathname === "/home") {
      showToast({
        toast,
        message: `Below is you search Result`,
        color: "green",
      });
    }
  }

  return (
    <Box>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        p={4}
        bg="#FF9900"
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
        position="fixed"
        width="calc(100vw)" // Giảm chiều rộng
        mx="auto" // Căn giữa thanh Navbar
        zIndex={12}
        top={0}
        borderTopRadius="16px" // Bo góc trên
      >
        <Flex align="center">
          <Box>
            {/* Logo */}
            <Text
              fontSize={30}
              fontWeight="extrabold"
              color="#003366"
              _hover={{ cursor: "pointer" }}
              onClick={home}
            >
              <span style={{ color: "#003366" }}>Edu</span>
              <span style={{ color: "#FFFFFF" }}>PHENIKAA</span>
            </Text>
          </Box>
        </Flex>

        {!isMobile ? (
          <Flex align="center">
            <Box display="flex" alignItems="center">
              {/* Search Bar */}
              <Input
                type="text"
                variant="filled"
                border="1px solid #003366"
                fontSize="0.7rem"
                color="#003366"
                placeholder="What do you want to learn?"
                borderRadius="10px 0 0 10px"
                _placeholder={{ color: "#555454", letterSpacing: "1px" }}
                width="40rem"
                autoComplete="off"
                readOnly
                onFocus={(e) => e.target.removeAttribute("readOnly")}
                _focus={{ backgroundColor: "white" }}
              />
              <IconButton
                aria-label="Search"
                icon={<FaSearch />}
                bg="#003366"
                color="white"
                borderRadius="0 10px 10px 0"
                _hover={{ backgroundColor: "#002147" }}
              />
            </Box>
          </Flex>
        ) : (
          <Flex align="center">
            <IconButton
              aria-label="Menu"
              icon={<FaBars />}
              bg="transparent"
              color="#003366"
              fontSize="2xl"
              mr={2}
              onClick={onOpen}
            />
          </Flex>
        )}

        {isMobile && location.pathname === "/home" && (
          <Box>
            {showSearchBar ? (
              <Flex align="center">
                <Box>
                  {/* Search Bar */}
                  <Input
                    type="text"
                    variant="filled"
                    border="1px solid #003366"
                    fontSize="0.8rem"
                    m="0 2rem"
                    color="#003366"
                    placeholder="Find your new Skill!"
                    borderRadius="10px 0 0px 10px"
                    _placeholder={{
                      color: "#555454",
                      letterSpacing: "0.5px",
                    }}
                  />
                </Box>
                <IconButton
                  aria-label="Search"
                  icon={<FaSearch />}
                  bg="#003366"
                  onClick={handleShowSearchBar}
                  color="white"
                  borderRightRadius="7px"
                  borderRadius="0px 10px 10px 0px"
                />
              </Flex>
            ) : (
              <IconButton
                aria-label="Search"
                icon={<FaSearch />}
                color="white"
                borderRadius="7px"
                bg="#003366"
                onClick={handleShowSearchBar}
                _hover={{ backgroundColor: "#002147", color: "white" }}
              />
            )}
          </Box>
        )}

        {!isMobile && (
          <Flex align="center" pr="16px">
            <Box mr={4}>
              <Link
                _hover={{ color: "#002147", textDecoration: "underline" }}
                href="/Teachme"
                color="#003366"
              >
                {user.role !== "teacher" &&
                  user.role !== "admin" &&
                  "Teach On SRM"}
              </Link>
            </Box>
            <Box>
              <Dropdown />
            </Box>
          </Flex>
        )}
      </Flex>
      <NavBarDrawer isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </Box>
  );
};

export default Navbar;
