import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../UserComponents/UserNavbar";
import Footer from "../../Pages/Footer";

const paymentLogos = {
  momo: "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square-1024x1024.png",
  vnpay: "https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg",
  paypal: "https://th.bing.com/th/id/OIP.wBKSzdf1HTUgx1Ax_EecKwHaHa?rs=1&pid=ImgDetMain",
};

const Enrollments = () => {
  const userStore = useSelector((store) => store.UserReducer);
  const userId = userStore?.userId;
  const token = userStore?.token;

  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        if (!response.ok)
          throw new Error(`Error ${response.status}: Failed to fetch enrollments`);

        const data = await response.json();
        setEnrollments(data);

        const courseIds = [...new Set(data.map((en) => en.courseId))];
        const coursesData = await Promise.all(
          courseIds.map(async (id) => {
            const res = await fetch(
              `http://localhost:5001/videos/courseVideos/${id}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  authorization: `Bearer ${token}`,
                },
              }
            );

            if (!res.ok) return null;
            const courseData = await res.json();
            return { id, title: courseData?.course?.title || "Unknown" };
          })
        );

        const coursesMap = coursesData.reduce((acc, course) => {
          if (course) acc[course.id] = course;
          return acc;
        }, {});

        setCourses(coursesMap);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [userId, token]);

  return (
    <div style={{ marginTop: "100px" }}>
      <Navbar />
      <div style={{ maxWidth: "80%", margin: "auto", padding: "30px", background: "#fff", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)", marginBottom: "50px" }}>
        <h2 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>User Enrollments</h2>

        {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
        {error && <p style={{ color: "red", textAlign: "center" }}>Error: {error}</p>}

        {enrollments.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse", borderRadius: "10px", overflow: "hidden" }}>
            <thead>
              <tr style={{ background: "#007bff", color: "#fff", textAlign: "center" }}>
                <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Course</th>
                <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Price</th>
                <th style={{ padding: "12px", borderBottom: "2px solid #ddd", textAlign: "center"}}>Payment</th>
                <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {enrollments
                .filter((enrollment) => enrollment.userId._id === userId)
                .map((enrollment) => {
                  const course = courses[enrollment.courseId] || {};
                  return (
                    <tr key={enrollment._id} style={{ background: "#f9f9f9", textAlign: "center" }}>
                      <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>{course.title}</td>
                      <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>${enrollment.price}</td>
                      <td style={{ 
                        padding: "12px", 
                        borderBottom: "1px solid #ddd", 
                        paddingLeft: "50px",
                        textAlign: "right", 
                        width: "150px" 
                      }}>
                        {paymentLogos[enrollment.paymentMethod] ? (
                          <img src={paymentLogos[enrollment.paymentMethod]} alt={enrollment.paymentMethod} width="50px" />
                        ) : (
                          enrollment.paymentMethod
                        )}
                      </td>
                      <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>{new Date(enrollment.enrollmentDate).toUTCString()}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: "center" }}>No enrollments found.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Enrollments;
