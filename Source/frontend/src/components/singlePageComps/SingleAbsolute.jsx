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

const SingleAbsolute = ({ props }) => {
  const [page, setPage] = useState("left");
  const [random, setRandom] = useState(0);
  const { price, img } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [canNavigate, setCanNavigate] = useState(false); // Trạng thái để kiểm tra xem có thể điều hướng không
  const [successDialogVisible, setSuccessDialogVisible] = useState(false); // Trạng thái để hiển thị dialog thành công
  const [isCourseBought, setIsCourseBought] = useState(false); // Trạng thái để kiểm tra xem khóa học đã được mua chưa
  const navigate = useNavigate();
  const courseName =
    page === "left" ? "Personal Plan Course" : "Teams Plan Course";

  const [res, setRes] = useState({});
  const { id } = useParams(); // Lấy id từ URL
  const userStore = useSelector((store) => store.UserReducer);
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

  useEffect(() => {
    setRandom((Math.random() * 20).toFixed());
  }, []);

  const displayPrice = page === "left" ? price : (price * 1.2).toFixed(2);
  const originalPrice = ((displayPrice * (+random + 100)) / 100).toFixed(2);

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      console.error("No payment method selected");
      return; // Ngừng nếu chưa chọn phương thức thanh toán
    }
  
    onClose();
    setIsPaymentSuccess(true);
  
    // Sau khi thanh toán thành công, cho phép điều hướng
    setCanNavigate(true);
  
    // Đánh dấu khóa học đã được mua
    setIsCourseBought(true);
  
    // Lấy userId từ localStorage
    const userData = JSON.parse(localStorage.getItem("user"));
    const userId = userData?.userId;
    
    if (!userId) {
      console.error("User ID not found in localStorage");
      return; // Ngừng nếu không có userId
    }
  
    // Lấy courseId từ response
    const courseId = res?.course?._id;
    if (!courseId) {
      console.error("Course ID is missing");
      return; // Ngừng nếu không có courseId
    }
  
    const price = displayPrice; // Lấy giá của khóa học
  
    try {
      const response = await fetch("http://localhost:5001/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, courseId, price, paymentMethod }),
      });
  
      // Kiểm tra phản hồi
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Enrollment failed:", errorData);
        return;
      }
  
      const data = await response.json();
      console.log("Enrollment successful:", data); // Log dữ liệu trả về từ server
  
      // Xử lý thông báo thành công
      setSuccessDialogVisible(true);
      setTimeout(() => {
        setSuccessDialogVisible(false); // Ẩn dialog sau 10 giây
      }, 1000);
  
    } catch (error) {
      console.error("Error during payment and enrollment:", error);
    }
  };
  
  
  // Hàm điều hướng khi nhấn nút
  const handleButtonClick = () => {
    if (canNavigate) {
      const firstVideoLink =
        res?.course?.videos?.length > 0 ? res?.course?.videos[0]?.link : null;
      // Nếu thanh toán thành công và có thể điều hướng, điều hướng đến trang video
      navigate(
        `/video-detail/?courseId=${res?.course?._id}&url=${encodeURIComponent(
          // "https://www.youtube.com/embed/0qhZJsVX7rg"
          firstVideoLink
        )}`
      );
    } else {
      // Nếu chưa thanh toán thành công, mở modal thanh toán
      onOpen();
    }
  };

  return (
    <div className="xl:border xl:border-gray-300 text-white xl:text-black xl:max-w-[800px] xl:shadow-lg shadow-neutral-800 xl:bg-white rounded-lg overflow-hidden">
      <div>
        <Image
          src={img}
          className="w-full h-[300px] object-cover"
          alt="Course Thumbnail"
        />
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
        {
          // Ẩn nút "Buy this course" khi khóa học đã được mua
          !isCourseBought && (
            <div className="flex space-x-2 place-items-baseline mb-2">
              <p className="font-bold text-lg">${displayPrice}</p>
              <p className="line-through text-xs text-gray-400">
                ${originalPrice}
              </p>
              <p className="text-xs text-green-600">{random}% off</p>
            </div>
          )
        }

        {
          // Ẩn nút "Buy this course" khi khóa học đã được mua
          !isCourseBought && (
            <button
              onClick={onOpen}
              className="border-2 border-blue-600 text-blue-600 w-full py-2 text-sm font-bold rounded-md hover:bg-blue-50"
            >
              {page === "left" ? "Buy this course" : "Contact Sales"}
            </button>
          )
        }
      </div>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{res?.course?.title}</ModalHeader>
          <ModalBody>
            <Text fontSize="lg" fontWeight="bold">
              {courseName}
            </Text>
            <Text fontSize="xl" color="blue.600" fontWeight="bold">
              ${displayPrice}
            </Text>

            <Text mt={4} fontWeight="bold">
              Choose Payment Method:
            </Text>
            <Box display="flex" justifyContent="space-around" mt={2}>
              <Image
                src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square-1024x1024.png"
                alt="Momo"
                boxSize="50px"
                onClick={() => handlePaymentMethodSelect("momo")}
              />
              <Image
                src="https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg"
                alt="VNPay"
                boxSize="50px"
                onClick={() => handlePaymentMethodSelect("vnpay")}
              />
              <Image
                src="https://th.bing.com/th/id/OIP.wBKSzdf1HTUgx1Ax_EecKwHaHa?rs=1&pid=ImgDetMain"
                alt="PayPal"
                boxSize="50px"
                onClick={() => handlePaymentMethodSelect("paypal")}
              />
            </Box>

            {paymentMethod === "momo" && (
              <Box mt={4} textAlign="center">
                <Image src={sectionImage} alt="QR Code" />
                <Text fontSize="sm">
                  Scan the QR code to complete your payment.
                </Text>
              </Box>
            )}
            {paymentMethod === "vnpay" && (
              <Box mt={4} textAlign="center">
                <Image src={sectionImage} alt="QR Code" />
                <Text fontSize="sm">
                  Scan the QR code to complete your payment.
                </Text>
              </Box>
            )}
            {paymentMethod === "paypal" && (
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
