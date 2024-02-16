import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  addDishToMeal,
  dishesByCook,
  getMealForDish,
  getOpenCreateMealForm,
  setMealForDish,
  toggleCreateMealForm,
} from "./cookSlice";

export default function AddDishToMealForm() {
  const dishes = useSelector(dishesByCook);
  const mealForDish = useSelector(getMealForDish);
  const openCreateMealForm = useSelector(getOpenCreateMealForm);
  const dispatch = useDispatch();

  const handleMealChange = (e) => {
    dispatch(setMealForDish(e.target.value));
  };

  const onMealFormClose = () => {
    dispatch(toggleCreateMealForm(false));
  };

  const handleAddDishToMeal = () => {
    const dish = dishes.find((meal) => meal.name === mealForDish);
    dispatch(addDishToMeal({ dishId: dish?.id }));
    dispatch(toggleCreateMealForm(false));
    dispatch(setMealForDish(null));
  };

  return (
    <Dialog open={openCreateMealForm} onClose={onMealFormClose}>
      <DialogTitle>Add Dish To Meal</DialogTitle>
      <DialogContent>
        <InputLabel id="meal">Dish</InputLabel>
        <Select
          labelId="meal"
          id="meal"
          value={mealForDish}
          onChange={handleMealChange}
          label="Meal"
        >
          {dishes?.map((meal) => (
            <MenuItem key={meal.id} value={meal.name}>
              {meal.name}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          style={{ backgroundColor: "#000" }}
          onClick={handleAddDishToMeal}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
