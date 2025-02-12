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
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaSearch, FaBars, FaMoon, FaSun } from "react-icons/fa";
import Dropdown from "./Dropdown";
import { useLocation, useNavigate } from "react-router-dom";
import { NavBarDrawer } from "../NavBarDrawer";
import { showToast } from "../SignUp";

const UserNavBar = () => {
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const toast = useToast();
  const location = useLocation();

  const { toggleColorMode, colorMode } = useColorMode();
  const navbarBgColor = useColorModeValue("#FF9900", "#2D3748");
  const logoTextColor = useColorModeValue("#003366", "#E2E8F0");
  const searchBarTextColor = useColorModeValue("#003366", "white");
  const buttonHoverColor = useColorModeValue("#002147", "#FF9900");
  const linkColor = useColorModeValue("#003366", "#FF9900");
  const inputBorderColor = useColorModeValue("#003366", "#E2E8F0");
  
  // Colors when dark mode
  const darkLoginColor = "#FF9900";  // Orange color for Login in dark mode
  const darkPhenikaaColor = "#FF9900";  // Orange color for Phenikaa in dark mode
  const darkEduColor = "#FFFFFF";  // White color for Edu in dark mode

  // Colors when light mode
  const lightLoginColor = "#003366";  // Default color for Login in light mode
  const lightPhenikaaColor = "#003366";  // Default color for Phenikaa in light mode
  const lightEduColor = "#003366";  // Default color for Edu in light mode
  const logoTextColorEdu = useColorModeValue("#003366", "#FFFFFF"); // Edu màu sáng là xanh than, tối là trắng
  const logoTextColorPhenikaa = useColorModeValue("#FFFFFF", "#FF9900"); // Phenikaa màu sáng là trắng, tối là cam  

  function home() {
    navigate("/home");
  }

  function handleShowSearchBar() {
    setShowSearchBar(!showSearchBar);
    if (showSearchBar && location.pathname === "/home") {
      showToast({
        toast,
        message: `Below is your search result`,
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
        bg={navbarBgColor}
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
        position="fixed"
        width="calc(100vw)"
        mx="auto"
        zIndex={12}
        top={0}
        borderTopRadius="16px"
      >
        <Flex align="center">
          <Box>
            <Text
              fontSize={30}
              fontWeight="extrabold"
              color={logoTextColorEdu}
              _hover={{ cursor: "pointer" }}
              onClick={home}
            >
              <span
                style={{
                  color: colorMode === "light" ? logoTextColorEdu : darkEduColor,
                }}
              >
                Edu
              </span>
              <span
                style={{
                  color: colorMode === "light" ? logoTextColorPhenikaa : darkPhenikaaColor,
                }}
              >
                PHENIKAA
              </span>
            </Text>
          </Box>
        </Flex>

        {!isMobile ? (
          <Flex align="center">
            <Box display="flex" alignItems="center">
              <Input
                type="text"
                variant="filled"
                border={`1px solid ${inputBorderColor}`}
                fontSize="0.7rem"
                color={searchBarTextColor}
                placeholder="What do you want to learn?"
                borderRadius="10px 0 0 10px"
                _placeholder={{
                  color: colorMode === "light" ? "#555454" : "white",
                  letterSpacing: "1px",
                }}
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
                _hover={{ backgroundColor: buttonHoverColor }}
              />
            </Box>
          </Flex>
        ) : (
          <Flex align="center">
            <IconButton
              aria-label="Menu"
              icon={<FaBars />}
              bg="transparent"
              color={logoTextColor}
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
                  <Input
                    type="text"
                    variant="filled"
                    border={`1px solid ${inputBorderColor}`}
                    fontSize="0.8rem"
                    m="0 2rem"
                    color={searchBarTextColor}
                    placeholder="Find your new Skill!"
                    borderRadius="10px 0 0px 10px"
                    _placeholder={{
                      color: colorMode === "light" ? "#555454" : "white",
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
                _hover={{ backgroundColor: buttonHoverColor, color: "white" }}
              />
            )}
          </Box>
        )}

        {!isMobile && (
          <Flex align="center" pr="16px">
            {/* Dark/Light Mode Toggle Button */}
            <IconButton
              aria-label="Toggle Dark Mode"
              icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
              onClick={toggleColorMode}
              bg="transparent"
              color={logoTextColor}
              fontSize="xl"
              mr={4}
            />

            <Box mr={4}>
              <Link
                _hover={{ color: buttonHoverColor, textDecoration: "underline" }}
                href="/Teachme"
                color={linkColor}
              >
                {user.role !== "teacher" && user.role !== "admin" && "Role Teach"}
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

export default UserNavBar;
