import React, { useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteDish,
  deleteMeal,
  dishesByCook,
  setCurrentDish,
  toggleCreateDishForm,
  toggleUpdateDish,
} from "./cookSlice";
import AddDishToMealForm from "./AddDishToMealForm";

export default function CookDishesView() {
  const dishes = useSelector(dishesByCook);
  const dispatch = useDispatch();
  const [deleteSelectedDish, setDeleteSelectedDish] = useState(null);
  const [openDeleteDIalog, setOpenDeleteDialog] = useState(false);
  const [removeMeal, setDeleteMeal] = useState(false);
  const { id } = useParams();

  const onUpdateDishClick = (e, id) => {
    dispatch(toggleUpdateDish(true));
    dispatch(toggleCreateDishForm(true));
    const selectedDish = dishes.filter((dish) => dish.id === id);
    dispatch(setCurrentDish(selectedDish[0]));
  };

  const onDeleteDishClick = (e, id) => {
    const dishToBeDeleted = dishes.filter((dish) => dish.id === id);
    setDeleteSelectedDish(dishToBeDeleted);
    setDeleteMeal(false);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteConfirm = () => {
    if (removeMeal) {
      dispatch(deleteMeal({ id: deleteSelectedDish[0].id, cookId: id }));
    } else {
      dispatch(deleteDish({ id: deleteSelectedDish[0].id, cookId: id }));
    }
    setOpenDeleteDialog(false);
  };

  return (
    <div
      style={{
        padding: "1rem",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
      }}
    >
      {dishes?.map((dish) => (
        <Card
          style={{
            marginBottom: "1rem",
            marginRight: "1rem",
            width: "20%",
            position: "relative",
            boxShadow: "5px 5px 10px #000",
          }}
        >
          <CardMedia sx={{ height: 140 }} image={dish.image} />
          <CardContent style={{ marginBottom: "3rem" }}>
            <Typography variant="h5">{dish.name}</Typography>
            <Typography style={{ overflowWrap: "break-word" }}>
              {dish.description}
            </Typography>
            <Typography
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                backgroundColor:
                  dish.type.toLowerCase() === "veg" ? "#0efd0e" : "red",
                color: "#fff",
                padding: "2px",
              }}
            >
              {dish.type}
            </Typography>
          </CardContent>
          <CardActions style={{ position: "absolute", bottom: 0 }}>
            <Button
              variant="contained"
              style={{ backgroundColor: "#000" }}
              onClick={(e) => onUpdateDishClick(e, dish.id)}
            >
              Edit
            </Button>
            <Button
              style={{ color: "red" }}
              onClick={(e) => onDeleteDishClick(e, dish.id)}
            >
              Delete
            </Button>
          </CardActions>
        </Card>
      ))}
      <Dialog open={openDeleteDIalog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {deleteSelectedDish?.[0]?.name}{" "}
            dish?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirm}>Delete</Button>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <AddDishToMealForm />
    </div>
  );
}
