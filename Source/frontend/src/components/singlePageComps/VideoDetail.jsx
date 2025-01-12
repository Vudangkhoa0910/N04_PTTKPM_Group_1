import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Card,
  Stack,
  Image,
  Divider,
  Button,
  Input,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import Navbar from "../UserComponents/UserNavbar";
import Footer from "../../Pages/Footer";

export default function VideoDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const userStore = useSelector((store) => store.UserReducer);

  const [res, setRes] = useState({});
  const [videoUrl, setVideoUrl] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Lấy courseId và url từ query string
  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get("courseId");
  const initialUrl = queryParams.get("url");

  useEffect(() => {
    if (courseId) getSinglePageData();
    if (initialUrl) setVideoUrl(decodeURIComponent(initialUrl)); // Giải mã URL ban đầu
  }, [courseId, initialUrl]);

  const getSinglePageData = () => {
    const token = userStore?.token;
    fetch(`http://localhost:5000/videos/courseVideos/${courseId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setRes(data))
      .catch((err) => console.error("Error fetching video data:", err));
  };

  const handleImageClick = (videoUrl) => {
    const params = new URLSearchParams();
    params.set("courseId", res?.course?._id);
    params.set("url", encodeURIComponent(videoUrl));
    navigate(`/video-detail/?${params.toString()}`);
    setVideoUrl(videoUrl);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        { user: userStore.name || "Anonymous", text: newComment },
      ]);
      setNewComment("");
    }
  };

  return (
    <>
      <Navbar />
      <Box
        w="100%"
        p="4"
        display="flex"
        flexDirection="row"
        mt="20"
        bg="gray.50"
      >
        {/* Video lớn bên trái */}
        <Box w="70%" mr="6" p="4" bg="white" borderRadius="md" boxShadow="lg">
          {videoUrl ? (
            <iframe
              width="100%"
              height="500px"
              src={videoUrl}
              title="Video Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ borderRadius: "8px" }}
            ></iframe>
          ) : (
            <Heading size="lg" textAlign="center">
              No video URL provided
            </Heading>
          )}
          <Box mt="6">
            <Heading size="lg" mb="4">
              {res?.course?.title || "Course Title"}
            </Heading>

            {/* Hiển thị lượt xem */}
            <Text fontSize="sm" color="gray.600" mb="2">
              {res?.course?.views || 0} views
            </Text>

            {/* Giới thiệu ngắn */}
            <Text fontSize="md" color="gray.700" noOfLines={3} mb="2">
              {res?.course?.description || "No description available"}
            </Text>

            {/* Nút hiển thị đầy đủ giới thiệu */}
            <Text
              fontSize="sm"
              color="blue.500"
              cursor="pointer"
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? "Show less" : "Show more"}
            </Text>

            {showFullDescription && (
              <Text fontSize="md" color="gray.700" lineHeight="1.8" mt="2">
                {res?.course?.fullDescription ||
                  "Full description of the course"}
              </Text>
            )}

            <Divider mt="4" />
          </Box>

          {/* Phần bình luận */}
          <Box mt="6">
            <Heading size="md" mb="4">
              Comments
            </Heading>

            {/* Form nhập bình luận */}
            <Box display="flex" mb="4">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                borderRadius="md"
                mr="2"
              />
              <Button colorScheme="blue" onClick={handleAddComment}>
                Comment
              </Button>
            </Box>

            {/* Danh sách bình luận */}
            {comments.length ? (
              comments.map((comment, index) => (
                <Box key={index} mb="3" p="3" bg="gray.100" borderRadius="md">
                  <Text fontWeight="bold">{comment.user}</Text>
                  <Text fontSize="sm" color="gray.700">
                    {comment.text}
                  </Text>
                </Box>
              ))
            ) : (
              <Text fontSize="sm" color="gray.500">
                No comments yet. Be the first to comment!
              </Text>
            )}
          </Box>
        </Box>

        {/* Danh sách video bên phải */}
        <Box
          w="30%"
          h="100vh"
          overflowY="auto"
          borderLeft="1px solid #E2E8F0"
          pl="4"
          pr="4"
          bg="white"
          boxShadow="md"
        >
          {res?.course?.videos?.length ? (
            res.course.videos.map((video, index) => {
              const embedUrl = video?.link;
              return (
                <Card
                  key={index}
                  direction="row"
                  overflow="hidden"
                  variant="outline"
                  border="1px solid #CBD5E0"
                  borderRadius="md"
                  mb="4"
                  onClick={() => handleImageClick(embedUrl)}
                  cursor="pointer"
                  _hover={{
                    boxShadow: "lg",
                    bg: "gray.100",
                    transform: "scale(1.02)",
                    transition: "0.3s",
                  }}
                >
                  <Box w="30%" display="flex" justifyContent="center">
                    {embedUrl ? (
                      <iframe
                        width="100%"
                        height="100"
                        src={embedUrl}
                        title={video?.title || "YouTube video player"}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ borderRadius: "8px" }}
                      ></iframe>
                    ) : (
                      <Image
                        w="100%"
                        h="100px"
                        src={video?.img || ""}
                        alt={video?.title}
                        objectFit="cover"
                        borderRadius="8px"
                      />
                    )}
                  </Box>
                  <Stack w="70%" p="3">
                    <Heading size="sm" color="gray.700" isTruncated>
                      {video?.title || "Video Name"}
                    </Heading>
                    <Text fontSize="sm" color="gray.600" noOfLines={2}>
                      {video?.description}
                    </Text>
                  </Stack>
                </Card>
              );
            })
          ) : (
            <Text fontSize="lg" fontWeight="bold" mt="6" textAlign="center">
              We are working on the content of this course. You will soon get
              the video.
            </Text>
          )}
        </Box>
      </Box>
      <Footer />
    </>
  );
}
