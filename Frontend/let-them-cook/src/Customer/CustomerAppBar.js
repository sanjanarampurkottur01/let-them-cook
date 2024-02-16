import React from "react";
import {
  AppBar,
  Badge,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ViewListIcon from "@mui/icons-material/ViewList";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Link,
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMealsInCartCount } from "./customerSlice";
import { setCurrentUserRole } from "../Authentication/authSlice";

export default function CustomerAppBar() {
  const mealsInCartCount = useSelector(getMealsInCartCount);
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams();

  const handleLogout = () => {
    dispatch(setCurrentUserRole(null));
    history.push("/");
  };

  return (
    <AppBar style={{ backgroundColor: "#fff", color: "#000" }}>
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <Link
          to={`/customer/${id}`}
          style={{ textDecoration: "none", color: "#000" }}
        >
          <Typography variant="h6" component="div">
            Let Them Cook
          </Typography>
        </Link>
        <div style={{ display: "flex" }}>
          <Tooltip title="Order History">
            <Link to={`/customer/${id}/order-history`}>
              <IconButton onClick={handleLogout}>
                <ViewListIcon style={{ color: "#000" }} />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip title="Meal Cart">
            <Link to={`/customer/${id}/cart`}>
              <IconButton onClick={handleLogout}>
                <Badge badgeContent={mealsInCartCount} color="primary">
                  <ShoppingCartIcon style={{ color: "#000" }} />
                </Badge>
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip title="Logout">
            <IconButton onClick={handleLogout}>
              <LogoutIcon style={{ color: "#000" }} />
            </IconButton>
          </Tooltip>
        </div>
      </Toolbar>
    </AppBar>
  );
}
