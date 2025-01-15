import React, { createContext, useState, useContext } from "react";

import SchoolCatalog from "./SchoolCatalog";
import Header from "./Header";
import ClassSchedule from "./ClassSchedule";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const enrollInCourse = (course) => {
    setEnrolledCourses([...enrolledCourses, course]);
  };

  const dropCourse = (courseNumber) => {
    setEnrolledCourses(
      enrolledCourses.filter((course) => course.courseNumber !== courseNumber)
    );
  };

  return (
    <AppContext.Provider
      value={{ enrolledCourses, enrollInCourse, dropCourse }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);

export default function App() {
  return (
    <div>
      <AppProvider>
        <Header />
        <SchoolCatalog />
        <ClassSchedule />
      </AppProvider>
    </div>
  );
}
