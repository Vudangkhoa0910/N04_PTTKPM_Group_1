// import React from 'react';
// import { Box, Flex, Grid, Icon, Text } from "@chakra-ui/react";
// import TeacherNavTop from "./TeacherNavTop";

// const TeacherDashboard = () => {
//   // Dummy data for courses and enrolled users
//   const courses = [
//     { id: 1, title: "Course A", enrolledUsers: 20 },
//     { id: 2, title: "Course B", enrolledUsers: 15 },
//     { id: 3, title: "Course C", enrolledUsers: 30 },
//   ];

//   return (
//     <Box>
//       <Grid className="Nav" h={"99vh"} w="94%" gap={10}>
//         <Box>
//           {/* <TeacherNavbar /> */}
//         </Box>
//         <Box mt='80px'>
//           <TeacherNavTop />
//           <Box h={"3000vh"} p={5}>
//             <Grid
//               templateColumns={{
//                 xl: "repeat(4,1fr)",
//                 lg: "repeat(2,1fr)",
//                 base: "repeat(1,50vh)",
//               }}
//               gap={10}
//               boxShadow="xl"
//               rounded="md"
//             >
//               {/* Courses created by teacher */}
//               {courses.map(course => (
//                 <Box key={course.id} border={"2px solid gray"} borderRadius={10} p={5}>
//                   <Text fontWeight={"bold"}>{course.title}</Text>
//                   <Flex mt={15} justify={"space-between"}>
//                     <Text>Enrolled Users: {course.enrolledUsers}</Text>
//                   </Flex>
//                 </Box>
//               ))}
//             </Grid>

//             {/* Bar graph */}
//             {/* Your existing Bar graph code */}

//             {/* Pie graph */}
//             {/* Your existing Pie graph code */}
//           </Box>
//         </Box>
//       </Grid>
//     </Box>
//   );
// }

// export default TeacherDashboard;

import React from "react";
import { Box, Grid, Text } from "@chakra-ui/react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import TeacherNavTop from "./TeacherNavTop";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement
);

const generateFakeData = (count) => {
  const data = [];
  for (let i = 1; i <= count; i++) {
    data.push({
      id: i,
      title: `Course ${String.fromCharCode(64 + i)}`,
      enrolledUsers: Math.floor(Math.random() * 91) + 10,
    });
  }
  return data;
};

const TeacherDashboard = () => {
  const courses = generateFakeData(8);

  // Dữ liệu cho Bar Chart
  const barChartData = {
    labels: courses.map((course) => course.title),
    datasets: [
      {
        label: "Enrolled Users",
        data: courses.map((course) => course.enrolledUsers),
        backgroundColor: courses.map(
          () => `hsl(${Math.random() * 360}, 60%, 70%)`
        ),
        borderColor: courses.map(() => `hsl(${Math.random() * 360}, 50%, 50%)`),
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: courses.map((course) => course.title),
    datasets: [
      {
        label: "Enrolled Users",
        data: courses.map((course) => course.enrolledUsers),
        backgroundColor: courses.map(
          () => `hsl(${Math.random() * 360}, 60%, 70%)`
        ), // Màu sáng pastel
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <Box>
      {/* Đẩy TeacherNavTop xuống và làm nổi bật */}
      <Box
        position="fixed"
        top="0"
        w="100%"
        zIndex="20"
        bg="white"
        px={10}
        boxShadow="lg"
      >
        <TeacherNavTop />
      </Box>

      <Box p={5} mt="80px">
        {" "}
        {/* Thêm mt để đẩy phần bên dưới tránh bị che khuất */}
        {/* Danh sách các khóa học */}
        <Grid
          templateColumns={{
            xl: "repeat(4,1fr)",
            lg: "repeat(2,1fr)",
            base: "repeat(1,1fr)",
          }}
          gap={10}
          boxShadow="xl"
          rounded="md"
        >
          {courses.map((course) => (
            <Box
              key={course.id}
              border={"2px solid gray"}
              borderRadius={10}
              p={5}
            >
              <Text fontWeight={"bold"}>{course.title}</Text>
              <Text mt={3}>Enrolled Users: {course.enrolledUsers}</Text>
            </Box>
          ))}
        </Grid>
        {/* Biểu đồ */}
        <Grid
          templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
          gap={5}
          mt={10}
        >
          {/* Bar Chart */}
          <Box h="300px">
            <Text fontSize="2xl" mb={3} textAlign="center">
              Bar Chart: Enrolled Users per Course
            </Text>
            <Box h="250px">
              <Bar data={barChartData} options={chartOptions} />
            </Box>
          </Box>

          {/* Pie Chart */}
          <Box h="300px">
            <Text fontSize="2xl" mb={3} textAlign="center">
              Pie Chart: Percentage of Enrolled Users
            </Text>
            <Box h="250px">
              <Pie data={pieChartData} options={chartOptions} />
            </Box>
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};

export default TeacherDashboard;
