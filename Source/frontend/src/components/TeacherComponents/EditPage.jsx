import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Textarea,
} from "@chakra-ui/react";
import React, { useState } from "react";
// import "../Adminitems/edit.css";
import TeacherNavTop from "./TeacherNavTop";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { patchProduct } from "../../Redux/TeacherReducer/action";

const EditPageT = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const store = useSelector((store) => store.TeacherReducer.data);
  console.log(store);
  const existedUser = store.filter((el) => el._id == id);
  const navigate = useNavigate();

  console.log(existedUser);

  let obj = {
    title: existedUser[0]?.title,
    description: existedUser[0]?.description,
    category: existedUser[0]?.category,
    price: existedUser[0]?.price,
    teacher: existedUser[0]?.teacher,
    img: existedUser[0]?.img || "",
  };

  const [detail, setDetail] = useState(obj);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetail((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = () => {
    dispatch(patchProduct(id, detail));
    alert("Data Updated Successfully");
    navigate("/Teacher/courses");
  };

  return (
    <Grid className="Nav" h={"99vh"} w="100%" placeItems="center">
      <Box mt="90px" width="90vw" maxWidth="container.lg">
        {/* <TeacherNavTop /> */}

        <Box
          border={"2px solid gray"}
          borderRadius={10}
          p={10}
          h="auto"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="stretch"
          bg="white" // Added a background color for better visibility
        >
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              placeholder="Enter Course Title"
              name="title"
              value={detail.title}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              placeholder="Enter Course description"
              name="description"
              value={detail.description}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Category</FormLabel>
            <Input
              type="text"
              placeholder="Enter Course Category"
              name="category"
              value={detail.category}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Price</FormLabel>
            <Input
              type="number"
              placeholder="Enter Course price"
              name="price"
              value={detail.price}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Thumbnail</FormLabel>
            <Input
              type="text"
              placeholder="Enter Course thumbnail Link"
              name="img"
              value={detail?.img}
              onChange={handleChange}
            />
          </FormControl>
          <Button
            mt={4}
            colorScheme="blue"
            size="md"
            isFullWidth
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Grid>
  );
};

export default EditPageT;
