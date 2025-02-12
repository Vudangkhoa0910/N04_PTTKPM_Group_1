import React from "react";
import { Box, Grid, Heading, Link, Flex, Image, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Flex
      bg="#2c3e50" // Xanh than làm màu nền chủ đạo
      p={5}
      paddingBottom={{
        sm: "60px",
        md: "60px",
        lg: "20px",
      }}
      fontFamily="Source Sans 3"
      pt="60px"
      direction="column"
    >
      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)", 
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)", 
          lg: "repeat(4, 1fr)", 
        }}
        gap={4}
      >
        <Box
          pl={{
            lg: "25px",
            md: "15px",
            sm: "10px",
          }}
          pr={{
            lg: "35px",
            md: "15px",
            sm: "10px",
          }}
        >
          <Heading as="h6" size="md" fontWeight="bold" color="#e67e22"> {/* Cam cho tiêu đề */}
            Learn Something New
          </Heading>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">Learn a Language</Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">Learn Accounting</Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">Learn Coding</Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">Learn Copywriting</Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">Learn HR</Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">Learn Public Relations</Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">Boulder MS Data Science</Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">Illinois iMBA</Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">Illinois MS Computer Science</Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">UMich MS in Applied Data Science</Link>
        </Box>

        <Box
          pl={{
            lg: "25px",
            md: "15px",
            sm: "10px",
          }}
          pr={{
            lg: "35px",
            md: "15px",
            sm: "10px",
          }}
        >
          <Heading as="h6" size="md" fontWeight="bold" color="#e67e22"> {/* Cam cho tiêu đề */}
            Popular Topics
          </Heading>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">Accounting</Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">Cybersecurity</Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">Data Analysis</Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">Data Science</Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">Excel</Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">Google</Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">Machine Learning</Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">Project Management</Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">Python</Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">SQL</Link>
        </Box>

        <Box
          pl={{
            lg: "25px",
            md: "15px",
            sm: "10px",
          }}
          pr={{
            lg: "35px",
            md: "15px",
            sm: "10px",
          }}
        >
          <Heading as="h6" size="md" fontWeight="bold" color="#e67e22"> {/* Cam cho tiêu đề */}
            Popular Certificates
          </Heading>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">Google Data Analytics</Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">Google Digital Marketing & Ecommerce</Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">Google IT Automation with Python</Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">Google IT Support</Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">Google Project Management</Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">Google UX Design</Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">IBM Data Analyst</Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">IBM Data Science</Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">Intuit Bookkeeping</Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">Meta Front-End Developer</Link>
        </Box>

        {/* Các Box còn lại có thể làm tương tự, thay đổi màu sắc theo yêu cầu */}

        <Box
          pl={{
            lg: "25px",
            md: "15px",
            sm: "10px",
          }}
          pr={{
            lg: "35px",
            md: "15px",
            sm: "10px",
          }}
        >
          <Heading as="h6" size="md" fontWeight="bold" color="#e67e22">
            Featured Articles
          </Heading>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">
            A Comprehensive Guide to Becoming a Data Analyst
          </Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">
            Advance Your Career With A Cybersecurity Certification
          </Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">Get Your Data Analytics Certification</Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">
            How to Break into the Field of Data Analysis
          </Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">
            Jumpstart Your Data Career with a SQL Certification
          </Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">Learn How to Become PMP Certified</Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">
            Start Your Career with CAPM Certification
          </Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">
            Understanding the Role and Responsibilities of a Scrum Master
          </Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">
            Unlock Your Potential with a PMI Certification
          </Link>
          <br />
          <Link fontSize="13.5px" color="#95a5a6">
            What You Should Know About CompTIA A+ Certification
          </Link>
        </Box>
      </Grid>
      <Flex
        mt={15}
        gap={7}
        borderTop="1px solid #c9c9c9"
        direction={{
          sm: "column",
          md: "row",
          lg: "row",
        }}
        justifyContent={{
          lg: "space-between",
        }}
        alignItems="center"
        padding={{
          sm: "10px",
          md: "35px",
          lg: "55px",
        }}
        bg="#34495e" // Xanh than đậm cho nền của phần dưới cùng
      >
        <Box>
          <Text fontSize="13.5px" color="#ecf0f1">© 2025 EduPNK Inc. All rights reserved.</Text>
        </Box>
        <Flex spacing={4} overflow="hidden">
          <Image
            src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera_assets/footer/facebook.png?auto=format%2Ccompress&dpr=1&w=28&h=28&q=40"
            alt=""
            mr={4}
          />

          <Image
            src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera_assets/footer/linkedin.png?auto=format%2Ccompress&dpr=1&w=28&h=28&q=40"
            alt=""
            mr={4}
          />
          <Image
            src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera_assets/footer/twitter.png?auto=format%2Ccompress&dpr=1&w=28&h=28&q=40"
            alt=""
            mr={4}
          />
          <Image
            src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera_assets/footer/youtube.png?auto=format%2Ccompress&dpr=1&w=28&h=28&q=40"
            alt=""
            mr={4}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Footer;
