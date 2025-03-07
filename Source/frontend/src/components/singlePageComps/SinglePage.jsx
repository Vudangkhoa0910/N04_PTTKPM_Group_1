import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardBody,
  Flex,
  Grid,
  GridItem,
  Heading,
  Stack,
  Text,
  IconButton,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../../Redux/UserReducer/action";
import Navbar from "../UserComponents/UserNavbar";
import Footer from "../../Pages/Footer";
import SingleAbsolute from "./SingleAbsolute";
import sectionImage from "../../asset/certificate.jpg";
import LandingPageCarousel from "../../Pages/LandingPageComponents/LandingPageCarousel";

const VideoCard = ({ video, onClick }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => setShowDetails(!showDetails);

  return (
    <Card
      direction={{ base: "column", sm: "row" }}
      overflow="hidden"
      variant="outline"
      border="1px solid"
      m="15px"
      boxShadow="md"
      _hover={{ boxShadow: "lg", cursor: "pointer", bg: "gray.50" }}
      transition="all 0.2s"
    >
      <Box w="full" p="1rem" onClick={toggleDetails}>
        <Flex justify="space-between" align="center">
          <Heading size="md" color="teal.600">
            {video?.title || "Video Name"}
          </Heading>
          <IconButton
            icon={showDetails ? <ChevronUpIcon /> : <ChevronDownIcon />}
            onClick={toggleDetails}
            variant="ghost"
            aria-label="Toggle Details"
          />
        </Flex>
        {showDetails && (
          <Box mt="2">
            <Text py="2" color="gray.700">
              {video?.description}
            </Text>
            <Text size="12px" color="gray.600">
              <Text fontWeight="bold" display="inline" mr="5px">
                Date:
              </Text>
              {video?.createdAt}
            </Text>
            <Text color="gray.600">
              <Text fontWeight="bold" display="inline" mr="5px">
                Views:
              </Text>
              {video?.views || 0}
            </Text>
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default function SinglePage() {
  const [res, setRes] = useState({});
  const [showAllVideos, setShowAllVideos] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const userStore = useSelector((store) => store.UserReducer);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const vdo_url = `http://localhost:5001/videos/courseVideos/${id}`;
  const userId = userStore?.userId;
  const token = userStore?.token;

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchEnrollments = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/enrollments?userId=${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error ${response.status}: Failed to fetch enrollments`
        );
      }

      const data = await response.json();
      setEnrollments(data);
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Hàm kiểm tra enrollment
  const checkIsEnrolled = () => {
    return enrollments.some(
      (enrollment) =>
        enrollment.courseId === id && enrollment.userId._id === userId
    );
  };

  const getSinglePageData = () => {
    const token = userStore?.token;

    fetch(vdo_url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRes(data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (id) getSinglePageData();
  }, [id]);

  const handleImageClick = (videoUrl) => {
    navigate(
      `/video-detail/?courseId=${res?.course?._id}&url=${encodeURIComponent(
        videoUrl
      )}`
    );
  };
  useEffect(() => {
    if (userId && token) {
      fetchEnrollments();
    }
  }, [userId, token]);

  const showCertificateButton =
    res?.course?.videos?.length <= 4 && userStore?.isAuth && checkIsEnrolled();
  // && checkIsEnrolled()

  const toggleShowAllVideos = () => setShowAllVideos(!showAllVideos);

  const videosToShow = showAllVideos
    ? res?.course?.videos
    : res?.course?.videos?.slice(0, 3);

  return (
    <div>
      <Navbar />
      <Box
        width="full"
        display="flex"
        flexDirection="column"
        alignItems="center"
        mt="80px"
        position="relative"
        zIndex="1"
      >
        <Grid
          templateColumns="repeat(3, 1fr)"
          gap={4}
          width="100%"
          mx="20px"
          px="20px"
        >
          <GridItem
            colSpan={1}
            mt="10px"
            p={6}
            borderRadius="lg"
            boxShadow="xl"
            bg="white"
            _hover={{
              transform: "translateY(-2px)",
              transition: "all 0.2s ease-in-out",
            }}
            width="100%"
          >
            <SingleAbsolute props={{ ...res?.course, onOpen, onClose }} />
          </GridItem>
          <GridItem colSpan={1} mt="30px">
            <Box width="100%" px="15px">
              {videosToShow?.length ? (
                videosToShow.map((video, index) => (
                  <Box key={index}>
                    <Box
                      position="relative"
                      borderWidth="2px"
                      borderColor={index < 4 ? "green.500" : "red.500"}
                      borderRadius="md"
                      transition="all 0.2s"
                      mb="3"
                    >
                      <VideoCard
                        video={video}
                        onClick={() => handleImageClick(video?.link)}
                      />
                    </Box>
                  </Box>
                ))
              ) : (
                <Box
                  mt="3rem"
                  p="1rem 0"
                  borderBottom="1px solid gray"
                  mb="1rem"
                >
                  <Text fontSize="1.2rem" fontWeight="bold">
                    We are working on the content of this course. You will soon
                    get the video.
                  </Text>
                </Box>
              )}
              {res?.course?.videos?.length > 3 && (
                <Box px="15px">
                  <Button
                    onClick={toggleShowAllVideos}
                    mt="2rem"
                    colorScheme="teal"
                  >
                    {showAllVideos ? "Hiển thị ít hơn" : "Xem thêm"}
                  </Button>
                </Box>
              )}
            </Box>
          </GridItem>
          <GridItem colSpan={1} mt="30px">
            <Card border="1px solid" m="15px" boxShadow="md" bg="gray.100">
              <CardBody>
                <Text fontWeight="bold" fontSize="lg" color="teal.600">
                  Instructor:
                </Text>
                <Text fontSize="md" color="gray.700">
                  {capitalizeFirstLetter(res?.course?.teacher) || "N/A"}
                </Text>
                <Text fontWeight="bold" mt="2" fontSize="lg" color="teal.600">
                  Total Videos:
                </Text>
                <Text fontSize="md" color="gray.700">
                  {res?.course?.videos?.length || 0}
                </Text>

                {showCertificateButton && (
                  <Button
                    mt="4"
                    colorScheme="teal"
                    width="full"
                    onClick={() => setIsCertificateModalOpen(true)}
                  >
                    Get Certificate
                  </Button>
                )}
              </CardBody>
            </Card>

            {/* Certificate Modal */}
            <Modal
              isOpen={isCertificateModalOpen}
              onClose={() => setIsCertificateModalOpen(false)}
              isCentered
              size="4xl"
            >
              <ModalOverlay bg="rgba(0, 0, 0, 0.5)" />
              <ModalContent
                backgroundImage={`url(${sectionImage})`}
                backgroundSize="cover"
                backgroundPosition="center"
                p={24}
                borderRadius="xl"
                border="2px solid"
                borderColor="gray.200"
                boxShadow="xl"
              >
                <ModalHeader
                  textAlign="center"
                  fontSize="2xl"
                  color="teal.700"
                  fontWeight="bold"
                  pb={4}
                >
                  Certificate of Completion{" "}
                  {/* Tiêu đề tiếng Anh trang trọng */}
                </ModalHeader>
                <ModalCloseButton color="gray.500" />
                <ModalBody
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Box
                    bg="white"
                    p={8}
                    borderRadius="md"
                    boxShadow="lg"
                    border="1px solid"
                    borderColor="gray.100"
                    textAlign="center"
                  >
                    <Text
                      fontSize="lg"
                      fontWeight="medium"
                      mb={3}
                      color="gray.700"
                    >
                      This certificate is awarded to{" "}
                      {/* Mở đầu trang trọng hơn */}
                    </Text>
                    <Text
                      fontSize="xl"
                      color="teal.600"
                      mb={2}
                      fontWeight="bold"
                    >
                      {userStore?.name}
                    </Text>
                    <Text fontSize="md" mb={3} color="gray.700">
                      for successfully completing the course{" "}
                      {/* Diễn đạt chuẩn hơn */}
                    </Text>
                    <Text fontSize="xl" color="teal.600" fontWeight="semibold">
                      {res?.course?.title}
                    </Text>
                  </Box>
                </ModalBody>
              </ModalContent>
            </Modal>
          </GridItem>
        </Grid>

        <LandingPageCarousel keyword="" />

        <Footer />
      </Box>
    </div>
  );
}
