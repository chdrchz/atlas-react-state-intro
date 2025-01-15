import { useEffect, useState } from "react";
import { useAppContext } from "./App";

const PAGE_SIZE = 5;

export default function SchoolCatalog() {
  const { enrolledCourses, enrollInCourse } = useAppContext();
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses.json");
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(
    (course) =>
      course.courseNumber.toLowerCase().includes(filter.toLowerCase()) ||
      course.courseName.toLowerCase().includes(filter.toLowerCase())
  );

  const handleSort = (columnName) => {
    const sortedCourses = [...courses].sort((a, b) => {
      if (sort) {
        return a[columnName] > b[columnName] ? 1 : -1;
      } else {
        return a[columnName] < b[columnName] ? 1 : -1;
      }
    });
    setCourses(sortedCourses);
    setSort(!sort); // This is direction
  };

  const currentCourses = filteredCourses.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const hasMore = filteredCourses.length > page * PAGE_SIZE;
  const hasLess = page > 1;

  const handleEnroll = (course) => {
    const alreadyEnrolled = enrolledCourses.some(
      (enrolled) => enrolled.courseNumber === course.courseNumber
    );

    if (!alreadyEnrolled) {
      enrollInCourse({
        id: course.id,
        trimester: course.trimester,
        courseNumber: course.courseNumber,
        courseName: course.courseName,
        semesterCredits: course.semesterCredits,
        totalClockHours: course.totalClockHours,
      });
    }
  };

  useEffect(() => {
    setPage(1);
  }, [filter]);

  return (
    <div className="school-catalog">
      <h1>School Catalog</h1>
      <input
        type="text"
        placeholder="Search"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("trimester")}>Trimester</th>
            <th onClick={() => handleSort("courseNumber")}>Course Number</th>
            <th onClick={() => handleSort("courseName")}>Course Name</th>
            <th onClick={() => handleSort("semesterCredits")}>
              Semester Credits
            </th>
            <th onClick={() => handleSort("totalClockHours")}>
              Total Clock Hours
            </th>
            <th>Enroll</th>
          </tr>
        </thead>
        <tbody>
          {currentCourses.map((course) => (
            <tr key={course.id}>
              <td>{course.trimester}</td>
              <td>{course.courseNumber}</td>
              <td>{course.courseName}</td>
              <td>{course.semesterCredits}</td>
              <td>{course.totalClockHours}</td>
              <td>
                <button
                  onClick={() => handleEnroll(course)}
                  disabled={enrolledCourses.some(
                    (enrolled) => enrolled.courseNumber === course.courseNumber
                  )}
                >
                  {enrolledCourses.some(
                    (enrolled) => enrolled.courseNumber === course.courseNumber
                  )
                    ? "Enrolled"
                    : "Enroll"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button disabled={!hasLess} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <button disabled={!hasMore} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
