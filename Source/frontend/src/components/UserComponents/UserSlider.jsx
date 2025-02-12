import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";

const UserSlider = () => {
  const images = [
    "https://phenikaa-uni.edu.vn:3600/pu/vi/image-topic-60162ab3ed4c2a36389c5a9d//khua2.jpg",
    "https://afamilycdn.com/150157425591193600/2022/9/7/photo-1-1662522743900551288398-1662526506081-16625265061841688172215.jpg",
    "https://saudaihoc.phenikaa-uni.edu.vn/wp-content/uploads/2023/10/111.jpg",
    "https://uwebristol.edu.vn/wp-content/uploads/Logo-UWE-Phenikaa_edited.jpg",
    "https://phenikaa-uni.edu.vn:3600/eee/vi/posts/phenikaa-lighting.png",
    "https://phenikaa-uni.edu.vn:3600/pu/vi/posts/21761045618568323211858904406023340136083277n.jpeg",
  ];

  const textOnImage = [
    "Group Studies",
    "Degree from Recognized Institutes",
    "Prestigious Institutions",
    "Online Classes",
    "Study Notes",
    "Successful Career",
  ];

  const indexDescription = [
    "EduPhenikaa encourages collaborative group studies, creating a vibrant learning environment where students can connect and learn together. It offers a versatile platform for educators to share their knowledge, helping students excel academically.",
    "Secure your degree from renowned institutes with EduPhenikaa's comprehensive education solutions. EduPhenikaa provides access to globally recognized institutions, ensuring students receive quality education and gain valuable qualifications for their future careers.",
    "EduPhenikaa unlocks access to prestigious educational institutions, elevating your academic journey to new heights. With EduPhenikaa, you can explore a world of educational opportunities, expanding your knowledge and skills in various fields.",
    "Experience dynamic online classes on EduPhenikaa's intuitive platform, tailored to modern learners' needs. EduPhenikaa's user-friendly interface and interactive features make online learning engaging and effective, helping students succeed in today's digital age.",
    "Access meticulously crafted study notes on EduPhenikaa to enhance your understanding and retention of course materials. EduPhenikaa's comprehensive study resources empower students to excel in their studies and gain a deeper understanding of their subjects.",
    "EduPhenikaa is your gateway to a successful career, offering the knowledge and skills needed for professional excellence. With EduPhenikaa, you can prepare for a bright future and achieve your career goals through high-quality education and training.",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box w="100vw" position="relative" overflow="hidden">
      {/* Image Section */}
      <Box
        display="flex"
        transition="transform 0.8s ease-in-out"
        transform={`translateX(-${currentIndex * 100}vw)`}
        w={`${images.length * 100}vw`}
      >
        {images.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt={`Slide ${index}`}
            w="100vw"
            h="80vh"  // Adjust height here to 50% of the screen height
            objectFit="cover"
          />
        ))}
      </Box>

      {/* Text Overlay */}
      <Box
        position="absolute"
        bottom="10%"
        left="50%"
        transform="translateX(-50%)"
        w="90%"
        maxW="800px"
        textAlign="center"
        bg="rgba(0, 0, 0, 0.5)"  // Added background with transparency
        p={4}
        borderRadius="md"
      >
        <Heading
          size="2xl"
          mb={4}
          bgGradient="linear(to-r, orange.400, yellow.400)"
          bgClip="text"
          textShadow="2px 2px 8px rgba(0, 0, 0, 0.8)"
          color="orange"  // Text color set to white for visibility
        >
          {textOnImage[currentIndex]}
        </Heading>
        <Text
          fontSize="lg"
          color="white"  // Make the description text color white
          fontWeight="medium"
          lineHeight="1.8"
        >
          {indexDescription[currentIndex]}
        </Text>
      </Box>

      {/* Navigation Buttons */}
      <Button
        position="absolute"
        top="50%"
        left="10px"
        transform="translateY(-50%)"
        bg="transparent"
        color="white"
        borderRadius="full"
        _hover={{ color: "orange.500" }}
        _active={{ color: "orange.600" }}
        onClick={handlePrevious}
        zIndex={2}
      >
        <ArrowLeftIcon boxSize={8} />
      </Button>
      <Button
        position="absolute"
        top="50%"
        right="10px"
        transform="translateY(-50%)"
        bg="transparent"
        color="white"
        borderRadius="full"
        _hover={{ color: "orange.500" }}
        _active={{ color: "orange.600" }}
        onClick={handleNext}
        zIndex={2}
      >
        <ArrowRightIcon boxSize={8} />
      </Button>
    </Box>
  );
};

export default UserSlider;
