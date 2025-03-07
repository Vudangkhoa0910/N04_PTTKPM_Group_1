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
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Textarea,
    useDisclosure,
    List,
    ListItem,
    IconButton,
    HStack,
    Radio,
    RadioGroup,
    Stack as ChakraStack, // Để tránh xung đột tên với React Stack
    Select
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import Navbar from "../UserComponents/UserNavbar";
import Footer from "../../Pages/Footer";
import { EditIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";

// Helper function outside component scope for YouTube ID extraction
const getVideoIdFromLink = (url) => {
    if (!url) return null;

    let videoId = null;

    if (url.includes('youtube.com/embed/')) {
        videoId = url.split('youtube.com/embed/')[1];
        if (videoId.includes('?')) {
            videoId = videoId.split('?')[0];
        }
    } else if (url.includes('youtube.com/watch?v=')) {
        const urlParams = new URLSearchParams(url.split('?')[1]);
        videoId = urlParams.get('v');
    } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1];
        if (videoId.includes('?')) {
            videoId = videoId.split('?')[0];
        }
    }

    return videoId;
};


const StudentScores = ({ courseId }) => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
      const fetchScores = async () => {
          try {
              const response = await fetch(`http://localhost:5001/scores/course/${courseId}`);
              if (response.ok) {
                  const data = await response.json();
                  setScores(data);
              } else {
                  console.error("Không thể lấy điểm:", response.status);
              }
          } catch (error) {
              console.error("Lỗi khi lấy điểm:", error);
          }
      };

      fetchScores();
  }, [courseId]);

  return (
      <Box>
          {scores.length > 0 ? (
              <List spacing={2}>
                  {scores.map((score) => (
                      <ListItem key={score._id}>
                          <Text>
                              {score.name || "Anonymous"} - Score: {score.score}  {/* Hiển thị score.name thay vì score.userId */}
                          </Text>
                      </ListItem>
                  ))}
              </List>
          ) : (
              <Text>Không có điểm nào cho khóa học này.</Text>
          )}
      </Box>
  );
};
const StudentQuiz = ({ questions, userAnswers, handleAnswerChange, handleSubmit, score }) => {
    const [answerType, setAnswerType] = useState("radio");
    return (
        <Box>
            {questions.length > 0 ? (
                <List spacing={3}>
                    {questions.map((question) => (
                        <ListItem key={question._id} p={4} borderWidth="1px" borderRadius="md" bg="white">
                            <HStack justify="space-between">
                                <Text fontWeight="bold">{question.questionText}</Text>
                            </HStack>
                            <FormControl>
                                {answerType === "radio" ? (
                                    <RadioGroup onChange={(value) => handleAnswerChange(question._id, value)} value={userAnswers[question._id] || ""}>
                                        <ChakraStack direction="column">
                                            {question.options.map((option, index) => (
                                                <Radio key={index} value={option}>
                                                    {option}
                                                </Radio>
                                            ))}
                                        </ChakraStack>
                                    </RadioGroup>
                                ) : (
                                    <Select placeholder="Chọn đáp án" onChange={(e) => handleAnswerChange(question._id, e.target.value)} value={userAnswers[question._id] || ""}>
                                        {question.options.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                        ))}
                                    </Select>
                                )}
                            </FormControl>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Text>Không có câu hỏi nào cho khóa học này.</Text>
            )}
            <Button colorScheme="blue" onClick={handleSubmit} mt={4}>
                Nộp Bài
            </Button>
        </Box>
    );
};

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
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState({}); // Thêm state cho câu trả lời của người dùng
    const [score, setScore] = useState(null);  // State để lưu điểm
    const [userScores, setUserScores] = useState([]);

    const queryParams = new URLSearchParams(location.search);
    const courseId = queryParams.get("courseId");
    const initialUrl = queryParams.get("url");

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.userId;
    const userRole = storedUser?.role;  // Assuming the user role is stored in localStorage

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [newQuestion, setNewQuestion] = useState({ questionText: "", correctAnswer: "", options: ["", "", "", ""] });
    const [selectedQuestionId, setSelectedQuestionId] = useState(null); // For editing
    const [isEditMode, setIsEditMode] = useState(false); // Control the state of edit


    const fetchQuestions = async () => {
        try {
            const response = await fetch(`http://localhost:5001/questions/course/${courseId}`);
            if (response.ok) {
                const data = await response.json();
                setQuestions(data);
            } else {
                console.error("Failed to fetch questions:", response.status);
            }
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    };

    useEffect(() => {
        if (courseId) {
            fetchQuestions();
        }
    }, [courseId]);



    const updateViewCount = async (videoId, viewCount) => {
        try {
            const token = userStore?.token;

            const viewResponse = await fetch(
                `http://localhost:5001/views?courseId=${courseId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`,
                    },
                }
            );

            const viewData = await viewResponse.json();

            if (viewData.length > 0) {
                await fetch(`http://localhost:5001/views/${viewData[0]._id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        views: parseInt(viewCount),
                    }),
                });
            } else {
                await fetch("http://localhost:5001/views", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        views: parseInt(viewCount),
                        teacherId: res?.course?.teacherId,
                        courseId,
                        courseName: res?.course?.title,
                        coursePrice: res?.course?.price,
                    }),
                });
            }
        } catch (error) {
            console.error("Error updating view count in backend:", error);
        }
    };

    const fetchYouTubeViewCount = async (videoUrl) => {
        try {
            // Replace with your actual YouTube API key
            const youtubeApiKey = "YOUR_YOUTUBE_API_KEY";

            const videoId = getVideoIdFromLink(videoUrl);
            if (!videoId) {
                console.error("Could not extract video ID from URL:", videoUrl);
                return;
            }

            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${youtubeApiKey}`
            );

            if (!response.ok) {
                throw new Error(`YouTube API error: ${response.status}`);
            }

            const data = await response.json();
            if (data.items && data.items.length > 0) {
                const viewCount = data.items[0].statistics.viewCount;
                console.log("YouTube views:", viewCount);

                setRes(prev => ({
                    ...prev,
                    course: {
                        ...prev.course,
                        views: viewCount
                    }
                }));

                updateViewCount(videoId, viewCount);
            }
        } catch (error) {
            console.error("Error fetching YouTube view count:", error);
        }
    };


    useEffect(() => {
        console.log("Course ID:", courseId);
        if (courseId) {
            getSinglePageData();
            fetchComments();
            fetchDiscussions();
        }
        if (initialUrl) setVideoUrl(decodeURIComponent(initialUrl));
    }, [courseId, initialUrl]);

    useEffect(() => {
        const fetchUserScores = async () => {
            if (userId && courseId) {
                try {
                    const response = await fetch(`http://localhost:5001/scores/user/${userId}/course/${courseId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setUserScores(data);
                    } else {
                        console.error("Không thể lấy điểm của người dùng:", response.status);
                        setUserScores([]);
                    }
                } catch (error) {
                    console.error("Lỗi khi lấy điểm của người dùng:", error);
                    setUserScores([]);
                }
            }
        };

        fetchUserScores();
    }, [userId, courseId]);

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

            setDiscussions(discussions.map(disc =>
                disc._id === discussionId ? updatedDiscussion : disc
            ));

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
            setNewComment("");
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
            .then((data) => {
                setRes(data);

                if (data?.course?.videos && data.course.videos.length > 0) {
                    fetchYouTubeViewCount(data.course.videos[0].link);
                }
            })
            .catch((err) => console.error("Error fetching video data:", err));
    };

    const handleImageClick = (videoUrl) => {
        const params = new URLSearchParams();
        params.set("courseId", res?.course?._id);
        params.set("url", encodeURIComponent(videoUrl));
        navigate(`/video-detail/?${params.toString()}`);
        setVideoUrl(videoUrl);
    };


    //Question Creation
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("option")) {
            const optionIndex = parseInt(name.slice(6)); // Extract index
            const newOptions = [...newQuestion.options];
            newOptions[optionIndex] = value;
            setNewQuestion({ ...newQuestion, options: newOptions });
        } else {
            setNewQuestion({ ...newQuestion, [name]: value });
        }
    };

    const handleSubmitQuestion = async () => {
        try {
            // Validate that the correctAnswer is in the options
            if (!newQuestion.options.includes(newQuestion.correctAnswer)) {
                alert("The correct answer must be one of the options.");
                return;
            }

            const questionData = {
                ...newQuestion,
                courseId: courseId,
            };

            const response = await fetch("http://localhost:5001/questions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(questionData),
            });

            if (response.ok) {
                fetchQuestions();
                onClose();
                setNewQuestion({ questionText: "", correctAnswer: "", options: ["", "", "", ""] });
            } else {
                console.error("Failed to save question:", response.status);
            }
        } catch (error) {
            console.error("Error saving question:", error);
        }
    };


    const handleEditQuestion = (question) => {
        setSelectedQuestionId(question._id);
        setNewQuestion({
            questionText: question.questionText,
            correctAnswer: question.correctAnswer,
            options: [...question.options],
        });
        setIsEditMode(true);
        onOpen();
    };

    const handleUpdateQuestion = async () => {
        try {
            const response = await fetch(`http://localhost:5001/questions/${selectedQuestionId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    },
                 body: JSON.stringify({
                        ...newQuestion,
                        courseId: courseId,
                    }),
                });

                if (response.ok) {
                    fetchQuestions(); // Refresh questions after update
                    onClose(); // Close modal
                    setNewQuestion({ questionText: "", correctAnswer: "", options: ["", "", "", ""] }); // Reset state
                    setSelectedQuestionId(null); // Clear selected question ID
                    setIsEditMode(false);
                } else {
                    console.error("Failed to update question:", response.status);
                }
            } catch (error) {
                console.error("Error updating question:", error);
            }
        };

        const handleDeleteQuestion = async (questionId) => {
            try {
                const response = await fetch(`http://localhost:5001/questions/${questionId}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    fetchQuestions(); // Refresh questions after deletion
                } else {
                    console.error("Failed to delete question:", response.status);
                }
            } catch (error) {
                console.error("Error deleting question:", error);
            }
        };

        const handleOpenModal = () => {
            setIsEditMode(false);
            onOpen();
        };

        // ****************************
        // START QUIZ FUNCTIONALITY
        // ****************************

        const handleAnswerChange = (questionId, answer) => {
            console.log(`Câu trả lời của người dùng cho câu hỏi ${questionId}: ${answer}`);
            setUserAnswers({
                ...userAnswers,
                [questionId]: answer,
            });
        };

        const handleSubmit = async () => {
            let correctAnswers = 0;
            questions.forEach((question) => {
                console.log(`Câu hỏi: ${question.questionText}`);
                console.log(`Câu trả lời của người dùng: ${userAnswers[question._id]}`);
                console.log(`Đáp án đúng: ${question.correctAnswer}`);
                if (userAnswers[question._id] === question.correctAnswer) {
                    correctAnswers++;
                    console.log("Câu trả lời đúng!");
                } else {
                    console.log("Câu trả lời sai.");
                }
            });

            setScore(correctAnswers); // Lưu điểm vào state
            console.log('score la: ', correctAnswers)

            // Tùy chọn: Lưu điểm vào backend
            try {
                const response = await fetch("http://localhost:5001/scores", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: userId,
                        courseId: courseId,
                        score: correctAnswers,
                    }),
                });

                if (response.ok) {
                    console.log("Điểm đã được lưu vào backend.");
                    fetchUserScores();
                } else {
                    console.error("Không thể lưu điểm vào backend.");
                }
            } catch (error) {
                console.error("Lỗi khi lưu điểm:", error);
            }
        };

        // ****************************
        // END QUIZ FUNCTIONALITY
        // ****************************

        // Fetch user scores
        const fetchUserScores = async () => {
            if (userId && courseId) {
                try {
                    const response = await fetch(`http://localhost:5001/scores/user/${userId}/course/${courseId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setUserScores(data);
                    } else {
                        console.error("Không thể lấy điểm của người dùng:", response.status);
                        setUserScores([]);
                    }
                } catch (error) {
                    console.error("Lỗi khi lấy điểm của người dùng:", error);
                    setUserScores([]);
                }
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
                                    <Tab>Questions</Tab>
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

                                    {/* Questions Tab */}
                                    <TabPanel>
                                        {/* Button to Add Question (Visible to Teachers/Admins) */}
                                        {(userRole === 'teacher' || userRole === 'admin') && (
                                            <HStack justify="space-between" mb={4}>
                                                <Button colorScheme="green" onClick={handleOpenModal} leftIcon={<AddIcon />}>
                                                    Add New Question
                                                </Button>

                                            </HStack>
                                        )}
                                        <StudentQuiz
                                            questions={questions}
                                            userAnswers={userAnswers}
                                            handleAnswerChange={handleAnswerChange}
                                            handleSubmit={handleSubmit}
                                            score={score}
                                        />
                                        {/* Display score for student */}
                                        {userRole === "user" && userScores.length > 0 && (
                                            <Box mt={4}>
                                                <Heading size="sm" mb={2}>Điểm của bạn:</Heading>
                                                <List spacing={2}>
                                                    {userScores.map((scoreRecord) => (
                                                        <ListItem key={scoreRecord._id}>
                                                            <Text>
                                                                Bài nộp ngày: {new Date(scoreRecord.createdAt).toLocaleDateString()} - Điểm: {scoreRecord.score}
                                                            </Text>
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </Box>
                                        )}
                                         {score !== null && userRole === "user" && userScores.length === 0 && (
                                           <Box mt={4}>
                                                 <Heading size="sm" mb={2}>Điểm của bạn:</Heading>
                                               <Text>Bạn đã trả lời đúng {score} trên {questions.length} câu hỏi.</Text>
                                         </Box>
                                          )}
                                        {(userRole === 'teacher' || userRole === 'admin') && (
                                            <Box mt={6}>
                                                <Heading size="md" mb={4}>Student Scores</Heading>
                                                <StudentScores courseId={courseId} />

                                            </Box>
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
            {/* Modal for Add/Edit Question */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{isEditMode ? "Edit Question" : "Add New Question"}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl mb={4}>
                            <FormLabel>Question Text</FormLabel>
                            <Textarea
                                name="questionText"
                                value={newQuestion.questionText}
                                onChange={handleInputChange}
                            />
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel>Correct Answer</FormLabel>
                            <Input
                                name="correctAnswer"
                                value={newQuestion.correctAnswer}
                                onChange={handleInputChange}
                            />
                        </FormControl>

                        {newQuestion.options.map((option, index) => (
                            <FormControl key={index} mb={4}>
                                <FormLabel>Option {index + 1}</FormLabel>
                                <Input
                                    name={`option${index}`}
                                    value={option}
                                    onChange={handleInputChange}
                                />
                            </FormControl>
                        ))}

                        <Button colorScheme="blue" mr={3} onClick={isEditMode ? handleUpdateQuestion : handleSubmitQuestion}>
                            {isEditMode ? "Update Question" : "Save Question"}
                        </Button>
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    </ModalBody>
                </ModalContent>
            </Modal>


            <Footer />
        </>
    );
}