import "./App.css";
import CookSignUp from "./Authentication/CookSignUp";
import CustomerSignUp from "./Authentication/CustomerSignUp";
import Login from "./Authentication/Login";
import Admin from "./Admin/Admin";
import Cook from "./Cook/Cook";
import CustomerDashboard from "./Customer/CustomerDashboard";
import CookProfile from "./Cook/CookProfile";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Redirect } from "react-router-dom/cjs/react-router-dom";
import { useSelector } from "react-redux";
import {
  getCurrentUserInfo,
  getCurrentUserRole,
} from "./Authentication/authSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TiffinServiceStorePage from "./Customer/TiifinServiceStorePage";
import MealCart from "./Customer/MealCart";
import OrderHistory from "./Customer/OrderHistory";

function App() {
  const loggedInUserRole = useSelector(getCurrentUserRole);
  const loggedInUserInfo = useSelector(getCurrentUserInfo);

  return (
    <Router>
      <Switch>
        <Route exact path="/cook/signup">
          {" "}
          <CookSignUp />{" "}
        </Route>
        <Route exact path="/customer/signup">
          {" "}
          <CustomerSignUp />{" "}
        </Route>
        <Route exact path="/cook/:id/profile">
          {" "}
          <CookProfile />{" "}
        </Route>
        <Route exact path="/cook/:id">
          {" "}
          <Cook />{" "}
        </Route>
        <Route exact path="/customer/:id/order-history">
          {" "}
          <OrderHistory />{" "}
        </Route>
        <Route exact path="/customer/:id/store">
          {" "}
          <TiffinServiceStorePage />{" "}
        </Route>
        <Route exact path="/customer/:id/cart">
          {" "}
          <MealCart />{" "}
        </Route>
        <Route path="/customer/:id">
          {" "}
          <CustomerDashboard />{" "}
        </Route>
        <Route path="/admin">
          {" "}
          <Admin />{" "}
        </Route>
        {loggedInUserRole != null && (
          <Redirect
            to={
              loggedInUserRole === "admin"
                ? "/admin"
                : loggedInUserRole === "cook"
                ? `/cook/${loggedInUserInfo.id}`
                : `/customer/${loggedInUserInfo.id}`
            }
          />
        )}
        <Route exact path="/">
          <Login />
        </Route>
      </Switch>
      <ToastContainer autoClose={3000} position="bottom-center" theme="dark" />
    </Router>
  );
}

export default App;
