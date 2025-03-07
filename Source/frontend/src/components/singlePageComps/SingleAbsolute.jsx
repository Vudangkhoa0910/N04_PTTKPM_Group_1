import {
  Box,
  Image,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import sectionImage from "../../asset/pay.svg";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"; // Add this import

const SingleAbsolute = ({ props }) => {
  const [page, setPage] = useState("left");
  const [random, setRandom] = useState(0);
  const { price, img } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [canNavigate, setCanNavigate] = useState(false);
  const [successDialogVisible, setSuccessDialogVisible] = useState(false);
  const navigate = useNavigate();
  const courseName =
    page === "left" ? "Personal Plan Course" : "Teams Plan Course";

  const [res, setRes] = useState({});
  const { id } = useParams();
  const userStore = useSelector((store) => store.UserReducer);
  const vdo_url = `http://localhost:5001/videos/courseVideos/${id}`; 

  const userId = userStore?.userId;
  const token = userStore?.token;

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);

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
  const buttonText = checkIsEnrolled()
    ? "Start subscription"
    : "Buy this course";

  // Fetch enrollments khi component mount
  useEffect(() => {
    if (!userId || !token) return;

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

    fetchEnrollments();
  }, [userId, token]);

  const getSinglePageData = () => {
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

  useEffect(() => {
    setRandom((Math.random() * 20).toFixed());
  }, []);

  // Calculate discount price if course has discount
  const hasDiscount = res?.course?.discount > 0;
  const discountPercentage = res?.course?.discount || 0;
  const originalPrice = page === "left" ? price : (price * 1.2).toFixed(2);
  const discountedPrice = hasDiscount 
    ? (originalPrice * (1 - discountPercentage/100)).toFixed(2) 
    : originalPrice;

  // The final price shown to users
  const displayPrice = discountedPrice;

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };
  const handlePayment = async () => {
    if (!paymentMethod) {
      console.error("No payment method selected");
      return;
    }

    onClose();
    setIsPaymentSuccess(true);
    setCanNavigate(true);

    const userData = JSON.parse(localStorage.getItem("user"));
    const userId = userData?.userId;

    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }

    const courseId = res?.course?._id;
    if (!courseId) {
      console.error("Course ID is missing");
      return;
    }

    const price = displayPrice;

    try {
      const response = await fetch("http://localhost:5001/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, courseId, price, paymentMethod }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Enrollment failed:", errorData);
        return;
      }

      const data = await response.json();
      console.log("Enrollment successful:", data);

      // Cập nhật danh sách enrollments và chạy lại checkIsEnrolled
      setEnrollments((prevEnrollments) => [...prevEnrollments, data]);

      // Chạy lại fetchEnrollments để cập nhật giao diện
      await fetchEnrollments();

      setSuccessDialogVisible(true);
      setTimeout(() => {
        setSuccessDialogVisible(false);
      }, 1000);
    } catch (error) {
      console.error("Error during payment and enrollment:", error);
    }
  };

  const handleButtonClick = async () => {
    if (checkIsEnrolled()) {
      try {
        // Lấy dữ liệu lượt xem từ server backend
        const response = await fetch(
          `http://localhost:5001/views?courseId=${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch view data from server");
        }

        const viewData = await response.json();

        // Lấy videoId từ video YouTube trong dạng link embedded
        const videoId = getVideoIdFromLink(res?.course?.videos[0]?.link);
        if (!videoId) {
          throw new Error("Invalid YouTube video link");
        }

        // Lấy thông tin lượt xem từ YouTube API
        const youtubeApiKey = ""; // Thay bằng API key của bạn
        const youtubeResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${youtubeApiKey}`
        );
        if (!youtubeResponse.ok) {
          throw new Error("Failed to fetch data from YouTube API");
        }

        const youtubeData = await youtubeResponse.json();
        const youtubeViews = youtubeData.items[0].statistics.viewCount;

        if (viewData.length > 0) {
          // Đã có dữ liệu lượt xem, tăng view lên 1
          await fetch(`http://localhost:5001/views/${viewData[0]._id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ views: viewData[0].views + 1 }),
          });
        } else {
          // Chưa có dữ liệu, thêm mới
          await fetch("http://localhost:5001/views", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              views: youtubeViews, // Lấy số lượt xem từ YouTube
              teacherId: res?.course?.teacherId,
              courseId: id,
              courseName: res?.course?.title,
              coursePrice: res?.course?.price,
            }),
          });
        }
      } catch (error) {
        console.error("Error updating views:", error);
      }

      // Dẫn tới trang chi tiết video
      const firstVideoLink =
        res?.course?.videos?.length > 0 ? res?.course?.videos[0]?.link : null;
      if (firstVideoLink) {
        navigate(
          `/video-detail/?courseId=${res?.course?._id}&url=${encodeURIComponent(
            firstVideoLink
          )}`
        );
      } else {
        console.error("No video link available");
      }
    } else {
      onOpen(); // Nếu chưa đăng ký, mở popup
    }
  };

  // Hàm để lấy videoId từ link YouTube embed
  const getVideoIdFromLink = (link) => {
    const regex = /(?:https?:\/\/(?:www\.)?youtube\.com\/embed\/)([\w-]+)/;
    const match = link.match(regex);
    return match ? match[1] : null;
  };

  const checkIsFavorited = async () => {
    if (!userId || !id || !token) return;
    
    try {
      const response = await fetch(
        `http://localhost:5001/favoritecourses/check/${userId}/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to check favorite status');
      }
      
      const data = await response.json();
      setIsFavorited(data.isFavorited);
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  };

  // Add toggle favorite function
  const toggleFavorite = async (e) => {
    e.stopPropagation(); // Prevent triggering other click events
    
    if (!userId || !token) {
      onOpen(); // Reuse existing modal to prompt login
      return;
    }
    
    try {
      if (isFavorited) {
        // Remove from favorites
        const response = await fetch(
          `http://localhost:5001/favoritecourses/user/${userId}/course/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (!response.ok) throw new Error('Failed to remove from favorites');
        setIsFavorited(false);
      } else {
        // Add to favorites
        const response = await fetch(
          `http://localhost:5001/favoritecourses`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userId, courseId: id }),
          }
        );
        
        if (!response.ok) throw new Error('Failed to add to favorites');
        setIsFavorited(true);
      }
    } catch (error) {
      console.error("Error toggling favorite status:", error);
    }
  };

  // Add effect to check favorite status when component mounts or when userId/id changes
  useEffect(() => {
    if (userId && id && token) {
      checkIsFavorited();
    }
  }, [userId, id, token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="xl:border xl:border-gray-300 text-white xl:text-black xl:max-w-[800px] xl:shadow-lg shadow-neutral-800 xl:bg-white rounded-lg overflow-hidden">
      <div className="relative">
        <Image
          src={img}
          className="w-full h-[300px] object-cover"
          alt="Course Thumbnail"
        />
        {/* Add the favorite heart icon */}
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 z-10 bg-white bg-opacity-70 rounded-full p-2 shadow-md transition-transform hover:scale-110"
          aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorited ? (
            <AiFillHeart size={24} color="#ff3040" /> // Filled heart when favorited
          ) : (
            <AiOutlineHeart size={24} color="#ff3040" /> // Outline heart when not favorited
          )}
        </button>
      </div>

      <div className="flex justify-around font-semibold text-base h-[48px] items-center border-b border-gray-300">
        <div
          onClick={() => setPage("left")}
          className={`cursor-pointer text-center w-full py-2 ${
            page === "left" ? "border-b-4 border-blue-500 text-blue-500" : ""
          }`}
        >
          Personal
        </div>
        <div
          onClick={() => setPage("right")}
          className={`cursor-pointer text-center w-full py-2 ${
            page === "right" ? "border-b-4 border-blue-500 text-blue-500" : ""
          }`}
        >
          Teams
        </div>
      </div>

      <div className="px-16 py-4">
        <h3 className="font-serif font-bold text-2xl mb-2 max-w-[700px]">
          {page === "left"
            ? "Subscribe to SRM's top courses"
            : "Teams Plan for Businesses"}
        </h3>
        <p className="text-xs mb-4">
          {page === "left"
            ? "Get this course, plus 8,000+ of our top-rated courses with Personal Plan"
            : "Empower your team with unlimited access to 8,000+ courses"}
          <a href="#" className="underline text-blue-600 font-bold">
            Learn more
          </a>
        </p>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 font-semibold rounded-md mb-3"
          onClick={handleButtonClick}
        >
          {page === "left" ? "Start subscription" : "Get Team Plan"}
        </button>

        {!checkIsEnrolled() && (
          <>
            <div className="flex space-x-2 place-items-baseline mb-2">
              <p className="font-bold text-lg">${displayPrice}</p>
              {hasDiscount && (
                <>
                  <p className="line-through text-xs text-gray-400">
                    ${originalPrice}
                  </p>
                  <p className="text-xs text-green-600">{discountPercentage}% off</p>
                </>
              )}
            </div>
            
            {hasDiscount && (
              <div className="mb-2 px-2 py-1 bg-red-100 text-red-800 rounded inline-block text-xs font-semibold">
                Special Offer! {discountPercentage}% discount applied
              </div>
            )}
            
            <button
              onClick={onOpen}
              className="border-2 border-blue-600 text-blue-600 w-full py-2 text-sm font-bold rounded-md hover:bg-blue-50"
            >
              {buttonText}
            </button>
          </>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{res?.course?.title}</ModalHeader>
          <ModalBody>
            <Text fontSize="lg" fontWeight="bold">
              {res?.course?.title}
            </Text>

            {hasDiscount ? (
              <>
                <Text fontSize="xl" color="blue.600" fontWeight="bold">
                  ${displayPrice} <span className="line-through text-sm text-gray-400">${originalPrice}</span>
                </Text>
                <Text fontSize="sm" color="green.500" fontWeight="bold">
                  {discountPercentage}% discount applied
                </Text>
              </>
            ) : (
              <Text fontSize="xl" color="blue.600" fontWeight="bold">
                ${displayPrice}
              </Text>
            )}

            <Text mt={4} fontWeight="bold">
              Choose Payment Method:
            </Text>
            <Box display="flex" justifyContent="space-around" mt={2}>
              <Image
                src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square-1024x1024.png"
                alt="Momo"
                boxSize="50px"
                onClick={() => handlePaymentMethodSelect("momo")}
                cursor="pointer"
              />
              <Image
                src="https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg"
                alt="VNPay"
                boxSize="50px"
                onClick={() => handlePaymentMethodSelect("vnpay")}
                cursor="pointer"
              />
              <Image
                src="https://th.bing.com/th/id/OIP.wBKSzdf1HTUgx1Ax_EecKwHaHa?rs=1&pid=ImgDetMain"
                alt="PayPal"
                boxSize="50px"
                onClick={() => handlePaymentMethodSelect("paypal")}
                cursor="pointer"
              />
            </Box>

            {paymentMethod && (
              <Box mt={4} textAlign="center">
                <Image src={sectionImage} alt="QR Code" />
                <Text fontSize="sm">
                  Scan the QR code to complete your payment.
                </Text>
              </Box>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="green" onClick={handlePayment}>
              Pay Now
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {successDialogVisible && (
        <Box
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          textAlign="center"
          p={5}
          borderRadius="md"
          bg="green.200"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          zIndex="1000"
        >
          <Text fontSize="lg" fontWeight="bold" color="green.800">
            Payment Successful
          </Text>
          <Image
            src="https://www.nhahangquangon.com/wp-content/uploads/2020/10/icon-thanh-cong.png"
            alt="Success Icon"
            boxSize="80px"
            mt={2}
          />
        </Box>
      )}
    </div>
  );
};

export default SingleAbsolute;
