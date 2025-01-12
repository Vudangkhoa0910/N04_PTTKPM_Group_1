import {
  Box,
  Button,
  Flex,
  Grid,
  IconButton,
  Input,
  Select,
  Text,
  Icon,
} from "@chakra-ui/react";
import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { BiMale } from "react-icons/bi";
import { FaVideo } from "react-icons/fa";
import { FiBook, FiFilm } from "react-icons/fi";
import { IoSearchCircleOutline } from "react-icons/io5";
import { AddIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";

const DashBoard = () => {
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Courses",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  const datapie = {
    labels: ["Full Stack", "Frontend", "Backend"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const datapie1 = {
    labels: ["Live", "Recorded", "Offline"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ["#4BC0C0", "#FF9F40", "#9966FF"],
        hoverBackgroundColor: ["#4BC0C0", "#FF9F40", "#9966FF"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  return (
    <Box bgGradient="linear(to-br, #f9f9f9, #e3f2fd)" minH="100vh" p={4}>
      <Grid className="Nav" w="100%" gap={10}>
        {/* Thanh tìm kiếm và hành động */}
        <Flex
          h="10vh"
          justifyContent="space-between"
          align="center"
          bg="white"
          p={3}
          borderRadius="lg"
          shadow="md"
          zIndex={1}
          position="sticky"
          top={0}
          mb={5}
          mt={20}
        >
          {/* Input tìm kiếm */}
          <Flex align="center" w="50%">
            <IoSearchCircleOutline
              style={{ fontSize: "4vh", color: "gray", marginRight: "8px" }}
            />
            <Input
              placeholder="Search Anything"
              border="1px solid"
              borderColor="gray.300"
              h="6vh"
              w="100%"
            />
          </Flex>
          {/* Select và nút thêm */}
          <Flex align="center" gap={3}>
            <Select placeholder="Sort by Price" w="200px">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </Select>
            <Link to="/admin/addCourse">
              <Button colorScheme="teal" leftIcon={<AddIcon />}>
                Add New Course
              </Button>
            </Link>
          </Flex>
        </Flex>

        {/* Nội dung Dashboard */}
        <Box>
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
                title: "Total Subscriber",
                count: "2344",
                percent: "+14%",
                icon: BiMale,
                bgColor: "#E3F2FD",
              },
              {
                title: "Total Videos",
                count: "5123",
                percent: "+60%",
                icon: FaVideo,
                bgColor: "#FFF3E0",
              },
              {
                title: "Total Courses",
                count: "1200",
                percent: "+5%",
                icon: FiBook,
                bgColor: "#E8F5E9",
              },
              {
                title: "Total WatchTime",
                count: "999+ hrs",
                percent: "+45%",
                icon: FiFilm,
                bgColor: "#FCE4EC",
              },
            ].map((item, index) => (
              <Box
                key={index}
                bg={item.bgColor}
                borderRadius="lg"
                p={5}
                boxShadow="xl"
              >
                <Flex justify="space-between" align="center">
                  <Text fontWeight="bold" fontSize="lg">
                    {item.title}
                  </Text>
                  <Icon as={item.icon} boxSize={8} color="gray.600" />
                </Flex>
                <Text fontSize="2xl" mt={4} color="blue.600">
                  {item.count}
                </Text>
                <Flex justify="space-between" align="center" mt={4}>
                  <Text color="green.500" fontWeight="bold">
                    {item.percent}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Since last month
                  </Text>
                </Flex>
              </Box>
            ))}
          </Grid>

          {/* Biểu đồ Bar */}
          <Box mt={10}>
            <Flex align="center" justify="center">
              <Box
                bg="white"
                borderRadius="lg"
                boxShadow="lg"
                p={6}
                w="100%"
                maxW="800px"
              >
                <Text fontSize="xl" fontWeight="bold" mb={4} color="blue.600">
                  Monthly Sales
                </Text>
                <Box height="300px">
                  <Bar data={data} options={{ maintainAspectRatio: false }} />
                </Box>
              </Box>
            </Flex>
          </Box>

          {/* Biểu đồ Pie */}
          <Grid
            mt={10}
            templateColumns={{
              xl: "repeat(2,1fr)",
              lg: "repeat(2,1fr)",
              base: "repeat(1,1fr)",
            }}
            gap={6}
          >
            {[datapie, datapie1].map((pieData, index) => (
              <Flex
                align="center"
                justify="center"
                key={index}
                p={4}
                bg="white"
                borderRadius="lg"
                boxShadow="lg"
              >
                <Box>
                  <Text fontSize="xl" fontWeight="bold" mb={4}>
                    {index === 0 ? "Courses" : "Videos Category"}
                  </Text>
                  <Box height="300px">
                    <Pie
                      data={pieData}
                      options={{ maintainAspectRatio: false }}
                    />
                  </Box>
                </Box>
              </Flex>
            ))}
          </Grid>
        </Box>
      </Grid>
    </Box>
  );
};

export default DashBoard;