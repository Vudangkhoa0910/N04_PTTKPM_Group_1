import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  IconButton,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "./Pagination";
import AdminNavTop from "../AdminNavTop";
import { deleteUsers, getUser } from "../../Redux/AdminReducer/action";

const Users = () => {
  const store = useSelector((store) => store.AdminReducer.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("");
  const limit = 4;

  useEffect(() => {
    dispatch(getUser(page, limit));
  }, [page, limit, dispatch]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSelect = (e) => {
    const { value } = e.target;
    setOrder(value);
  };

  const handleDelete = (id, name) => {
    dispatch(deleteUsers(id));
    alert(`${name} is Deleted`);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handlePageButton = (val) => {
    setPage((prev) => prev + val);
  };

  const count = 2; // Total pages

  // Filter users by name based on search term
  const filteredUsers = store?.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  // Sort users based on age
  const sortedUsers = filteredUsers?.sort((a, b) => {
    if (order === "asc") {
      return a.age - b.age;
    } else if (order === "desc") {
      return b.age - a.age;
    } else {
      return 0;
    }
  });

  return (
    <Grid
      h="100vh"
      templateRows="auto 1fr"
      gap={5}
      p={5}
      bg="gray.50"
      mt="10vh" // To make space for the top navigation bar
    >
      {/* Search and Filter section */}
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
        top="10vh"
      >
        {/* Search Input */}
        <Flex align="center" w="50%">
          <Input
            placeholder="Search Users"
            border="1px solid"
            borderColor="gray.300"
            h="8vh"
            w="100%"
            onChange={handleSearch}
          />
        </Flex>
        {/* Sorting and Add New User button */}
        <Flex align="center" gap={3}>
          <Select placeholder="Sort by Age" onChange={handleSelect} w="200px">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </Select>
          <Link to="/admin/users/add">
            <Button colorScheme="teal" leftIcon={<AddIcon />}>
              Add New User
            </Button>
          </Link>
        </Flex>
      </Flex>

      {/* Table with data */}
      <Box
        bg="white"
        p={5}
        borderRadius="lg"
        shadow="md"
        overflow="auto"
      >
        <Text fontSize="2xl" fontWeight="bold" color="teal.500" mb={5}>
          User Details
        </Text>

        <Box overflowX="auto">
          <Table variant="striped" colorScheme="teal">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Role</Th>
                <Th>Email</Th>
                <Th>City</Th>
                <Th>Age</Th>
                <Th>Subscribed Courses</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {sortedUsers?.length > 0 &&
                sortedUsers.map((el, i) => (
                  <Tr key={i}>
                    <Td>{el.name}</Td>
                    <Td>{el.role}</Td>
                    <Td>{el.email}</Td>
                    <Td>{el.city}</Td>
                    <Td>{el.age}</Td>
                    <Td>{el.course.length}</Td>
                    <Td>
                      <Flex gap={2}>
                        <Button
                          colorScheme="red"
                          size="sm"
                          onClick={() => handleDelete(el._id, el.name)}
                        >
                          Delete
                        </Button>
                        <Link to={`/admin/users/edit/${el._id}`}>
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

        {/* Pagination */}
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

export default Users;