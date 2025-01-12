import { Flex, Text, Button, Image, Box } from "@chakra-ui/react";
import teacher from "../../asset/EDU-04.png";
import { useNavigate } from "react-router-dom";

const Section1 = () => {
  const navigate = useNavigate();

  return (
    <Flex
      mt={100}
      mb={70}
      gap={30} 
      p="15px"
      justify="space-between" 
      align="center"
      direction={{ base: "column", md: "row" }}
    >
      {/* Phần text */}
      <Flex
        direction="column"
        w={{
          base: "100%",
          sm: "60%",
          md: "50%", 
          lg: "45%",
        }}
        gap={30}
        ml={{ base: 0, md: "auto" }} 
      >
        <Text
          fontSize={{
            base: "70px",
            sm: "30px",
            md: "60px",
            lg: "80px",
          }}
          fontWeight="bold"
          fontFamily="poppins"
          textAlign={{ base: "center", md: "left" }} 
        >
          Learn without limits
        </Text>
        <Text
          fontSize={{
            lg: "18px",
            md: "16px",
            sm: "14px",
            base: "20px",
          }}
          fontWeight="semibold"
          textAlign={{ base: "center", md: "left" }} 
        >
          {/* <Text fontSize="2rem" color="#0056d2" display="inline"> */}
          <Text fontSize="2rem" color="#FF9900" display="inline">
            EduPNK
          </Text>{" "}
          Where Educators and Students Connect Seamlessly Online. Teachers
          craft personalized courses for various subjects and grades, while
          students explore and purchase courses tailored to their needs.
          Empowering both educators and learners, EduPKA revolutionizes online
          education.
        </Text>
        <Flex
          gap={30}
          direction={{
            base: "column",
            sm: "column",
            md: "row",
            lg: "row",
          }}
        >
          <Button
            bg="#FF9900"
            color="white"
            size="lg"
            px={{ base: "40px", sm: "50px", lg: "60px" }}
            py={{ base: "20px", sm: "25px", lg: "30px" }}
            border="3px solid #0056d2"
            _hover={{ background: "#42A5F5", color: "#fff" }}
            borderRadius="md"
            onClick={() => navigate("/signup")}
          >
            Join for Free
          </Button>
          <Button
            variant="outline"
            size="lg"
            px={{ base: "40px", sm: "50px", lg: "60px" }}
            py={{ base: "20px", sm: "25px", lg: "30px" }}
            color="#0056d2"
            border="3px solid #0056d2"
            _hover={{ background: "#f0f4ff", color: "#0056d2" }}
            borderRadius="md"
            onClick={() => navigate("/login")}
          >
            Try EduPNK for Business
          </Button>
        </Flex>
      </Flex>

      {/* Phần hình ảnh */}
      <Box
        display={{ base: "none", sm: "none", md: "flex" }}
        justifyContent="center"
        alignItems="center"
        w={{
          base: "100%",
          md: "50%", 
          lg: "47%",
        }}
      >
        <Image
          src={teacher}
          alt="Your Image"
          width="100%"
          maxW="550px" 
          objectFit="contain"
        />
      </Box>
    </Flex>
  );
};

export default Section1;