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
} from "@chakra-ui/react";
import { FaSearch, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { NavBarDrawer } from "../components/NavBarDrawer";

const Navbar = () => {
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const navigate = useNavigate();

  function signup() {
    navigate("/signup");
  }

  function home() {
    navigate("/");
  }

  return (
    <Box>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        p={4}
        bg="#FF9900" // Background
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
            >
              <span style={{ color: "#003366" }}>Edu</span>
              <span style={{ color: "#FFFFFF" }}>PHENIKAA</span>
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
                color="#003366"
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
            {/* Login Link */}
            <Box mr={4}>
              <Link textDecoration="none" color="#003366" href="/login">
                Login
              </Link>
            </Box>

            {/* Join for Free Button */}
            <Button
              bg="#003366" 
              color="white"
              borderRadius="5px"
              _hover={{ bg: "#002147" }}
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