import React, { useEffect, useState } from "react";
import { Box, Button, Flex, Grid, Text, Switch } from "@chakra-ui/react";
import { FaVideo } from "react-icons/fa";
import { AddIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { Icon } from "@chakra-ui/react";

const BASE_URL = "http://localhost:5001"; // Your backend API URL

const DashBoard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [users, setUsers] = useState([]);
  const [videos, setVideos] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [sortOrder, setSortOrder] = useState("ASC");

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleSectionClick = (section) => {
    setSelectedSection((prev) => (prev === section ? null : section));
  };

  const sortArray = (array, field, order) => {
    return [...array].sort((a, b) => {
      if (order === "ASC") return a[field].localeCompare(b[field]);
      return b[field].localeCompare(a[field]);
    });
  };

  const handleSortUsers = (field, order) => {
    setUsers((prevUsers) => sortArray(prevUsers, field, order));
  };

  const handleSortVideos = (order) => {
    setVideos((prevVideos) => sortArray(prevVideos, "title", order));
  };

  const handleSortCourses = (order) => {
    setCourses((prevCourses) => sortArray(prevCourses, "title", order));
  };

  const handleSortRequests = (order) => {
    setInstructorRequests((prevRequests) => sortArray(prevRequests, "name", order));
    setSortOrder(order);
  };

  const [instructorRequests, setInstructorRequests] = useState([]);

// Fetch instructor requests
const fetchInstructorRequests = async () => {
  try {
    setIsLoading(true);

    const token = JSON.parse(localStorage.getItem("user"))?.token;
    
    if (!token) {
      console.error("Token is missing. Please login.");
      setIsError(true);
      return;
    }

    const response = await fetch(`${BASE_URL}/instructors/instructorrequests`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error(`Instructor API Error: ${response.statusText}`);

    const requestsData = await response.json();
    console.log("Fetched instructor requests data:", requestsData);
    setInstructorRequests(requestsData.requests || []);
    setIsLoading(false);
  } catch (error) {
    setIsError(true);
    setIsLoading(false);
    console.error("Error fetching instructor requests:", error);
  }
};

const handleApproveRequest = async (userId) => {
  try {
    const token = JSON.parse(localStorage.getItem("user"))?.token;
    if (!token) {
      alert("Token is missing. Please login.");
      return;
    }

    const response = await fetch(`${BASE_URL}/users/${userId}/promote`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error(`Error promoting user: ${response.statusText}`);

    alert("User promoted to teacher successfully!");
    await fetchInstructorRequests(); // Refresh the instructor requests
  } catch (error) {
    console.error("Error promoting user:", error);
    alert(`Failed to promote user: ${error.message}`);
  }
};

const handleRejectRequest = async (requestId) => {
  try {
    const token = JSON.parse(localStorage.getItem("user"))?.token;
    if (!token) {
      alert("Token is missing. Please login.");
      return;
    }

    const response = await fetch(`${BASE_URL}/instructors/instructorrequests/${requestId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error(`Error rejecting request: ${response.statusText}`);

    alert("Instructor request rejected successfully!");
    await fetchInstructorRequests(); // Refresh the instructor requests
  } catch (error) {
    console.error("Error rejecting request:", error);
    alert(`Failed to reject request: ${error.message}`);
  }
};


useEffect(() => {
  const fetchData = async () => {
    try {
      setIsLoading(true);

      const token = JSON.parse(localStorage.getItem("user"))?.token;
      if (!token) {
        console.error("Token is missing. Please login.");
        setIsError(true);
        return;
      }

      console.log("Fetching data with token:", token);

      const [userRes, videoRes, courseRes] = await Promise.all([
        fetch(`${BASE_URL}/users`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${BASE_URL}/videos`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${BASE_URL}/courses`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (!userRes.ok) throw new Error(`User API Error: ${userRes.statusText}`);
      if (!videoRes.ok) throw new Error(`Video API Error: ${videoRes.statusText}`);
      if (!courseRes.ok) throw new Error(`Course API Error: ${courseRes.statusText}`);

      const usersData = await userRes.json();
      const videosData = await videoRes.json();
      const coursesData = await courseRes.json();

      console.log("Fetched users data:", usersData);
      setUsers(usersData.users || []);
      setVideos(videosData || []);
      setCourses(coursesData.course || []);

      // Gọi fetchInstructorRequests để lấy dữ liệu yêu cầu
      await fetchInstructorRequests();

      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  fetchData();
}, []);

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error loading data!</Text>;

  return (
    <Box
      bg={isDarkMode ? "#1A202C" : "#f9f9f9"}
      minH="100vh"
      p={4}
      transition="background 0.3s ease-in-out"
    >
      <Grid className="Nav" w="100%" gap={10}>
        {/* Navbar */}
        <Flex
          h="10vh"
          justifyContent="space-between"
          align="center"
          bg={isDarkMode ? "#2D3748" : "white"}
          p={3}
          borderRadius="lg"
          shadow="md"
          zIndex={1}
          position="sticky"
          top={0}
          mb={5}
          mt={20}
        >
          <Flex gap={3}>
            <Button colorScheme="teal" onClick={() => handleSortCourses("ASC")}>
              Sort Courses ASC
            </Button>
            <Button colorScheme="teal" onClick={() => handleSortCourses("DES")}>
              Sort Courses DES
            </Button>
            <Button colorScheme="blue" onClick={() => handleSortVideos("ASC")}>
              Sort Videos ASC
            </Button>
            <Button colorScheme="blue" onClick={() => handleSortVideos("DES")}>
              Sort Videos DES
            </Button>
            <Button colorScheme="teal" onClick={() => handleSortRequests("ASC")}>
              Sort Instructor Requests ASC
            </Button>
            <Button colorScheme="teal" onClick={() => handleSortRequests("DES")}>
              Sort Instructor Requests DES
            </Button>
          </Flex>

          <Flex align="center" gap={3}>
            {/* <Link to="/admin/addCourse">
              <Button colorScheme="teal" leftIcon={<AddIcon />}>
                Add New Course
              </Button>
            </Link> */}
            <Flex align="center">
              <Text mr={2} color={isDarkMode ? "white" : "black"}>
                Dark Mode
              </Text>
              <Switch isChecked={isDarkMode} onChange={toggleDarkMode} />
            </Flex>
          </Flex>
        </Flex>

        {/* Stats Cards */}
        <Grid
          templateColumns={{
            xl: "repeat(4,1fr)",
            lg: "repeat(2,1fr)",
            base: "repeat(1,1fr)",
          }}
          gap={6}
        >
          {[
            {
              title: "Subscriber",
              count: users.length,
              percent: "+14%",
              icon: FaVideo,
              bgColor: "#2ABCB0",
              onClick: () => handleSectionClick("users"),
            },
            {
              title: "Videos",
              count: videos.length,
              percent: "+60%",
              icon: FaVideo,
              bgColor: "#F6E05E",
              onClick: () => handleSectionClick("videos"),
            },
            {
              title: "Courses",
              count: courses.length,
              percent: "+5%",
              icon: FaVideo,
              bgColor: "#48BB78",
              onClick: () => handleSectionClick("courses"),
            },
            {
              title: "Instructor Requests",
              count: instructorRequests.length,
              percent: "+45%",
              icon: FaVideo,
              bgColor: "#F56565",
              onClick: () => handleSectionClick("instructorRequests"),
            }            
          ].map((item, index) => (
            <Box
              key={index}
              bg={isDarkMode ? "#2D3748" : item.bgColor}
              borderRadius="lg"
              p={5}
              boxShadow="xl"
              transition="transform 0.3s ease"
              _hover={{ transform: "scale(1.05)" }}
              cursor={item.onClick ? "pointer" : "default"}
              onClick={item.onClick || null}
            >
              <Flex justify="space-between" align="center">
                <Text fontWeight="bold" fontSize="lg" color={isDarkMode ? "white" : "black"}>
                  {item.title}
                </Text>
                <Icon as={item.icon} boxSize={8} color={isDarkMode ? "white" : "gray.600"} />
              </Flex>
              <Text fontSize="2xl" mt={4} color={isDarkMode ? "teal.200" : "blue.600"}>
                {item.count}
              </Text>
              <Flex justify="space-between" align="center" mt={4}>
                <Text color="green.500" fontWeight="bold">
                  {item.percent}
                </Text>
                <Text fontSize="sm" color={isDarkMode ? "gray.400" : "gray.500"}>
                  Since last month
                </Text>
              </Flex>
            </Box>
          ))}
        </Grid>

        {/* Detail Lists */}
        {selectedSection === "users" && (
          <Box mt={5}>
            <Text fontSize="2xl" fontWeight="bold" mb={3}>
              Users List
            </Text>
            <Flex gap={3} mb={5}>
              <Button colorScheme="teal" onClick={() => handleSortUsers("name", "ASC")}>
                Sort by Name ASC
              </Button>
              <Button colorScheme="teal" onClick={() => handleSortUsers("name", "DES")}>
                Sort by Name DES
              </Button>
              <Button colorScheme="purple" onClick={() => handleSortUsers("role", "ASC")}>
                Sort by Role ASC
              </Button>
              <Button colorScheme="purple" onClick={() => handleSortUsers("role", "DES")}>
                Sort by Role DES
              </Button>
            </Flex>
            {users.map((user, index) => (
              <Box
                key={user._id}
                p={4}
                mb={3}
                borderWidth="1px"
                borderRadius="md"
                bg={isDarkMode ? "#2D3748" : "white"}
                color={isDarkMode ? "white" : "black"}
              >
                <Text fontWeight="bold">
                  {index + 1}. {user.name}
                </Text>
                <Text>Email: {user.email}</Text>
                <Text>Role: {user.role}</Text>
              </Box>
            ))}
          </Box>
        )}
        {selectedSection === "videos" && (
          <Box mt={5}>
            <Text fontSize="2xl" fontWeight="bold" mb={3}>
              Videos List
            </Text>
            {videos.map((video, index) => (
              <Box
                key={video._id}
                p={4}
                mb={3}
                borderWidth="1px"
                borderRadius="md"
                bg={isDarkMode ? "#2D3748" : "white"}
                color={isDarkMode ? "white" : "black"}
              >
                <Text fontWeight="bold">{index + 1}. {video.title}</Text>
                <Text>{video.description}</Text>
              </Box>
            ))}
          </Box>
        )}
        {selectedSection === "courses" && (
          <Box mt={5}>
            <Text fontSize="2xl" fontWeight="bold" mb={3}>
              Courses List
            </Text>
            {courses.map((course, index) => (
              <Box
                key={course._id}
                p={4}
                mb={3}
                borderWidth="1px"
                borderRadius="md"
                bg={isDarkMode ? "#2D3748" : "white"}
                color={isDarkMode ? "white" : "black"}
              >
                <Text fontWeight="bold">{index + 1}. {course.title}</Text>
                <Text>{course.description}</Text>
                <Text>Category: {course.category}</Text>
                <Text>Price: ${course.price}</Text>
              </Box>
            ))}
          </Box>
        )}

{selectedSection === "instructorRequests" && (
  <Box mt={5}>
    <Text fontSize="2xl" fontWeight="bold" mb={3}>
      Instructor Requests
    </Text>
    {instructorRequests.length > 0 ? (
      instructorRequests.map((request, index) => (
        <Box
          key={request._id}
          p={4}
          mb={3}
          borderWidth="1px"
          borderRadius="md"
          bg={isDarkMode ? "#2D3748" : "white"}
          color={isDarkMode ? "white" : "black"}
        >
          <Text fontWeight="bold">
            {index + 1}. {request.name}
          </Text>
          <Text>Age: {request.age}</Text>
          <Text>Profession: {request.profession}</Text>
          <Text>Field: {request.field}</Text>
          <Text>Experience: {request.experience}</Text>
          <Text>Description: {request.description}</Text>
          <Text>
            CV:{" "}
            <a href={request.cv} target="_blank" rel="noopener noreferrer" style={{ color: "blue" }}>
              View CV
            </a>
          </Text>
          <Flex gap={3} mt={3}>
            <Button
              colorScheme="green"
              onClick={() => handleApproveRequest(request.userId)}
            >
              Approve
            </Button>
            <Button
              colorScheme="red"
              onClick={() => handleRejectRequest(request._id)}
            >
              Reject
            </Button>
          </Flex>
        </Box>
      ))
    ) : (
      <Text>No instructor requests found.</Text>
    )}
  </Box>
)}

      </Grid>
    </Box>
  );
};

export default DashBoard;
