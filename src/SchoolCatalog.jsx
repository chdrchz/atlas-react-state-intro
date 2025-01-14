import { useEffect, useState } from "react";

export default function SchoolCatalog() {
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");

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
    setSort(!sort);
    console.log("Reversed order");
  };

  return (
    <div className="school-catalog">
      <h1>School Catalog</h1>
      <input
        type="text"
        placeholder="Search"
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
          {filteredCourses.map((course) => (
            <tr key={course.id}>
              <td>{course.trimester}</td>
              <td>{course.courseNumber}</td>
              <td>{course.courseName}</td>
              <td>{course.semesterCredits}</td>
              <td>{course.totalClockHours}</td>
              <td>
                <button>Enroll</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button>Previous</button>
        <button>Next</button>
      </div>
    </div>
  );
}
