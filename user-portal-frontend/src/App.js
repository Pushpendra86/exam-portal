import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoginPage from "./components/pages/loginPage/loginPage";
import StudentHomepage from "./components/pages/studentHomepage/studentHomepage";
import TeacherHomepage from "./components/pages/teacherHomepage/teacherHomepage";
import StudentRegisterPage from "./components/pages/studentRegisterPage/studentRegisterPage";
import TestPage from "./components/pages/TakeTest/TestPage";
import Auth from "./helper/Auth";
import { getUserDetails } from "./redux/actions/loginAction";

function HomeRoute() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const token = Auth.retriveToken();

  useEffect(() => {
    if (token && token !== "undefined" && !user.isLoggedIn) {
      dispatch(getUserDetails());
    }
  }, [dispatch, token, user.isLoggedIn]);

  if (!token || token === "undefined") {
    return <Navigate to="/" replace />;
  }

  if (!user.isLoggedIn) {
    return <div>Loading your dashboard...</div>;
  }

  return user.userDetails.type === "TEACHER" ? (
    <Navigate to="/homeTeacher" replace />
  ) : (
    <Navigate to="/homeStudent" replace />
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LoginPage />} />
        <Route exact path="/home" element={<HomeRoute />} />
        <Route exact path="/homeStudent" element={<StudentHomepage />} />
        <Route exact path="/homeTeacher" element={<TeacherHomepage />} />
        <Route
          exact
          path="/studentRegisterPage"
          element={<StudentRegisterPage />}
        />
        <Route exact path="/takeTestPage" element={<TestPage />} />
      </Routes>
    </Router>
  );
}

export default App;
