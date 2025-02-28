import {
  Box,
  Button,
  Flex,
  Grid,
  Select,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "./Pagination";
import AdminNavTop from "../AdminNavTop";
import { getProduct } from "../../Redux/AdminReducer/action";
import convertDateFormat from "../../Redux/AdminReducer/action";

const Add = () => {
  const store = useSelector((store) => store.AdminReducer.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("");
  const limit = 4;

  // Responsive kích thước bảng
  const tableSize = useBreakpointValue({ base: "sm", sm: "md", md: "lg" });

  useEffect(() => {
    dispatch(getProduct(page, limit, search, order));
  }, [page, search, order, limit, dispatch]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSelect = (e) => {
    const { value } = e.target;
    setOrder(value);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handlePageButton = (val) => {
    setPage((prev) => prev + val);
  };

  const handleVideos = (id, title) => {
    navigate(`/admin/videos/add/${id}`, { state: { id, title } });
  };

  const count = 4; // Số trang tổng

  return (
    <Grid
      h="100vh"
      templateRows="auto 1fr"
      gap={5}
      p={5}
      bg="gray.50"
      mt="10vh" // Đẩy toàn bộ giao diện xuống dưới để nhường chỗ cho thanh bar trên cùng
    >
      {/* Thanh tìm kiếm và bộ lọc */}
      <Flex
        h="10vh"
        justifyContent="space-between"
        align="center"
        bg="white"
        p={3}
        borderRadius="lg"
        shadow="md"
      >
        {/* Input tìm kiếm */}
        <Flex align="center" w="50%">
          <Input
            placeholder="Search Courses"
            border="1px solid"
            borderColor="gray.300"
            h="8vh"
            w="100%"
            onChange={handleSearch}
          />
        </Flex>
        {/* Select và nút thêm */}
        <Flex align="center" gap={3}>
          <Select
            placeholder="Sort by Price"
            onChange={handleSelect}
            w="200px"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </Select>
          <Button
            colorScheme="teal"
            onClick={() => handleVideos(1, "New Video Title")} // Pass appropriate id and title here
          >
            Add New Video
          </Button>
        </Flex>
      </Flex>

      {/* Bảng dữ liệu */}
      <Box
        bg="white"
        p={5}
        borderRadius="lg"
        shadow="md"
        overflow="auto"
      >
        <Text fontSize="2xl" fontWeight="bold" color="teal.500" mb={5}>
          Add Video to Course
        </Text>

        <Box overflowX="auto">
          <Table
            variant="striped"
            colorScheme="teal"
            size={tableSize}
          >
            <Thead>
              <Tr>
                <Th>Course Name</Th>
                <Th>Date</Th>
                <Th>Category</Th>
                <Th>Description</Th>
                <Th>Price</Th>
                <Th>Teacher</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {store?.length > 0 &&
                store.map((el, i) => (
                  <Tr key={i}>
                    <Td>{el.title}</Td>
                    <Td>{convertDateFormat(el.createdAt)}</Td>
                    <Td>{el.category}</Td>
                    <Td>{el.description}</Td>
                    <Td>${el.price}</Td>
                    <Td>{el.teacher}</Td>
                    <Td>
                      <Button
                        colorScheme="blue"
                        size="sm"
                        onClick={() => handleVideos(el._id, el.title)}
                      >
                        Add Videos
                      </Button>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </Box>

        {/* Phân trang */}
        <Flex justify="space-between" align="center" mt={5}>
          <Button
            colorScheme="teal"
            onClick={() => handlePageButton(-1)}
            isDisabled={page <= 1}
          >
            Previous
          </Button>
          <Pagination
            totalCount={count}
            current_page={page}
            handlePageChange={handlePageChange}
          />
          <Button
            colorScheme="teal"
            onClick={() => handlePageButton(1)}
            isDisabled={page >= count}
          >
            Next
          </Button>
        </Flex>
      </Box>
    </Grid>
  );
};

export default Add;