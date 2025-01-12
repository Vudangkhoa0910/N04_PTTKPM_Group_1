import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  IconButton,
  Select,
  Text,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { IoSearchCircleOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import convertDateFormat, {
  deleteProduct,
  getProduct,
} from "../../Redux/AdminReducer/action";
import Pagination from "./Pagination";

const Courses = () => {
  const store = useSelector((store) => store.AdminReducer.data);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("");
  const limit = 4;
  const tableSize = useBreakpointValue({ base: "sm", sm: "md", md: "lg" });

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSelect = (e) => {
    const { value } = e.target;
    setOrder(value);
  };

  useEffect(() => {
    dispatch(getProduct(page, limit, search, order));
  }, [page, search, order, limit, dispatch]);

  const handleDelete = (id, title) => {
    dispatch(deleteProduct(id));
    alert(`${title} has been deleted successfully!`);
  };

  const handlePageButton = (val) => {
    setPage((prev) => prev + val);
  };

  const count = 4;

  return (
    <Grid
  h="100vh"
  templateRows="auto 1fr" // Row 1: Search, Row 2: Content
  gap={5}
  p={5}
  bg="gray.50"
>
  {/* Thanh tìm kiếm và hành động */}
  <Flex
    h="10vh"
    justifyContent="space-between"
    align="center"
    bg="white"
    p={3}
    borderRadius="lg"
    shadow="md"
    mb={5} // Thêm khoảng cách dưới thanh tìm kiếm
    zIndex={1} // Đảm bảo thanh tìm kiếm trên cùng
    position="sticky" // Giữ vị trí cố định
    top={0} // Chỉ định vị trí trên cùng
    mt="10vh"
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
      <Link to="/admin/addCourse">
        <Button colorScheme="teal" leftIcon={<AddIcon />}>
          Add New Course
        </Button>
      </Link>
    </Flex>
  </Flex>

  {/* Nội dung bảng */}
  <Box
    bg="white"
    p={5}
    borderRadius="lg"
    shadow="md"
    overflow="auto" // Thêm cuộn nếu cần
  >
    <Text fontSize="2xl" fontWeight="bold" color="teal.500" mb={5}>
      Welcome to Courses
    </Text>

    <Box overflowX="auto">
      <Table variant="striped" colorScheme="teal" size={tableSize}>
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
                  <Flex gap={2}>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleDelete(el._id, el.title)}
                    >
                      Delete
                    </Button>
                    <Link to={`/admin/edit/${el._id}`}>
                      <ButtonGroup size="sm" isAttached variant="outline">
                        <Button>Edit</Button>
                        <IconButton
                          aria-label="Edit"
                          icon={<EditIcon />}
                        />
                      </ButtonGroup>
                    </Link>
                  </Flex>
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
        handlePageChange={(page) => setPage(page)}
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

export default Courses;