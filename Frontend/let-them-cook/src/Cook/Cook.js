import React, { useEffect } from "react";
import {
  AppBar,
  Avatar,
  Button,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import {
  Link,
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDishesByCook,
  toggleCreateDishForm,
  toggleAddDishToMealForm,
  resetCreateDishFormValues,
  fetchSchedulesByCook,
  getSchedules,
  toggleCreateMealScheduleForm,
  fetchMealsByCook,
  toggleUpdateDish,
  resetCurrentMeal,
  toggleUpdateMeal,
} from "./cookSlice";
import CreateMealForm from "./CreateMealForm";
import CreateDishForm from "./CreateDishForm";
import CookDashboardTabs from "./CookDashboardTabs";
import CreateMealScheduleForm from "./CreateMealScheduleForm";
import {
  cookInfo,
  fetchCookById,
  setCurrentUserRole,
} from "../Authentication/authSlice";

export default function Cook() {
  const schedules = useSelector(getSchedules);
  const cook = useSelector(cookInfo);
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams();

  const handleLogout = () => {
    dispatch(setCurrentUserRole(null));
    history.push("/");
  };

  const handleCreateDish = () => {
    dispatch(resetCreateDishFormValues());
    dispatch(toggleUpdateDish(false));
    dispatch(toggleCreateDishForm(true));
  };

  const handleCreateMeal = () => {
    dispatch(resetCurrentMeal());
    dispatch(toggleUpdateMeal(false));
    dispatch(toggleAddDishToMealForm(true));
  };

  const handleCreateSchedule = () => {
    dispatch(toggleCreateMealScheduleForm(true));
  };

  useEffect(() => {
    dispatch(fetchCookById({ id }));
    dispatch(fetchSchedulesByCook({ cookId: id }));
    dispatch(fetchDishesByCook({ cookId: id }));
    dispatch(fetchMealsByCook({ cookId: id }));
  }, [dispatch, id]);

  return (
    <div>
      <AppBar
        style={{ backgroundColor: "#fff", color: "#000" }}
        position="sticky"
      >
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Let Them Cook</Typography>
          <div style={{ display: "flex" }}>
            {schedules.length !== 0 && (
              <>
                <Button
                  variant="contained"
                  onClick={handleCreateSchedule}
                  style={{
                    marginRight: "1rem",
                    backgroundColor: "#000",
                    color: "#fff",
                  }}
                >
                  Create Schedule
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCreateMeal}
                  style={{
                    marginRight: "1rem",
                    backgroundColor: "#000",
                    color: "#fff",
                  }}
                >
                  Create Meal
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCreateDish}
                  style={{
                    marginRight: "1rem",
                    backgroundColor: "#000",
                    color: "#fff",
                  }}
                >
                  Create Dish
                </Button>
              </>
            )}
            <Tooltip title="User Profile">
              <Link to={`/cook/${id}/profile`}>
                <Avatar src={cook?.profilePhoto} alt="User" />
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
      {schedules.length === 0 ? <NoDishView /> : <CookDashboardTabs />}
      <CreateMealScheduleForm />
      <CreateDishForm />
      <CreateMealForm />
    </div>
  );
}

const NoDishView = () => {
  const dispatch = useDispatch();

  const toggleModal = () => {
    dispatch(toggleCreateMealScheduleForm(true));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "10rem",
      }}
    >
      <Typography>
        No Schedule have been created. Create a New Schedule
      </Typography>
      <IconButton>
        <AddCircleOutline
          onClick={toggleModal}
          style={{ width: "5rem", height: "5rem" }}
        />
      </IconButton>
    </div>
  );
};
