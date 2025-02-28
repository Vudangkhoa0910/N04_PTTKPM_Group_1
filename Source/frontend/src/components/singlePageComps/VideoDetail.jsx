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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
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
  const [discussions, setDiscussions] = useState([]);
  const [newDiscussion, setNewDiscussion] = useState("");
  const [newDiscussionTitle, setNewDiscussionTitle] = useState("");
  const [commentInputs, setCommentInputs] = useState({});


  // Lấy courseId và url từ query string
  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get("courseId");
  const initialUrl = queryParams.get("url");

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.userId;

  useEffect(() => {
    console.log("Course ID:", courseId);
    if (courseId) {
      getSinglePageData();
      fetchComments();
      fetchDiscussions();
    }
    if (initialUrl) setVideoUrl(decodeURIComponent(initialUrl));
  }, [courseId, initialUrl]);


  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:5001/comments/${courseId}`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const fetchDiscussions = async () => {
    try {
      const response = await fetch(`http://localhost:5001/discussions/${courseId}`);
      const data = await response.json();
      console.log("Fetched discussions data:", data);
      
      // Check the structure of the first discussion's comments if available
      if (data && data.length > 0 && data[0].comments && data[0].comments.length > 0) {
        console.log("Example comment structure:", data[0].comments[0]);
      }
      
      setDiscussions(data);
    } catch (error) {
      console.error("Error fetching discussions:", error);
    }
  };

  const handleAddComment = async (discussionId) => {
    const commentText = commentInputs[discussionId];
  
    if (!userId || !commentText || !commentText.trim()) {
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5001/discussions/${discussionId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          text: commentText
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error adding comment:", errorData);
        throw new Error("Failed to add comment");
      }
  
      const updatedDiscussion = await response.json();
      console.log("Response from adding comment:", updatedDiscussion);
      console.log("Last comment added:", updatedDiscussion.comments[updatedDiscussion.comments.length - 1]);
      
      // Update the discussions state with the new comment
      setDiscussions(discussions.map(disc => 
        disc._id === discussionId ? updatedDiscussion : disc
      ));
      
      // Clear the input for this discussion
      setCommentInputs(prev => ({
        ...prev,
        [discussionId]: ""
      }));
    } catch (error) {
      console.error("Error adding comment to discussion:", error);
    }
  };

  const handleAddDiscussion = async () => {
    if (!userId || !newDiscussion.trim() || !newDiscussionTitle.trim()) {
      alert("Please provide both a title and message for your discussion");
      return;
    }
  
    const discussionData = {
      courseId,
      userId,
      title: newDiscussionTitle,
      text: newDiscussion,
    };
  
    try {
      const response = await fetch("http://localhost:5001/discussions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(discussionData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error adding discussion:", errorData);
        throw new Error("Failed to add discussion");
      }
  
      const savedDiscussion = await response.json();
      setDiscussions([...discussions, savedDiscussion]);
      setNewDiscussion("");
      setNewDiscussionTitle("");
    } catch (error) {
      console.error("Error adding discussion:", error);
    }
  };

  const handleCommentInputChange = (discussionId, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [discussionId]: value,
    }));
  };

  // Function for adding regular comments (Tab 1)
  const handleAddRegularComment = async () => {
    if (!userId || !newComment || !newComment.trim()) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5001/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          courseId,
          text: newComment
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error adding comment:", errorData);
        return;
      }
  
      const savedComment = await response.json();
      setComments([...comments, savedComment]);
      setNewComment(""); // Clear the input
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const getSinglePageData = () => {
    const token = userStore?.token;
    fetch(`http://localhost:5001/videos/courseVideos/${courseId}`, {
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
              {res?.course?.views || 1542} views
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
                  "Khóa học hát này được thiết kế dành cho những ai yêu thích âm nhạc và muốn phát triển kỹ năng ca hát của mình. Bạn sẽ học cách kiểm soát hơi thở, kỹ thuật thanh nhạc cơ bản, cũng như cách phát âm đúng và rõ ràng khi hát. Khóa học cũng bao gồm các bài tập giúp bạn cải thiện khả năng nghe nhạc và phối hợp âm điệu, giúp bạn thể hiện cảm xúc qua từng bài hát. Bên cạnh đó, bạn sẽ được hướng dẫn cách xử lý các bài hát ở nhiều thể loại khác nhau, từ pop, ballad đến nhạc trữ tình. Khóa học này không chỉ dạy kỹ thuật mà còn giúp bạn tìm ra phong cách âm nhạc riêng của mình. Tham gia khóa học để tự tin hơn khi đứng trên sân khấu và hát trước công chúng."}
              </Text>
            )}

            <Divider mt="4" />
          </Box>

          {/* Tabs for Comments and Discussions */}
          <Box mt="6">
            <Tabs variant="enclosed">
              <TabList>
                <Tab>Comments</Tab>
                <Tab>Discussions</Tab>
              </TabList>
              <TabPanels>
                {/* Comments Tab */}
                <TabPanel>
                  <Box display="flex" mb="4">
                    <Input
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      borderRadius="md"
                      mr="2"
                    />
                    <Button colorScheme="blue" onClick={handleAddRegularComment}>
                      Comment
                    </Button>
                  </Box>

                  {comments.length ? (
                    comments.map((comment, index) => (
                      <Box key={index} mb="3" p="3" bg="gray.100" borderRadius="md">
                        <Text fontWeight="bold">{"Anonymous"}</Text>
                        <Text fontSize="sm" color="gray.700">{comment.text}</Text>
                      </Box>
                    ))
                  ) : (
                    <Text fontSize="sm" color="gray.500">
                      No comments yet. Be the first to comment!
                    </Text>
                  )}
                </TabPanel>

                {/* Discussions Tab */}
                <TabPanel>
                  {/* Create a new discussion */}
                  <Box mb="6" p="4" borderWidth="1px" borderRadius="lg" bg="white">
                    <Heading size="sm" mb="2">Start a New Discussion</Heading>
                    <Input
                      value={newDiscussionTitle}
                      onChange={(e) => setNewDiscussionTitle(e.target.value)}
                      placeholder="Discussion title"
                      borderRadius="md"
                      mb="2"
                    />
                    <Input
                      value={newDiscussion}
                      onChange={(e) => setNewDiscussion(e.target.value)}
                      placeholder="Your message..."
                      borderRadius="md"
                      mb="2"
                    />
                    <Button colorScheme="green" onClick={handleAddDiscussion}>
                      Post Discussion
                    </Button>
                  </Box>

                  {/* Discussion threads */}
                  {discussions.length ? (
                    discussions.map((discussion) => (
                      <Box key={discussion._id} mb="6" p="4" borderWidth="1px" borderRadius="lg" bg="white">
                        <Heading size="md" mb="2">{discussion.title}</Heading>
                        
                        {/* Comments within this discussion */}
                        <Box mb="4">
                          {discussion.comments.map((comment, idx) => {
                            console.log(`Comment ${idx} in discussion ${discussion._id}:`, comment);
                            return (
                              <Box key={idx} p="3" mb="2" bg="gray.50" borderRadius="md">
                                <Flex justify="space-between" align="center" mb="1">
                                  <Text fontWeight="bold">
                                    {comment.name || 
                                     (comment.userId && comment.userId.name ? comment.userId.name : "Anonymous")}
                                  </Text>
                                  <Text fontSize="xs" color="gray.500">
                                    {new Date(comment.createdAt).toLocaleString()}
                                  </Text>
                                </Flex>
                                <Text>{comment.text}</Text>
                              </Box>
                            );
                          })}
                        </Box>
                        
                        {/* Add comment to this discussion */}
                        <Flex>
                          <Input
                            value={commentInputs[discussion._id] || ""}
                            onChange={(e) => handleCommentInputChange(discussion._id, e.target.value)}
                            placeholder="Reply to this discussion..."
                            mr="2"
                          />
                          <Button 
                            colorScheme="blue" 
                            onClick={() => handleAddComment(discussion._id)}
                          >
                            Reply
                          </Button>
                        </Flex>
                      </Box>
                    ))
                  ) : (
                    <Text fontSize="sm" color="gray.500">
                      No discussions yet. Start a new discussion!
                    </Text>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
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