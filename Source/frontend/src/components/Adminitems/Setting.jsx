import {
  Box,
  Button,
  Flex,
  FormLabel,
  Grid,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../../Redux/UserReducer/action";

const Setting = () => {
  const store = useSelector((store) => store.AdminReducer.data);
  const userStore = useSelector((store) => store.UserReducer);
  const name = capitalizeFirstLetter(userStore.name);
  const password = "Hello_Password";

  return (
    <Grid
      className="Nav"
      h="99vh"
      w="100%"
      gap={10}
      bg="gray.50"
      p={5}
      borderRadius="lg"
    >
      <Box mt="80px">
        {/* Page Heading */}
        <Heading fontSize="2xl" textAlign="center" mb={6} color="blue.600">
          Account Settings
        </Heading>

        <Box mt={5}>
          {/* Profile Information Section */}
          <Flex
            justify="space-between"
            flexDirection={{ xl: "row", lg: "row", base: "column" }}
            p={5}
            gap={5}
            bg="white"
            borderRadius="lg"
            boxShadow="md"
            border="1px solid"
            borderColor="gray.200"
          >
            <Box>
              <Heading size="md" mb={3} color="gray.700">
                Profile Information
              </Heading>
              <Text color="gray.600">
                Update your profile information and secure your account.
              </Text>
            </Box>
            <Box
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              w={{ xl: "60%", base: "100%" }}
              p={5}
              bg="gray.50"
              boxShadow="sm"
            >
              <FormLabel fontSize="sm" color="gray.700">
                Name
              </FormLabel>
              <Input
                placeholder="Enter Name"
                value={name}
                size="md"
                focusBorderColor="blue.400"
              />
              <Button mt={5} colorScheme="blue" isDisabled>
                Save
              </Button>
            </Box>
          </Flex>

          {/* Password Update Section */}
          <Flex
            justify="space-between"
            flexDirection={{ xl: "row", lg: "row", base: "column" }}
            p={5}
            gap={5}
            mt={10}
            bg="white"
            borderRadius="lg"
            boxShadow="md"
            border="1px solid"
            borderColor="gray.200"
          >
            <Box>
              <Heading size="md" mb={3} color="gray.700">
                Update Password
              </Heading>
              <Text color="gray.600">
                Ensure your account uses a strong and secure password.
              </Text>
            </Box>
            <Box
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              w={{ xl: "60%", base: "100%" }}
              p={5}
              bg="gray.50"
              boxShadow="sm"
            >
              <FormLabel fontSize="sm" color="gray.700">
                Current Password
              </FormLabel>
              <Input
                placeholder="Enter Current Password"
                type="password"
                value={password}
                size="md"
                focusBorderColor="blue.400"
              />
              <FormLabel fontSize="sm" color="gray.700" mt={4}>
                New Password
              </FormLabel>
              <Input
                placeholder="Enter New Password"
                type="password"
                size="md"
                focusBorderColor="blue.400"
              />
              <FormLabel fontSize="sm" color="gray.700" mt={4}>
                Confirm Password
              </FormLabel>
              <Input
                placeholder="Confirm New Password"
                type="password"
                size="md"
                focusBorderColor="blue.400"
              />
              <Button mt={5} colorScheme="blue">
                Save
              </Button>
            </Box>
          </Flex>
        </Box>
      </Box>
    </Grid>
  );
};

export default Setting;