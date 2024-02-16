import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  addMealToSchedule,
  getMealDate,
  getMealImage,
  getMealMaxOrderLimit,
  getMealName,
  getMealOrderDeadline,
  getMealPrice,
  getMealSchedule,
  getMealSlot,
  getOpenAddDishToMealForm,
  getSchedules,
  getUpdateMeal,
  setMealDate,
  setMealImage,
  setMealMaxOrderLimit,
  setMealName,
  setMealOrderDeadline,
  setMealPrice,
  setMealSchedule,
  setMealSlot,
  toggleAddDishToMealForm,
  updateMealToSchedule,
} from "./cookSlice";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import moment from "moment";

const currentDate = new Date();
const calendarDays = Array.from({ length: 7 }, (_, index) => {
  const startDate = new Date(currentDate);
  startDate.setDate(currentDate.getDate() - currentDate.getDay());
  const day = new Date(startDate);
  day.setDate(startDate.getDate() + index);
  return day;
});

export default function CreateMealForm() {
  const open = useSelector(getOpenAddDishToMealForm);
  const schedules = useSelector(getSchedules);
  const mealMaxOrderLimit = useSelector(getMealMaxOrderLimit);
  const mealOrderDeadline = useSelector(getMealOrderDeadline);
  const mealSlot = useSelector(getMealSlot);
  const mealDate = useSelector(getMealDate);
  const mealName = useSelector(getMealName);
  const mealPrice = useSelector(getMealPrice);
  const mealImage = useSelector(getMealImage);
  const mealSchedule = useSelector(getMealSchedule);
  const updateMeal = useSelector(getUpdateMeal);
  const dispatch = useDispatch();
  const currentDate = new Date();
  const { id } = useParams();

  const toggleModal = () => {
    dispatch(toggleAddDishToMealForm(!open));
  };

  const getFullDate = (date) => {
    const fullDate = moment(date).format("YYYY-MM-DD");
    return fullDate;
  };

  const handleMealNameChange = (e) => {
    dispatch(setMealName(e.target.value));
  };

  const handleMealPriceChange = (e) => {
    dispatch(setMealPrice(e.target.value));
  };

  const handleMealImageChange = (e) => {
    dispatch(setMealImage(e.target.files));
  };

  const handleMealMaxOrderLimitChange = (e) => {
    dispatch(setMealMaxOrderLimit(e.target.value));
  };

  const handleMealOrderDeadlineChange = (e) => {
    dispatch(setMealOrderDeadline(e.target.value));
  };

  const handleMealDateChange = (e) => {
    dispatch(setMealDate(e.target.value));
  };

  const handleMealSlotChange = (e) => {
    dispatch(setMealSlot(e.target.value));
  };

  const handleMealScheduleChange = (e) => {
    dispatch(setMealSchedule(e.target.value));
  };

  const getWeekDate = (scheduleStartDate) => {
    const date = new Date(scheduleStartDate);
    const startDate = moment.utc(date).format("YYYY/MM/DD");
    const endDate = moment.utc(date).add(6, "d").format("YYYY/MM/DD");
    return `${startDate} - ${endDate}`;
  };

  const getFormattedDate = (formatDate) => {
    const date = new Date(formatDate);
    const formattedDate = moment.utc(date).format("YYYY-MM-DD hh:mm:ss");
    return formattedDate;
  };

  const handleCreateMeal = () => {
    const selectedSchedule = schedules.find(
      (schedule) => schedule.name === mealSchedule
    );

    dispatch(
      addMealToSchedule({
        mealDate: getFormattedDate(mealDate),
        mealName,
        mealPrice,
        mealMaxOrderLimit,
        mealOrderDeadline: getFormattedDate(mealOrderDeadline),
        mealSlot,
        scheduleId: selectedSchedule?.id,
        mealImage,
        cookId: id,
      })
    );
    dispatch(toggleAddDishToMealForm(false));
  };

  const handleUpdateMeal = () => {
    const selectedSchedule = schedules.find(
      (schedule) => schedule.name === mealSchedule
    );

    dispatch(
      updateMealToSchedule({
        mealDate: getFormattedDate(mealDate),
        mealName,
        mealPrice,
        mealMaxOrderLimit,
        mealOrderDeadline: getFormattedDate(mealOrderDeadline),
        mealSlot,
        scheduleId: selectedSchedule?.id,
        mealImage,
        cookId: id,
      })
    );
    dispatch(toggleAddDishToMealForm(false));
  };

  return (
    <Dialog open={open} onClose={toggleModal}>
      <DialogTitle>{updateMeal ? "Update Meal" : "Create a Meal"}</DialogTitle>
      <DialogContent style={{ display: "flex", flexDirection: "column" }}>
        <TextField
          value={mealName}
          onChange={handleMealNameChange}
          id="mealName"
          label="Meal Name"
          fullWidth
          variant="standard"
        />
        <TextField
          value={mealMaxOrderLimit}
          onChange={handleMealMaxOrderLimitChange}
          id="maxOrderLimit"
          label="Max Order Limit"
          fullWidth
          variant="standard"
          sx={{ marginTop: "1rem" }}
        />
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography>Meal Date</Typography>
          <input
            type="date"
            min={getFullDate(
              currentDate.toDateString() === calendarDays[0].toDateString()
                ? calendarDays[0]
                : currentDate
            )}
            value={mealDate}
            onChange={handleMealDateChange}
          />
        </div>
        <Typography style={{ marginTop: "1rem" }}>Order Deadline</Typography>
        <Input
          type="datetime-local"
          value={mealOrderDeadline}
          onChange={handleMealOrderDeadlineChange}
        />
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <InputLabel id="schedule">Meal Schedule</InputLabel>
          <Select
            labelId="schedule"
            id="schedule"
            value={mealSchedule}
            onChange={handleMealScheduleChange}
            label="Slot"
          >
            {schedules?.map((schedule) => (
              <MenuItem key={schedule.id} value={schedule.name}>
                {schedule.name}: {getWeekDate(schedule.start_date)}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <InputLabel id="slot">Meal Slot</InputLabel>
          <Select
            labelId="slot"
            id="slot"
            value={mealSlot}
            onChange={handleMealSlotChange}
            label="Slot"
          >
            <MenuItem value="Lunch">Lunch</MenuItem>
            <MenuItem value="Dinner">Dinner</MenuItem>
          </Select>
        </div>
        <TextField
          value={mealPrice}
          onChange={handleMealPriceChange}
          id="mealPrice"
          label="Meal Price"
          fullWidth
          variant="standard"
        />
        <Typography sx={{ marginTop: "1rem" }}>
          Upload an image of the meal
        </Typography>
        <Input
          type="file"
          value={mealImage?.[1]}
          onChange={handleMealImageChange}
          disableUnderline
        />
      </DialogContent>
      <DialogActions>
        {updateMeal ? (
          <Button onClick={handleUpdateMeal}>Update</Button>
        ) : (
          <Button onClick={handleCreateMeal}>Create</Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
