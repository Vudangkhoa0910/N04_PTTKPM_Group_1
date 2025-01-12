import {
  Flex,
  Text,
  Link,
  Image,
  useBreakpointValue,
} from "@chakra-ui/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Section2 = () => {
  const columnCount = useBreakpointValue({ sm: 2, md: 4, lg: 6 });

  // Cấu hình carousel
  const settings = {
    dots: true, // Nút chuyển Slide (mấy cái chấm chấm)
    infinite: true, 
    speed: 500, 
    slidesToShow: columnCount, 
    slidesToScroll: 1, 
    autoplay: true, 
    autoplaySpeed: 1500, 
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Flex
      direction="column"
      gap={6}
      bg="#f5f5f5"
      p={10}
      justifyContent="center"
      alignItems="center"
    >
      <Text
        fontSize={{
          lg: "2xl",
          sm: "l",
          md: "xl",
        }}
      >
        We collaborate with{" "}
        <Link color="#FF9900" href="#" fontWeight="bold">
          300+ leading universities and companies
        </Link>
      </Text>

      {/* Carousel */}
      <Slider {...settings} style={{ width: "100%" }}>
        <Flex justify="center" align="center" p={4}>
          <Image
            src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/wp1lcwdav1p1/77hmeEJo3ZPlURCU02fD52/aa37b7f7b52285ba350acac62d8af5c1/illinois-3.png?auto=format%2Ccompress&dpr=1&w=&h=32"
            alt="Illinois Logo"
            objectFit="contain"
          />
        </Flex>
        <Flex justify="center" align="center" p={4}>
          <Image
            src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/wp1lcwdav1p1/6XkOucZz6pMLV5DPvXCgCL/1777129a58b0a62b237bd28e9956afe8/duke-3.png?auto=format%2Ccompress&dpr=1&w=&h=32"
            alt="Duke Logo"
            objectFit="contain"
          />
        </Flex>
        <Flex justify="center" align="center" p={4}>
          <Image
            src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/wp1lcwdav1p1/1c6RjBHi3Lqb9QpWxje7iA/b529f909c5230af3210ba2d47d149620/google.png?auto=format%2Ccompress&dpr=1&w=&h=37"
            alt="Google Logo"
            objectFit="contain"
          />
        </Flex>
        <Flex justify="center" align="center" p={4}>
          <Image
            src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/wp1lcwdav1p1/60SA8pGxPXMmJf4n7umK1H/ccec31bbe2358210bf8391dcba6cd2f1/umich.png?auto=format%2Ccompress&dpr=1&w=&h=55"
            alt="UMich Logo"
            objectFit="contain"
          />
        </Flex>
        <Flex justify="center" align="center" p={4}>
          <Image
            src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/wp1lcwdav1p1/3toC4I7jbWxiedfxiyNjtT/735faeaf976a9692f425f8c3a7d125dc/1000px-IBM_logo.svg.png?auto=format%2Ccompress&dpr=1&w=&h=32"
            alt="IBM Logo"
            objectFit="contain"
          />
        </Flex>
        <Flex justify="center" align="center" p={4}>
          <Image
            src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/wp1lcwdav1p1/FHOd44z40jTFsSSao84AM/d1e357f5650a23bf2936114112d44445/imperial.png?auto=format%2Ccompress&dpr=1&w=&h=35"
            alt="Imperial College Logo"
            objectFit="contain"
          />
        </Flex>
        <Flex justify="center" align="center" p={4}>
          <Image
            src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/wp1lcwdav1p1/4FSFmNXuDIzTvFb7n0v4mK/704ae9e0a7981fb6415f4cb4609bbbb3/stanford.svg?auto=format%2Ccompress&dpr=1&w=&h=27"
            alt="Stanford Logo"
            objectFit="contain"
          />
        </Flex>
        <Flex justify="center" align="center" p={4}>
          <Image
            src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/wp1lcwdav1p1/1ZeiauXe5bPProvfuIo7o2/55d005d42979ab585cdfa01f825b7d4f/penn.svg?auto=format%2Ccompress&dpr=1&w=&h=37"
            alt="Penn Logo"
            objectFit="contain"
          />
        </Flex>
      </Slider>
    </Flex>
  );
};

export default Section2;