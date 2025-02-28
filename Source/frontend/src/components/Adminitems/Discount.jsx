import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Image,
  Text,
  Button,
  Flex,
  Input,
  useToast,
  Heading,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Spinner,
  Card,
  CardBody,
  CardFooter,
  Stack,
  Divider,
  ButtonGroup,
  useColorModeValue,
  Tooltip,
  Container // Import Container
} from "@chakra-ui/react";
import AdminNavTop from "../AdminNavTop";
import axios from 'axios';
import { FaTags, FaSync, FaTrash, FaCheckCircle } from 'react-icons/fa';

const BASE_URL = "http://localhost:5001";

const Discount = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [discountValues, setDiscountValues] = useState({});
  const [isApplying, setIsApplying] = useState(false); // Track applying state
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.300');

  // Fetch all courses when component mounts
  useEffect(() => {
    fetchCourses();
  }, []);

  // Initialize discount values after courses are loaded
  useEffect(() => {
    const initialValues = {};
    courses.forEach(course => {
      initialValues[course._id] = course.discount || 0;
    });
    setDiscountValues(initialValues);
  }, [courses]);

  // Fetch all courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const response = await axios.get(`${BASE_URL}/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.course) {
        setCourses(response.data.course);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast({
        title: "Error",
        description: "Failed to fetch courses",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle discount value change
  const handleDiscountChange = (courseId, value) => {
    setDiscountValues({
      ...discountValues,
      [courseId]: value
    });
  };

  // Update discount for a course
  const handleDiscountUpdate = async (courseId) => {
    const discountValue = discountValues[courseId];
    setIsApplying(true); // Set applying state to true

    // Show success message
    toast({
      title: "Success",
      description: "Applying discount...",
      status: "success",
      duration: 3000, // Set duration for 3 seconds
      isClosable: true,
      icon: <FaCheckCircle color="green" />,
    });

    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const response = await axios.patch(
        `${BASE_URL}/courses/update/${courseId}`,
        { discount: discountValue },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        // Update local state
        setCourses(courses.map(course =>
          course._id === courseId ? { ...course, discount: discountValue } : course
        ));
      }

    } catch (error) {
      console.error("Error updating discount:", error);
      toast({
        title: "Error",
        description: "Failed to apply discount",
        status: "error",
        duration: 3000, // Duration for error message
        isClosable: true,
      });
    } finally {
        setIsApplying(false);
      window.location.reload();
    }
  };

  // Remove discount and auto-reload data
  const handleRemoveDiscount = async (courseId) => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const response = await axios.patch(
        `${BASE_URL}/courses/update/${courseId}`,
        { discount: 0 },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        // Update local state immediately
        setCourses(prevCourses => prevCourses.map(course =>
          course._id === courseId ? { ...course, discount: 0 } : course
        ));

        // Reset the discount value in the state
        setDiscountValues(prev => ({
          ...prev,
          [courseId]: 0
        }));

        // Show success message
        toast({
          title: "Success",
          description: "Discount removed successfully",
          status: "success",
          duration: 3000, // Set duration for 3 seconds
          isClosable: true,
          icon: <FaCheckCircle color="green" />,
        });

        // Reload all courses data
        fetchCourses().catch(err => {
          console.error("Error reloading courses after discount removal:", err);
        });
      }
    } catch (error) {
      console.error("Error removing discount:", error);
      toast({
        title: "Error",
        description: "Failed to remove discount",
        status: "error",
        duration: 3000, //Duration for error message
        isClosable: true,
      });
    } finally {
        setIsApplying(false);
      window.location.reload(); // Reload the page
    }
  };

  // Filter courses based on search term
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container maxW="container.xl" p={0}> {/* Use Container for full width */}
      <Box h={"auto"} minH="100vh" mt='120px' pb={8} px={6}> {/* Adjust padding inside Box */}
        {/* Search and header */}
        <Flex justify="space-between" align="center" mb={6} flexWrap="wrap" gap={2}>
          <Heading size="xl" color={textColor} display="flex" alignItems="center" gap={2}>
               Course Discounts
          </Heading>
          <Flex gap={4} align="center">
            <Input
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              bg="white"
              color={textColor}
              _placeholder={{ color: 'gray.500' }}
              border="1px solid"
              borderColor="gray.200"
              _focus={{ borderColor: 'blue.500' }}
              borderRadius="md"
              paddingInlineStart={4}
              paddingInlineEnd={4}
              height="40px"
              width="300px"
            />
            <Tooltip label="Refresh Data" placement="bottom">
              <Button
                colorScheme="blue"
                onClick={fetchCourses}
                isLoading={loading}
                leftIcon={<FaSync />}
                height="40px"
                width="150px"
              >
                Refresh
              </Button>
            </Tooltip>
          </Flex>
        </Flex>

        {loading ? (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="xl" color="blue.500" />
          </Flex>
        ) : (
          <>
            {/* Courses grid */}
            <Grid
              templateColumns={{
                xl: "repeat(3,1fr)",
                lg: "repeat(2,1fr)",
                base: "repeat(1,1fr)",
              }}
              gap={8}
            >
              {filteredCourses.map((course) => (
                <Card
                  key={course._id}
                  maxW="md"
                  bg={cardBg}
                  boxShadow="md"
                  borderRadius="lg"
                  overflow="hidden"
                  transition="transform 0.3s"
                  _hover={{ transform: "translateY(-5px)" }}
                  color={textColor}
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <Image
                    src={course.img || "https://via.placeholder.com/300x150?text=No+Image"}
                    alt={course.title}
                    height="200px" // Increased height
                    width="100%"
                    objectFit="cover"
                  />

                  <CardBody>
                    <Stack spacing="3">
                      <Heading size="md" fontWeight="semibold">
                        {course.title}
                      </Heading>
                      <Text fontSize="sm" noOfLines={2}>
                        {course.description}
                      </Text>
                      <Divider />
                      <Flex justify="space-between" align="center">
                        <Text fontSize="sm" fontWeight="medium">
                          Original Price: <Text as="span" fontWeight="bold">${course.price}</Text>
                        </Text>

                        {course.discount > 0 && (
                          <Text fontSize="sm" fontWeight="bold" color="green.500">
                            Discounted: ${(course.price - (course.price * course.discount / 100)).toFixed(2)}
                          </Text>
                        )}
                      </Flex>
                    </Stack>
                  </CardBody>
                  <CardFooter>
                    <FormControl>
                      <FormLabel fontSize="sm">Discount Percentage (%)</FormLabel>
                      <Flex direction="column" gap={2}>
                        <NumberInput
                          min={0}
                          max={100}
                          value={discountValues[course._id] || 0}
                          onChange={(valueString) => {
                            const value = parseInt(valueString);
                            handleDiscountChange(course._id, value);
                          }}
                          flex="1"
                          size="sm"
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>

                        <ButtonGroup spacing="2">
                          <Button
                            colorScheme="blue"
                            size="sm"
                            onClick={() => handleDiscountUpdate(course._id)}
                            isDisabled={discountValues[course._id] === course.discount || isApplying} // Disable during applying
                            isLoading={isApplying} // Show loading state
                          >
                            Apply
                          </Button>
                          {course.discount > 0 && (
                            <Button
                              colorScheme="red"
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveDiscount(course._id)}
                              leftIcon={<FaTrash />}
                            >
                              Remove
                            </Button>
                          )}
                        </ButtonGroup>
                      </Flex>
                    </FormControl>
                  </CardFooter>
                </Card>
              ))}
            </Grid>

            {filteredCourses.length === 0 && (
              <Box textAlign="center" py={10}>
                <Text fontSize="lg" color="gray.500">
                  No courses found. Try a different search term.
                </Text>
              </Box>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default Discount;