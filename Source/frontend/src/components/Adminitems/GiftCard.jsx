import {
  Box,
  Button,
  Flex,
  Grid,
  Image,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";

const data = [
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzShY-HQBduoJukm8zwN-869tlTb7Dl2sxlw&usqp=CAU",
    desc: "50% Discount available",
    id: 1,
    status: true,
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzShY-HQBduoJukm8zwN-869tlTb7Dl2sxlw&usqp=CAU",
    desc: "50% Discount available",
    id: 2,
    status: true,
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzShY-HQBduoJukm8zwN-869tlTb7Dl2sxlw&usqp=CAU",
    desc: "50% Discount available",
    id: 3,
    status: true,
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzShY-HQBduoJukm8zwN-869tlTb7Dl2sxlw&usqp=CAU",
    desc: "50% Discount available",
    id: 4,
    status: true,
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzShY-HQBduoJukm8zwN-869tlTb7Dl2sxlw&usqp=CAU",
    desc: "50% Discount available",
    id: 5,
    status: true,
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzShY-HQBduoJukm8zwN-869tlTb7Dl2sxlw&usqp=CAU",
    desc: "50% Discount available",
    id: 6,
    status: true,
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzShY-HQBduoJukm8zwN-869tlTb7Dl2sxlw&usqp=CAU",
    desc: "50% Discount available",
    id: 7,
    status: true,
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzShY-HQBduoJukm8zwN-869tlTb7Dl2sxlw&usqp=CAU",
    desc: "50% Discount available",
    id: 8,
    status: true,
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzShY-HQBduoJukm8zwN-869tlTb7Dl2sxlw&usqp=CAU",
    desc: "50% Discount available",
    id: 9,
    status: true,
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzShY-HQBduoJukm8zwN-869tlTb7Dl2sxlw&usqp=CAU",
    desc: "50% Discount available",
    id: 10,
    status: true,
  },
];

const GiftCard = () => {
  const [discount, setDiscount] = useState(data);
  const [search, setSearch] = useState("");
  const toast = useToast();

  const handleDelete = (id) => {
    const updatedDiscount = discount.filter((el) => el.id !== id);
    setDiscount(updatedDiscount);
    toast({
      title: "Gift card deleted.",
      description: `Gift card with ID: ${id} has been removed.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleClick = (id) => {
    const updatedDiscount = discount.map((el) =>
      el.id === id ? { ...el, status: !el.status } : el
    );
    setDiscount(updatedDiscount);
  };

  const filteredData = discount.filter((el) =>
    el.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box h={"99vh"} w="94%" mt="80px" px={5}>
      {/* Thanh tìm kiếm */}
      <Flex mb={5} justify={"center"}>
        <Input
          placeholder="Search gift cards..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          w="50%"
          size="lg"
          variant="outline"
          borderColor="blue.500"
          _focus={{ borderColor: "blue.700" }}
        />
      </Flex>

      {/* Danh sách Gift Card */}
      <Grid
        templateColumns={{
          xl: "repeat(3, 1fr)",
          lg: "repeat(2, 1fr)",
          base: "repeat(1, 1fr)",
        }}
        gap={8}
      >
        {filteredData.map((el, i) => (
          <Box
            key={i}
            border={"1px solid"}
            borderColor="gray.200"
            boxShadow="md"
            borderRadius={10}
            overflow="hidden"
            p={4}
            bg="white"
          >
            <Box mb={3}>
              <Image
                src={el.image}
                alt="Gift Card"
                borderRadius={10}
                w="100%"
                h="200px"
                objectFit="cover"
              />
            </Box>
            <Text fontSize="lg" fontWeight="bold" mb={3}>
              {el.desc}
            </Text>
            <Flex justify={"space-between"} align="center">
              <Button
                colorScheme="red"
                variant="outline"
                onClick={() => handleDelete(el.id)}
              >
                Delete
              </Button>
              <Button
                colorScheme={el.status ? "green" : "gray"}
                onClick={() => handleClick(el.id)}
              >
                {el.status ? "Enable" : "Disable"}
              </Button>
            </Flex>
          </Box>
        ))}
      </Grid>

      {/* Không có dữ liệu */}
      {filteredData.length === 0 && (
        <Text textAlign="center" color="gray.500" mt={10}>
          No gift cards found.
        </Text>
      )}
    </Box>
  );
};

export default GiftCard;
