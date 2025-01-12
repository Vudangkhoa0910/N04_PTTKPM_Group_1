import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  IconButton,
  Text,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AddIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "./Pagination";
import AdminNavTop from "../AdminNavTop";
import convertDateFormat, { deleteProduct, getvideo } from "../../Redux/AdminReducer/action";

const GetVideos = () => {
  const store = useSelector((store) => store.AdminReducer.videos);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("");
  const limit = 4;

  const tableSize = useBreakpointValue({ base: "sm", sm: "md", md: "lg" });

  const user = JSON.parse(localStorage.getItem("user"));

  const hasFetched = useRef(false); // Ref to ensure dispatch happens only once

  useEffect(() => {
    if (!hasFetched.current) {
      dispatch(getvideo(page, limit, user));
      hasFetched.current = true;
    }
  }, [page, limit, user, dispatch]);

  const handleDelete = (id, title) => {
    dispatch(deleteProduct(id));
    alert(`${title} is Deleted`);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handlePageButton = (val) => {
    setPage((prev) => prev + val);
  };

  const count = Math.ceil(store.length / limit);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    // Apply search functionality here (if supported)
  };

  const handleSelect = (e) => {
    const { value } = e.target;
    setOrder(value);
    // Apply sorting functionality here (if supported)
  };

  return (
    <Grid
      h="100vh"
      templateRows="auto 1fr"
      gap={5}
      p={5}
      bg="gray.50"
      mt="10vh" // Đẩy giao diện xuống để nhường chỗ cho thanh bar trên
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
            placeholder="Search Videos"
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
            placeholder="Sort by Views"
            onChange={handleSelect}
            w="200px"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </Select>
          <Link to="/admin/videos/add/new">
            <Button colorScheme="teal">Add New Video</Button>
          </Link>
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
          Video List
        </Text>

        <Box overflowX="auto">
          <Table
            variant="striped"
            colorScheme="teal"
            size={tableSize}
          >
            <Thead>
              <Tr>
                <Th>Title</Th>
                <Th>Uploaded</Th>
                <Th>Description</Th>
                <Th>Views</Th>
                <Th>Link</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {store?.length > 0 &&
                store.map((el, i) => (
                  <Tr key={i}>
                    <Td>{el.title}</Td>
                    <Td>{convertDateFormat(el.createdAt)}</Td>
                    <Td>{el.description}</Td>
                    <Td>{el.views}</Td>
                    <Td>
                      <a href={el.link} target="_blank" rel="noopener noreferrer">
                        View Link
                      </a>
                    </Td>
                    <Td>
                      <Flex gap={2}>
                        <ButtonGroup size="sm" isAttached variant="outline">
                          <Link to={`/admin/videos/edit/${el._id}`}>
                            <Button colorScheme="blue">Edit</Button>
                          </Link>
                          <IconButton
                            aria-label="Add to friends"
                            icon={<AddIcon />}
                            colorScheme="blue"
                          />
                        </ButtonGroup>
                        <Button
                          colorScheme="red"
                          size="sm"
                          onClick={() => handleDelete(el._id, el.title)}
                        >
                          Delete
                        </Button>
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

export default GetVideos;