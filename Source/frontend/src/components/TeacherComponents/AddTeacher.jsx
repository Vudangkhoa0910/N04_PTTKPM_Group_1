import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Select,
  Text,
  useBreakpointValue,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Stack,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import convertDateFormat, {
  getProduct,
} from "../../Redux/TeacherReducer/action";
import Pagination from "../Adminitems/Pagination";
import TeacherNavTop from "./TeacherNavTop";

const AddTeacher = () => {
  const store = useSelector((store) => store.TeacherReducer.data);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("");
  const limit = 4;

  const cardSize = useBreakpointValue({ base: "sm", md: "md" });

  useEffect(() => {
    dispatch(getProduct(page, limit, search, order));
  }, [page, search, order]);

  const navigate = useNavigate();

  const handleSearch = (e) => setSearch(e.target.value);

  const handleSelect = (e) => setOrder(e.target.value);

  const handleVideos = (id, title) => {
    navigate(`/Teacher/videos/add/${id}`, { state: { id, title } });
  };

  const handlePageChange = (page) => setPage(page);

  const handlePageButton = (val) => setPage((prev) => prev + val);

  return (
    <Box w="100%" minH="100vh" bg="gray.50">
      {/* TeacherNavTop with fixed position */}
      <Box position="fixed" top="0" w="100%" zIndex="20" bg="white" px={10}>
        <TeacherNavTop handleSearch={handleSearch} />
      </Box>

      {/* Header Section */}
      <Flex
        justify="space-between"
        align="center"
        bg="purple.500"
        color="white"
        p={5}
        borderRadius="md"
        mb={5}
        position="sticky"
        top="0"
        mt="20"
        zIndex="10" // Lower zIndex than TeacherNavTop to ensure it stays under
      >
        <Heading size="lg">Welcome to Courses</Heading>
        <Link to="/Teacher/addCourse">
          <Button colorScheme="teal" size="md">
            Create New Course
          </Button>
        </Link>
      </Flex>

      {/* Filter Section */}
      <Flex justify="space-between" align="center" mb={5}>
        <Text fontSize="lg" fontWeight="bold">
          Available Courses
        </Text>
        <Select w="200px" onChange={handleSelect} placeholder="Sort by Price">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </Select>
      </Flex>

      {/* Scrollable Content Section */}
      <Box
        w="100%"
        h="calc(100vh - 200px)" // Adjust height for scrollable area
        overflowY="auto"
        p={5}
        mt={20} // Add margin top to avoid overlap with TeacherNavTop
      >
        {/* Course Cards */}
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            xl: "repeat(3, 1fr)",
          }}
          gap={6}
        >
          {store && store.length > 0 ? (
            store.map((el, i) => {
              if (el && el.title) {
                return (
                  <Card key={i} borderRadius="lg" shadow="md" overflow="hidden">
                    <CardBody>
                      <Stack spacing={3}>
                        <Heading size="md">{el.title}</Heading>
                        <Text>Date: {convertDateFormat(el.createdAt)}</Text>
                        <Text>Category: {el.category}</Text>
                        <Text>Description: {el.description}</Text>
                        <Text>Price: ${el.price}</Text>
                        <Text>Teacher: {el.teacher}</Text>
                      </Stack>
                    </CardBody>
                    <CardFooter>
                      <Button
                        colorScheme="purple"
                        variant="outline"
                        size="sm"
                        onClick={() => handleVideos(el._id, el.title)}
                      >
                        Add Videos
                      </Button>
                    </CardFooter>
                  </Card>
                );
              } else {
                return null; // If `el` or `el.title` is falsy, return nothing
              }
            })
          ) : (
            <Text>No courses available.</Text>
          )}
        </Grid>

        {/* Pagination Section */}
        <Flex justify="center" align="center" mt={10}>
          <Button
            disabled={page <= 1}
            onClick={() => handlePageButton(-1)}
            mr={2}
          >
            Prev
          </Button>
          <Pagination
            totalCount={4}
            current_page={page}
            handlePageChange={handlePageChange}
          />
          <Button
            disabled={page >= 4}
            onClick={() => handlePageButton(1)}
            ml={2}
          >
            Next
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default AddTeacher;
