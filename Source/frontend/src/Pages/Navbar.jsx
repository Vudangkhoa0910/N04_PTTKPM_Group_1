import React from "react";
import {
  Flex,
  Box,
  Input,
  Button,
  IconButton,
  useBreakpointValue,
  Text,
  Link,
  useDisclosure,
  useColorMode, // Chakra hook for color mode
  useColorModeValue, // Chakra hook to handle dynamic color change
} from "@chakra-ui/react";
import { FaSearch, FaBars, FaMoon, FaSun } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { NavBarDrawer } from "../components/NavBarDrawer";

const Navbar = () => {
  const { toggleColorMode } = useColorMode(); // Chakra hook to toggle color mode
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  function signup() {
    navigate("/signup");
  }

  function home() {
    navigate("/");
  }

  // Define colors for light and dark modes
  const logoColor = useColorModeValue("#003366", "#E2E8F0"); // Logo text color based on theme
  const loginColor = useColorModeValue("#003366", "#FF9900"); // Login text color based on theme
  const searchTextColor = useColorModeValue("white", "#003366"); // Search input text color based on theme
  const navBarColor = useColorModeValue("#FF9900", "#2D3748"); // NavBar background color
  const buttonHoverColor = useColorModeValue("#002147", "#FF9900"); // Button hover color based on theme
  const phenikaaColor = useColorModeValue("#FFFFFF", "#FF9900"); // Color for "PHENIKAA" text based on theme

  return (
    <Box>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        p={4}
        bg={navBarColor} // Background color for light/dark mode
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
        position="fixed"
        width="100%"
        zIndex={12}
      >
        {/* Logo */}
        <Flex align="center">
          <Box>
            <Text
              fontSize={30}
              fontWeight="extrabold"
              onClick={home}
              _hover={{ cursor: "pointer" }}
              color={logoColor} // Logo text color based on theme
            >
              <span style={{ color: "#003366" }}>Edu</span>
              <span style={{ color: phenikaaColor }}>PHENIKAA</span> {/* Change to white for light mode */}
            </Text>
          </Box>
        </Flex>

        {/* Desktop Layout */}
        {!isMobile ? (
          <Flex>
            <Box display="flex" alignItems="center">
              {/* Search Bar */}
              <Input
                type="text"
                variant="filled"
                border="1px solid #003366"
                fontSize="0.7rem"
                color={searchTextColor} // Search bar text color based on theme
                placeholder="What do you want to learn?"
                borderRadius="10px 0 0 10px"
                _placeholder={{ color: "#555454", letterSpacing: "1px" }}
                width="40rem"
                autoComplete="off"
                readOnly
                onFocus={(e) => e.target.removeAttribute("readOnly")}
              />
              <IconButton
                aria-label="Search"
                icon={<FaSearch />}
                bg="#003366"
                color="white"
                borderRadius="0 10px 10px 0"
                _hover={{ background: "#002147" }}
              />
            </Box>
          </Flex>
        ) : (
          // Mobile Layout
          <Flex align="center">
            <IconButton
              aria-label="Menu"
              icon={<FaBars />}
              bg="transparent"
              color="#003366"
              onClick={onOpen}
              fontSize="2xl"
              mr={2}
            />
          </Flex>
        )}

        {/* Mobile Search Button */}
        {isMobile && (
          <IconButton
            aria-label="Search"
            icon={<FaSearch />}
            color="black"
            borderRadius="7px"
            _hover={{ backgroundColor: "#003366", color: "white" }}
          />
        )}

        {/* Desktop Links and Buttons */}
        {!isMobile && (
          <Flex align="center">
            {/* Dark Mode Toggle Button */}
            <IconButton
              aria-label="Toggle Dark Mode"
              icon={useColorModeValue(<FaMoon />, <FaSun />)} // Toggle between moon and sun icons
              onClick={toggleColorMode}
              bg="transparent"
              color={useColorModeValue("#003366", "white")}
              fontSize="xl"
              mr={4} // Adds some space before the next items
            />

            {/* Login Link */}
            <Box mr={4}>
              <Link
                textDecoration="none"
                color={loginColor} // Login text color based on theme
                href="/login"
              >
                Login
              </Link>
            </Box>

            {/* Join for Free Button */}
            <Button
              bg="#003366"
              color="white"
              borderRadius="5px"
              _hover={{ bg: buttonHoverColor }} // Button hover color based on theme
              onClick={signup}
            >
              Join for free
            </Button>
          </Flex>
        )}
      </Flex>

      {/* Drawer for Mobile */}
      <NavBarDrawer isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </Box>
  );
};

export default Navbar;
