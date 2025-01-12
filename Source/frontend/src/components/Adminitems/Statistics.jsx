import { Box, Flex, Grid, Text, useBreakpointValue } from "@chakra-ui/react";
import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";

const Statistics = () => {
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Subscriber",
        data: [100, 200, 150, 250, 300, 200],
        fill: false,
        borderColor: "blue",
      },
    ],
  };

  const datapie1 = {
    labels: ["Full Stack", "Frontend", "Backend"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const databar = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Courses",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: "#f038d7",
        borderColor: "teal",
        borderWidth: 1,
      },
    ],
  };

  return (
    <Grid className="Nav" h={"99vh"} w="100%" gap={10}>
      <Box mt="80px">
        {/* Header Section */}
        <Flex
          align="center"
          justify="space-between"
          p={4}
          bg="white"
          borderRadius="md"
          boxShadow="md"
          mb={6}
          mr={6}
          ml={6}
        >
          <Text fontSize="2xl" fontWeight="bold" color="teal.600">
            Statistics Dashboard
          </Text>
        </Flex>

        {/* Statistics Grids */}
        <Grid
          templateColumns={{
            xl: "repeat(2, 1fr)",
            lg: "repeat(2, 1fr)",
            base: "repeat(1, 1fr)",
          }}
          gap={6}
        >
          {/* Total Customer Interaction */}
          <Box
            p={6}
            bg="white"
            boxShadow="lg"
            borderRadius="md"
            borderWidth={1}
            borderColor="gray.200"
            mr={6}
            ml={6}
          >
            <Text fontSize="xl" fontWeight="bold" mb={4} color="teal.600">
              Total Customer Interaction
            </Text>
            <Box height="300px" p={4} bg="gray.50" borderRadius="md">
              <Line data={data} />
            </Box>
          </Box>

          {/* Courses Distribution Pie Chart */}
          <Box
            p={6}
            bg="white"
            boxShadow="lg"
            borderRadius="md"
            borderWidth={1}
            borderColor="gray.200"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            mr={6}
            ml={6}
          >
            <Text fontSize="xl" fontWeight="bold" mb={4} color="teal.600">
              Courses Distribution
            </Text>
            <Box height="300px" width="100%" bg="gray.50" borderRadius="md">
              <Pie data={datapie1} options={{ maintainAspectRatio: false }} />
            </Box>
          </Box>
        </Grid>

        {/* Monthly Sales Bar Chart */}
        <Box
          mt={8}
          p={6}
          bg="white"
          boxShadow="lg"
          borderRadius="md"
          borderWidth={1}
          borderColor="gray.200"
          display="flex"
          flexDirection="column"
          alignItems="center"
          mr={6}
          ml={6}
        >
          <Text fontSize="xl" fontWeight="bold" mb={4} color="teal.600">
            Monthly Sales
          </Text>
          <Box height="300px" width="100%" bg="gray.50" borderRadius="md">
            <Bar data={databar} options={{ maintainAspectRatio: false }} />
          </Box>
        </Box>
      </Box>
    </Grid>
  );
};

export default Statistics;