import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Avatar,
  Paper,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDishesByMeal,
  getMealsByDinnerSchedule,
  getMealsByLunchSchedule,
  getScheduleCalendarDays,
  setMealForDish,
  toggleOpenDishesByMealDialog,
} from "../Cook/cookSlice";
import { DishesByMeals } from "../Cook/MealsView";
import { addMealsInCart } from "./customerSlice";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const currentDate = new Date();

const getFormattedDate = (date) => {
  const day = date.getDate();
  const daySuffix =
    day > 3 && day < 21 ? "th" : ["st", "nd", "rd"][(day % 10) - 1] || "th";
  return `${day}${daySuffix}`;
};

export default function StoreMealSchedule() {
  const calendarDays = useSelector(getScheduleCalendarDays);
  const mealsByLunchSchedule = useSelector(getMealsByLunchSchedule);
  const mealsByDinnerSchedule = useSelector(getMealsByDinnerSchedule);

  return (
    <Paper elevation={5}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell colSpan={8}>
                <Typography variant="h5">
                  {calendarDays[0]?.toLocaleString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              {calendarDays.map((day) => (
                <TableCell
                  key={day.toDateString()}
                  colSpan={1}
                  className={
                    day.toDateString() === currentDate.toDateString()
                      ? "todayCell"
                      : ""
                  }
                  align="center"
                >
                  <Typography variant="body1">
                    {getFormattedDate(day)} {daysOfWeek[day.getDay()]}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>LUNCH</TableCell>
              {calendarDays.map((day, index) => (
                <>
                  <TableCell
                    key={day.toDateString()}
                    className={
                      day.toDateString() === currentDate.toDateString()
                        ? "todayCell"
                        : ""
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      {mealsByLunchSchedule[day.getDate()] == null ? (
                        <Typography>No Meal Present</Typography>
                      ) : (
                        <Meal
                          day={day.getDate()}
                          meals={mealsByLunchSchedule}
                        />
                      )}
                    </div>
                  </TableCell>
                </>
              ))}
            </TableRow>
            <TableRow>
              <TableCell>DINNER</TableCell>
              {calendarDays.map((day, index) => (
                <>
                  <TableCell
                    key={day.toDateString()}
                    className={
                      day.toDateString() === currentDate.toDateString()
                        ? "todayCell"
                        : ""
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      {mealsByDinnerSchedule[day.getDate()] == null ? (
                        <Typography>No Meal Added</Typography>
                      ) : (
                        <Meal
                          day={day.getDate()}
                          meals={mealsByDinnerSchedule}
                        />
                      )}
                    </div>
                  </TableCell>
                </>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <DishesByMeals />
    </Paper>
  );
}

function Meal({ day, meals }) {
  const dispatch = useDispatch();

  const onClick = async (e, meal) => {
    dispatch(setMealForDish(meal));
    await dispatch(fetchDishesByMeal({ id: meal.id }));
    dispatch(toggleOpenDishesByMealDialog(true));
  };

  const handleAddToMeal = (e, meal) => {
    e.stopPropagation();
    dispatch(addMealsInCart(meal));
  };

  return meals[day].map((meal) => (
    <Paper
      elevation={5}
      key={meal.id}
      style={{
        width: "10rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "3px",
      }}
      onClick={(e) => onClick(e, meal)}
    >
      <Avatar src={meal.image} style={{ width: "5rem", height: "5rem" }} />
      <Typography style={{ textAlign: "center" }}>{meal.name}</Typography>
      <Button
        onClick={(e) => handleAddToMeal(e, meal)}
        variant="contained"
        style={{
          backgroundColor: "#000",
          marginBottom: "0.5rem",
        }}
      >
        Add to Cart
      </Button>
    </Paper>
  ));
}
