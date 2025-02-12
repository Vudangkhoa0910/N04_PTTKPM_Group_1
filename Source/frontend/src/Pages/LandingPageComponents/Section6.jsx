import { Button, Flex, Image, Text, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import sectionImage from "../../asset/sectionImage.png";
import { useNavigate } from "react-router-dom";

const Section6 = () => {
  const navigate = useNavigate();

  // Màu nền và màu chữ động theo chế độ sáng/tối
  const bgColor = useColorModeValue("#ebf3ff", "#2D3748");
  const textColor = useColorModeValue("black", "white");
  const buttonColor = useColorModeValue("#FF9900", "#FFBB33"); // Màu nút cho chế độ sáng/tối

  return (
    <Flex
      bgColor={bgColor} // Sử dụng màu nền động
      gap={{
        sm: "20px",
        md: "35px",
        lg: "45px",
      }}
      p={{
        base: "10px",
        sm: "0px 20px",
        md: "0px 40px",
        lg: "0px 60px",
      }}
      direction={{
        base: "column",
        sm: "column",
        md: "column",
        lg: "row",
      }}
    >
      <Flex minW={"40%"}>
        <Image src={sectionImage} objectFit="contain" />
      </Flex>
      <Flex
        direction={"column"}
        padding={{
          base: "40px 0px",
          sm: "20px 10px",
          md: "30px 15px",
          lg: "40px 20px",
        }}
        gap={{
          sm: "15px",
          md: "25px",
        }}
        justifyContent={{
          lg: "space-evenly",
        }}
      >
        <Text
          fontSize={{
            sm: "25px",
            md: "35px",
            lg: "45 px",
          }}
          color={textColor} // Màu chữ động
        >
          Learner outcomes on <b style={{ color: "#FF9900" }}>EduPNK</b>
        </Text>
        <Text
          fontFamily={"poppins"}
          fontSize={{
            sm: "12px",
            md: "14px",
            lg: "16px",
          }}
          color={textColor} // Màu chữ động
        >
          According to the latest findings from EduPNK's 2023 report,{" "}
          <span>
            <b>an impressive 87% of learners have reported tangible career benefits.</b>
          </span> These include promotions, enhanced job performance, successful job transitions, increased employability, and skill development. SRM's extensive curriculum and industry-recognized certifications have played a pivotal role in facilitating the professional growth of learners, equipping them to thrive in today's fiercely competitive job landscape."
        </Text>
        <Flex mt='15px'>
          <Button
            bgColor={buttonColor} // Màu nền của nút động theo chế độ sáng/tối
            _hover={{ backgroundColor: "#03357b" }}
            color={"white"}
            p={{
              sm: "10px 20px",
              md: "15px 30px",
              lg: "25px 45px",
            }}
            onClick={() => navigate("/signup")}
          >
            Join for Free
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Section6;
