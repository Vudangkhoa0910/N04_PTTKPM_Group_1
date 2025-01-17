import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../../Redux/UserReducer/action";
import Navbar from "../UserComponents/UserNavbar";
import Footer from "../../Pages/Footer";
import SingleAbsolute from "./SingleAbsolute";
import SingleList from "./SingleList";

export default function SinglePage() {
  const [res, setRes] = useState({});
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate();
  const userStore = useSelector((store) => store.UserReducer);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const vdo_url = `http://localhost:5001/videos/courseVideos/${id}`;

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

  return (
    <div>
      <Navbar />
      <div className="w-full flex justify-center items-center flex-col">
        <div className="w-full bg-neutral-800 flex justify-center p-5">
          <div
            style={{ paddingTop: "100px" }}
            className="xl:max-h-[320px] px-2 max-w-[598px] xl:max-w-[900px]"
          >
            <div className="xl:flex xl:space-x-4">
              <Box className="my-8">
                <Box
                  className="outerBox"
                  color="white"
                  width="100%"
                  fontFamily="sans-serif"
                >
                  <Box className="space-y-2">
                    <Box className="title" fontWeight="bold">
                      <Text fontSize="2rem">
                        {res?.course?.title || "Course Name"}
                      </Text>
                    </Box>
                    <Box className="description text-[16px] font-thin" w="40vw">
                      {res?.course?.description}
                    </Box>
                    <Box
                      className="rating space-x-2"
                      display="flex"
                      fontWeight="5px"
                    >
                      <Box className="text-yellow-300 text-xs">4.8</Box>
                      <Box className="text-[11px]">⭐⭐⭐⭐</Box>
                      <Box className="flex text-[12px] space-x-2">
                        <Box color="#a435f0">(12866 ratings)</Box>
                        <Box>69107 students</Box>
                      </Box>
                    </Box>
                    <Box className="createdby space-x-2" display="flex">
                      <Box className="text-[12px]">
                        <p>Created by</p>
                      </Box>
                      <Box color="#a435f0" className="text-[12px] underline">
                        {res?.course?.teacher}
                      </Box>
                    </Box>
                    <Box className="text-[12px] space-x-4" display="flex">
                      <Box>🌗 Last updated 5/2023</Box>
                      <Box>🌐 English</Box>
                      <Box display="flex">
                        ⌨️ English [Auto], Arabic [Auto]{" , "}
                        <Box color="#a435f0">12 more</Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <div className="mt-6">
                <SingleAbsolute props={{ ...res?.course, onOpen, onClose }} />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[598px] xl:mr-72">
          <SingleList />
        </div>

        <Box
          mt="7rem"
          bg="white"
          w="90%"
          p="6"
          borderRadius="lg"
          shadow="md"
          border="1px solid"
          borderColor="gray.300"
        >
          <Flex justify="center" mb="4">
            <Heading size="xl" color="blue.700">
              {capitalizeFirstLetter(res?.course?.title) || "Course Name"}
            </Heading>
          </Flex>

          <Flex mt="4" justify="center" align="center">
            <Heading size="md" color="gray.600">
              Teacher:
            </Heading>
            <Heading size="md" ml="1rem" color="black">
              {capitalizeFirstLetter(res?.course?.teacher) || "Teacher Name"}
            </Heading>
          </Flex>

          <Flex mt="4" justify="center" align="center">
            <Heading size="md" color="gray.600">
              Course Created:
            </Heading>
            <Heading size="md" ml="1rem" color="black">
              {res?.course?.createdAt}
            </Heading>
          </Flex>

          <Flex mt="4" justify="center" align="center">
            <Heading size="md" color="gray.600">
              Total Videos:
            </Heading>
            <Heading size="md" ml="1rem" color="black">
              {res?.course?.videos?.length || 0}
            </Heading>
          </Flex>
        </Box>

        {res?.course?.videos?.length ? (
          <Box mt="40px">
            {res?.course?.videos?.map((video, index) => {
              const embedUrl = video?.link;
              return (
                <div key={index}>
                  <Card
                    direction={{ base: "column", sm: "row" }}
                    overflow="hidden"
                    variant="outline"
                    border="1px solid"
                    m="15px"
                    onClick={() => handleImageClick(embedUrl)}
                  >
                    <Box
                      w="20vw"
                      p="1rem"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      {embedUrl ? (
                        <iframe
                          width="100%"
                          height="200"
                          src={embedUrl}
                          title={video?.title || "YouTube video player"}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <Image
                          w="100%"
                          src={video?.img || ""}
                          alt={video?.title}
                        />
                      )}
                    </Box>
                    <Stack>
                      <CardBody>
                        <Heading size="md">
                          {video?.title || "Video Name"}
                        </Heading>
                        <Text py="2">{video?.description}</Text>
                        <Text size="12px">
                          <Text fontWeight="bold" display="inline" mr="5px">
                            Instructor:
                          </Text>
                          {capitalizeFirstLetter(video?.teacher) ||
                            "Teacher Name"}
                        </Text>
                        <Text size="12px">
                          <Text fontWeight="bold" display="inline" mr="5px">
                            Date:
                          </Text>
                          {video?.createdAt}
                        </Text>
                        <Text>
                          <Text fontWeight="bold" display="inline" mr="5px">
                            Views:
                          </Text>
                          {video?.views || 0}
                        </Text>
                      </CardBody>
                    </Stack>
                  </Card>
                </div>
              );
            })}
          </Box>
        ) : (
          <Box mt="3rem" p="1rem 0" borderBottom="1px solid gray" mb="1rem">
            <Text fontSize="1.2rem" fontWeight="bold">
              We are working on the content of this course. You will soon get
              the video.
            </Text>
          </Box>
        )}
        <Footer />
      </div>
    </div>
  );
}
