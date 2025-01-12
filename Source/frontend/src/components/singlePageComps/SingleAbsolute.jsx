import { Box, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SingleAbsolute = ({ props }) => {
  const [page, setPage] = useState("left");
  const [random, setRandom] = useState(0);

  const { onOpen, price, img } = props;

  function handlePayment() {
    onOpen();
  }
  useEffect(() => {
    setRandom((Math.random() * 20).toFixed());
  }, []);

  return (
    <div className="xl:border xl:border-gray-300 text-white xl:text-black xl:max-w-[280px] xl:shadow-lg shadow-neutral-800 xl:bg-white rounded-lg overflow-hidden">
      <div>
        <Image src={img} className="w-full" alt="Course Thumbnail" />
      </div>

      <div className="flex justify-around font-semibold text-sm h-[48px] items-center border-b border-gray-300">
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

      <div className="px-6 py-4">
        <h3 className="font-serif font-bold text-lg mb-2 max-w-[250px]">
          Subscribe to SRM's top courses
        </h3>
        <p className="text-xs mb-4">
          Get this course, plus 8,000+ of our top-rated courses with Personal
          Plan{" "}
          <a href="#" className="underline text-blue-600 font-bold">
            Learn more
          </a>
        </p>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 font-semibold rounded-md mb-3"
          onClick={handlePayment}
        >
          Start subscription
        </button>

        <div className="w-full justify-center items-center flex flex-col space-y-[8px] text-xs text-gray-500 mb-4">
          <p>Starting at ₹750 per month</p>
          <p>Cancel anytime</p>
        </div>

        <div className="flex items-center justify-center my-3">
          <div className="h-[1px] bg-gray-300 w-full"></div>
          <p className="text-xs mx-2 text-gray-400">or</p>
          <div className="h-[1px] bg-gray-300 w-full"></div>
        </div>

        <div className="flex space-x-2 place-items-baseline mb-2">
          <p className="font-bold text-lg">₹{price}</p>
          <p className="line-through text-xs text-gray-400">
            ₹{((price * (+random + 100)) / 100).toFixed()}
          </p>
          <p className="text-xs text-green-600">{random} off</p>
        </div>

        <div className="flex text-red-600 items-baseline space-x-1 my-2 text-xs font-bold">
          {/* <BsStopwatchFill/> */}
          <p>52 minutes</p>
          <p>left at this price!</p>
        </div>

        <Box className="my-2">
          <Text>{/* Thêm nội dung tùy chỉnh tại đây */}</Text>
        </Box>

        <button
          onClick={handlePayment}
          className="border-2 border-blue-600 text-blue-600 w-full py-2 text-sm font-bold rounded-md hover:bg-blue-50"
        >
          Buy this course
        </button>

        <div className="items-center text-xs space-y-1 w-full justify-center flex flex-col py-2 text-gray-500">
          <p>30-Day Money-Back Guarantee</p>
          <p>Full Lifetime Access</p>
        </div>

        <div className="flex justify-around text-xs font-bold text-blue-600 underline underline-offset-2 pb-7">
          <div>
            <Link to="#">Share</Link>
          </div>
          <div>
            <Link to="#">Gift this course</Link>
          </div>
          <div>
            <Link to="#">Apply Coupon</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleAbsolute;
