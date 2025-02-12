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
        const response = await fetch(`http://localhost:5001/enrollments?userId=${userId}`, {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`Error ${response.status}: Failed to fetch enrollments`);

        const data = await response.json();
        setEnrollments(data);

        const courseIds = [...new Set(data.map((en) => en.courseId))];
        const coursesData = await Promise.all(
          courseIds.map(async (id) => {
            const res = await fetch(`http://localhost:5001/videos/courseVideos/${id}`, {
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
              },
            });

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
    <div className="mt-32 min-h-screen flex flex-col">
      <Navbar />
      <div className="mb-32 container mx-auto px-4 flex-grow">
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">User Enrollments</h2>
        {loading && <p className="text-center text-gray-600">Loading...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}

        {enrollments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-blue-600 text-white text-left">
                <tr>
                  <th className="py-3 px-5">Course</th>
                  <th className="py-3 px-5">Price</th>
                  <th className="py-3 px-5">Payment</th>
                  <th className="py-3 px-5">Date</th>
                </tr>
              </thead>
              <tbody>
                {enrollments
                  .filter((enrollment) => enrollment.userId._id === userId)
                  .map((enrollment) => {
                    const course = courses[enrollment.courseId] || {};
                    return (
                      <tr key={enrollment._id} className="border-b hover:bg-gray-100">
                        <td className="py-3 px-5">{course.title}</td>
                        <td className="py-3 px-5">${enrollment.price}</td>
                        <td className="py-3 px-5 text-center">
                          {paymentLogos[enrollment.paymentMethod] ? (
                            <img
                              src={paymentLogos[enrollment.paymentMethod]}
                              alt={enrollment.paymentMethod}
                              className="w-10 mx-5"
                            />
                          ) : (
                            enrollment.paymentMethod
                          )}
                        </td>
                        <td className="py-3 px-5">{new Date(enrollment.enrollmentDate).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-600">No enrollments found.</p>
        )}
      </div>
      <div className="mt-32">
        <Footer />
      </div>
    </div>
  );
};

export default Enrollments;
