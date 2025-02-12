import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  IconButton,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link as ChakraLink,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AddIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import convertDateFormat, {
  deleteProduct,
  getvideo,
} from "../../Redux/TeacherReducer/action";
import Pagination from "../Adminitems/Pagination";
import TeacherNavTop from "./TeacherNavTop";

const GetTeacherVideos = () => {
  const store = useSelector((store) => store.TeacherReducer.videos);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const limit = 4;

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    dispatch(getvideo(page, limit, user.userId));
  }, [page, limit, user.userId]);

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      dispatch(deleteProduct(id));
      alert(`${title} has been deleted.`);
    }
  };

  const handlePageButton = (val) => {
    setPage((prev) => prev + val);
  };

  const count = Math.ceil(store.length / limit);

  return (
    <Grid className="Nav" h="100vh" w="100%" px={4} gap={10}>
      <Box mt="80px" w="100%">
        <TeacherNavTop />
        <Box p={6} bg="white" boxShadow="lg" borderRadius="md" mb={6}>
          <Text fontSize="2xl" fontWeight="bold" color="blue.500" mb={4}>
            Courses Video
          </Text>

          <Box maxWidth="100%" overflowX="auto">
            <Table variant="striped" size="md">
              <Thead bg="blue.100">
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
                {store.length > 0 ? (
                  store.map((el, i) => (
                    <Tr key={i} _hover={{ bg: "gray.100" }}>
                      <Td>{el.title}</Td>
                      <Td>{convertDateFormat(el.createdAt)}</Td>
                      <Td>{el.description}</Td>
                      <Td>{el.views}</Td>
                      <Td>
                        <ChakraLink
                          href={el.link}
                          isExternal
                          color="blue.500"
                          fontWeight="bold"
                        >
                          View <ExternalLinkIcon mx="2px" />
                        </ChakraLink>
                      </Td>
                      <Td>
                        <Flex gap={2}>
                          <Button
                            size="sm"
                            colorScheme="red"
                            onClick={() => handleDelete(el._id, el.title)}
                          >
                            Delete
                          </Button>
                          <Link to={`/Teacher/videos/add/${el.courseId}`}>
                            <ButtonGroup size="sm" isAttached variant="outline">
                              <Button>Add</Button>
                              <IconButton
                                aria-label="Add to friends"
                                icon={<AddIcon />}
                              />
                            </ButtonGroup>
                          </Link>
                        </Flex>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan="6" textAlign="center" color="gray.500">
                      No videos available.
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>

          <Flex justifyContent="center" mt={6} gap={4}>
            <Button
              colorScheme="blue"
              onClick={() => handlePageButton(-1)}
              disabled={page <= 1}
            >
              Prev
            </Button>
            <Pagination
              totalCount={count}
              current_page={page}
              handlePageChange={setPage}
            />
            <Button
              colorScheme="blue"
              onClick={() => handlePageButton(1)}
              disabled={page >= count}
            >
              Next
            </Button>
          </Flex>
        </Box>
      </Box>
    </Grid>
  );
};

export default GetTeacherVideos;