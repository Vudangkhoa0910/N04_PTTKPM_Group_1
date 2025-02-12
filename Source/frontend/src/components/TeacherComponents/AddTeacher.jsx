import {
  Box,
  Button,
  Grid,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import convertDateFormat, { getProduct } from "../../Redux/TeacherReducer/action"; // Changed import to getProduct
import Pagination from "../Adminitems/Pagination";

const AddTeacher = () => {
  const store = useSelector((store) => store.TeacherReducer.data);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("");
  const limit = 4;
  const tableSize = useBreakpointValue({ base: "sm", sm: "md", md: "lg" });
  const courseSize = useBreakpointValue({ base: "md", sm: "lg", md: "xl" });
  const [loadingCourses, setLoadingCourses] = useState(false); // Added loading state

  const handleSelect = (e) => {
    const { value } = e.target;
    setOrder(value);
  };

  // Get User ID from localStorage - Consistent with working TeacherCourses
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData ? userData.userId : null;

  useEffect(() => {
    if (userId) {
      setLoadingCourses(true); // Set loading to true before fetching
      dispatch(getProduct(page, limit, search, order, userId)) // Changed to getProduct
        .finally(() => setLoadingCourses(false)); // Set loading to false after fetch
    }
  }, [dispatch, page, search, order, userId]); // Using getProduct, userId from localStorage

  useEffect(() => {
    console.log("Fetched courses from Redux:", store); // Debugging log
  }, [store]);

  const navigate = useNavigate();

  const handleVideos = (id, title) => {
    navigate(`/Teacher/videos/add/${id}`, { state: { id, title } });
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handlePageButton = (val) => {
    setPage((prev) => prev + val);
  };

  const count = 4; //  Need to update 'count' dynamically from API response for proper pagination

  // Removed frontend filtering as backend should handle filtering based on userId
  // const filteredCourses = store?.filter( ... ) || [];  // No longer needed

  return (
    <Grid className="Nav" h="100vh" w="100%" placeItems="center" bg="gray.50" px={4}>
      <Box w="100%" maxW="1200px" mt="90px">
        <VStack spacing={6} align="stretch">
          <Box
            p={4}
            borderRadius="md"
            bg="white"
            boxShadow="lg"
            mb={2}
            textAlign="center"
          >
            <Text fontSize="2xl" fontWeight="bold" color="blue.500">
              Manage Teacher Video
            </Text>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={4}
            bg="white"
            borderRadius="lg"
            boxShadow="md"
          >
            <Select
              w="auto"
              minW="300px"
              placeholder="Sort by Price"
              onChange={handleSelect}
              focusBorderColor="blue.500"
            >
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </Select>
            <Link to="/Teacher/addCourse">
              <Button colorScheme="blue" size="md">
                Create New Course
              </Button>
            </Link>
          </Box>

          <Box
            w="100%"
            overflowX="auto"
            bg="white"
            p={5}
            borderRadius="lg"
            boxShadow="lg"
          >
            <Table
              variant="simple"
              borderRadius="md"
              w="100%"
              size={tableSize}
            >
              <Thead>
                <Tr>
                  <Th>Title</Th>
                  <Th>Date</Th>
                  <Th>Category</Th>
                  <Th>Description</Th>
                  <Th>Price</Th>
                  <Th>Teacher</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {loadingCourses ? ( // Display loading state
                  <Tr>
                    <Td colSpan="7" textAlign="center">Loading courses...</Td>
                  </Tr>
                ) : store?.length > 0 ? ( // Render from store directly, assuming backend filtering
                  store.map((el, i) => (
                    <Tr key={i}>
                      <Td>{el.title || "N/A"}</Td>
                      <Td>{convertDateFormat(el.createdAt) || "N/A"}</Td>
                      <Td>{el.category || "N/A"}</Td>
                      <Td>{el.description || "N/A"}</Td>
                      <Td>{el.price || "N/A"}</Td>
                      <Td>{el.teacher || "N/A"}</Td>
                      <Td>
                        <Button
                          onClick={() => handleVideos(el._id, el.title)}
                          colorScheme="green"
                          size="sm"
                        >
                          Add Videos
                        </Button>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan="7" textAlign="center">
                      No data available
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={4}
            mt={4}
          >
            <Button
              size="sm"
              colorScheme="blue"
              isDisabled={page <= 1}
              onClick={() => handlePageButton(-1)}
            >
              Prev
            </Button>
            <Pagination
              totalCount={count} // You'll need to update 'count' dynamically from API response
              current_page={page}
              handlePageChange={handlePageChange}
            />
            <Button
              size="sm"
              colorScheme="blue"
              isDisabled={page >= count} // You'll need to update 'count' dynamically from API response
              onClick={() => handlePageButton(1)}
            >
              Next
            </Button>
          </Box>
        </VStack>
      </Box>
    </Grid>
  );
};

export default AddTeacher;