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
  Divider,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteDish,
  deleteMeal,
  fetchDishesByMeal,
  fetchOrdersByMeal,
  getDishesByMeal,
  getMealForDish,
  getMealOrders,
  getMeals,
  getOpenDishesByMealDialog,
  getOrderStatus,
  setCurrentMeal,
  setMealForDish,
  setMealId,
  setOrderStatus,
  toggleAddDishToMealForm,
  toggleCreateMealForm,
  toggleOpenDishesByMealDialog,
  toggleUpdateMeal,
  updateOrderStatus,
} from "./cookSlice";
import AddDishToMealForm from "./AddDishToMealForm";
import moment from "moment";

export default function MealsView() {
  const meals = useSelector(getMeals);
  const dispatch = useDispatch();
  const [deleteSelectedDish, setDeleteSelectedDish] = useState(null);
  const [openDeleteDIalog, setOpenDeleteDialog] = useState(false);
  const [removeMeal, setDeleteMeal] = useState(false);
  const [openMealOrdersDialog, setOpenMealOrdersDailog] = useState(false);
  const { id } = useParams();
  const currentDate = new Date();

  const onUpdateMealClick = (e, id) => {
    e.stopPropagation();
    dispatch(toggleUpdateMeal(true));
    dispatch(toggleAddDishToMealForm(true));
    const selectedMeal = meals.filter((dish) => dish.id === id);
    dispatch(setCurrentMeal(selectedMeal[0]));
  };

  const onDeleteMealClick = (e, id) => {
    e.stopPropagation();
    const mealToBeDeleted = meals.filter((dish) => dish.id === id);
    setDeleteSelectedDish(mealToBeDeleted);
    setDeleteMeal(true);
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

  const handleOnClick = async (e, meal) => {
    dispatch(setMealForDish(meal));
    await dispatch(fetchDishesByMeal({ id: meal.id }));
    dispatch(toggleOpenDishesByMealDialog(true));
  };

  const handleAddDishToMeal = (e, id) => {
    e.stopPropagation();
    dispatch(toggleCreateMealForm(true));
    dispatch(setMealId(id));
  };

  const handleViewOrders = (e, meal) => {
    e.stopPropagation();
    dispatch(fetchOrdersByMeal({ mealId: meal?.id }));
    setOpenMealOrdersDailog(true);
    setDeleteSelectedDish(meal);
  };

  const getFormattedDate = (date) => {
    return moment.utc(date).format("YYYY-MM-DD");
  };

  return (
    <div
      style={{
        padding: "1rem",
      }}
    >
      <Typography variant="h6">Today</Typography>
      <Divider />
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {meals?.map(
          (dish) =>
            getFormattedDate(currentDate) ===
              getFormattedDate(dish?.mealDate) && (
              <Card
                style={{
                  marginBottom: "1rem",
                  width: "40%",
                  boxShadow: "5px 5px 10px #000",
                }}
                onClick={(e) => handleOnClick(e, dish)}
              >
                <CardMedia sx={{ height: 120 }} image={dish.image} />
                <CardContent>
                  <Typography variant="h5">{dish.name}</Typography>
                  <Typography>${dish.price}</Typography>
                </CardContent>
                <CardActions
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <Button
                      variant="contained"
                      style={{ backgroundColor: "#000" }}
                      onClick={(e) => handleAddDishToMeal(e, dish.id)}
                    >
                      Add Dishes
                    </Button>
                    <Button
                      variant="contained"
                      style={{ backgroundColor: "#000", marginLeft: "1rem" }}
                      onClick={(e) => handleViewOrders(e, dish)}
                    >
                      View Orders
                    </Button>
                  </div>
                  <div>
                    <IconButton onClick={(e) => onUpdateMealClick(e, dish.id)}>
                      <Edit style={{ color: "green" }} />
                    </IconButton>
                    <IconButton onClick={(e) => onDeleteMealClick(e, dish.id)}>
                      <Delete style={{ color: "red" }} />
                    </IconButton>
                  </div>
                </CardActions>
              </Card>
            )
        )}
      </div>
      <Typography variant="h6" style={{ marginTop: "1rem" }}>
        Upcoming Meals
      </Typography>
      <Divider />
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {meals?.map(
          (dish) =>
            getFormattedDate(currentDate) <
              getFormattedDate(dish?.mealDate) && (
              <Card
                style={{
                  marginBottom: "1rem",
                  width: "40%",
                  boxShadow: "5px 5px 10px #000",
                }}
                onClick={(e) => handleOnClick(e, dish)}
              >
                <CardMedia sx={{ height: 120 }} image={dish.image} />
                <CardContent>
                  <Typography variant="h5">{dish.name}</Typography>
                  <Typography>${dish.price}</Typography>
                </CardContent>
                <CardActions
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <Button
                      variant="contained"
                      style={{ backgroundColor: "#000" }}
                      onClick={(e) => handleAddDishToMeal(e, dish.id)}
                    >
                      Add Dishes
                    </Button>
                    <Button
                      variant="contained"
                      style={{ backgroundColor: "#000", marginLeft: "1rem" }}
                      onClick={(e) => handleViewOrders(e, dish)}
                    >
                      View Orders
                    </Button>
                  </div>
                  <div>
                    <IconButton onClick={(e) => onUpdateMealClick(e, dish.id)}>
                      <Edit style={{ color: "green" }} />
                    </IconButton>
                    <IconButton onClick={(e) => onDeleteMealClick(e, dish.id)}>
                      <Delete style={{ color: "red" }} />
                    </IconButton>
                  </div>
                </CardActions>
              </Card>
            )
        )}
      </div>
      <Typography variant="h6" style={{ marginTop: "1rem" }}>
        Past Meals
      </Typography>
      <Divider />
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {meals?.map(
          (dish) =>
            getFormattedDate(currentDate) >
              getFormattedDate(dish?.mealDate) && (
              <Card
                style={{
                  marginBottom: "1rem",
                  width: "40%",
                  boxShadow: "5px 5px 10px #000",
                }}
                onClick={(e) => handleOnClick(e, dish)}
              >
                <CardMedia sx={{ height: 120 }} image={dish.image} />
                <CardContent>
                  <Typography variant="h5">{dish.name}</Typography>
                  <Typography>${dish.price}</Typography>
                </CardContent>
                <CardActions
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <Button
                      variant="contained"
                      style={{ backgroundColor: "#000" }}
                      onClick={(e) => handleAddDishToMeal(e, dish.id)}
                    >
                      Add Dishes
                    </Button>
                    <Button
                      variant="contained"
                      style={{ backgroundColor: "#000", marginLeft: "1rem" }}
                      onClick={(e) => handleViewOrders(e, dish)}
                    >
                      View Orders
                    </Button>
                  </div>
                  <div>
                    <IconButton onClick={(e) => onUpdateMealClick(e, dish.id)}>
                      <Edit style={{ color: "green" }} />
                    </IconButton>
                    <IconButton onClick={(e) => onDeleteMealClick(e, dish.id)}>
                      <Delete style={{ color: "red" }} />
                    </IconButton>
                  </div>
                </CardActions>
              </Card>
            )
        )}
      </div>
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
      <DishesByMeals />
      <OrdersByMeal
        open={openMealOrdersDialog}
        setOpenMealOrdersDailog={setOpenMealOrdersDailog}
        meal={deleteSelectedDish}
      />
    </div>
  );
}

export function DishesByMeals() {
  const dishes = useSelector(getDishesByMeal);
  const open = useSelector(getOpenDishesByMealDialog);
  const meal = useSelector(getMealForDish);
  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(toggleOpenDishesByMealDialog(false));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{meal?.name}</DialogTitle>
      <DialogContent style={{ backgroundColor: "#f7f7f7", paddingTop: "1rem" }}>
        {dishes == null
          ? "No Dishes Added"
          : dishes?.map((dish) => (
              <Card
                style={{
                  display: "flex",
                  marginBottom: "1rem",
                  boxShadow: "3px #000",
                }}
              >
                <CardMedia
                  sx={{ width: "6.3rem", height: "6.3rem" }}
                  image={dish.image}
                />
                <CardContent>
                  <Typography variant="h5">{dish.name}</Typography>
                  <Typography
                    style={{
                      padding: "2px",
                      borderRadius: "3px",
                      width:
                        dish.type.toLowerCase() === "veg" ? "2rem" : "4rem",
                      color: "#fff",
                      backgroundColor:
                        dish.type.toLowerCase() === "veg" ? "#04df04" : "red",
                    }}
                  >
                    {dish.type}
                  </Typography>
                </CardContent>
              </Card>
            ))}
      </DialogContent>
    </Dialog>
  );
}

export function OrdersByMeal({ open, setOpenMealOrdersDailog, meal }) {
  const orders = useSelector(getMealOrders);
  const orderStatus = useSelector(getOrderStatus);
  const dispatch = useDispatch();

  const onClose = () => {
    setOpenMealOrdersDailog(false);
  };

  const handleOrderStatusChange = (e, id) => {
    dispatch(setOrderStatus({ id, value: e.target.value }));
  };

  const handleUpdateOrderStatus = (e, order) => {
    console.log({ order }, orderStatus, orderStatus[order.id]);
    dispatch(
      updateOrderStatus({
        orderId: order.id,
        mealOrderId: order?.mealorders[0]?.id,
        customerId: order?.customer?.id,
        mealId: meal.id,
        status: orderStatus[order.id],
      })
    );
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Total Orders</DialogTitle>
      <DialogContent style={{ backgroundColor: "#f7f7f7", padding: "1rem" }}>
        {orders == null || orders.length === 0 ? (
          <Typography>No Orders Yet</Typography>
        ) : (
          orders?.map((dish) => (
            <Card
              style={{
                marginBottom: "1rem",
                boxShadow: "3px #000",
              }}
            >
              <CardContent>
                <Typography>Order Status</Typography>
                <Select
                  value={orderStatus[dish.id]}
                  onChange={(e) => handleOrderStatusChange(e, dish.id)}
                >
                  <MenuItem value="PENDING">PENDING</MenuItem>
                  <MenuItem value="COOKING_STARTED">COOKING_STARTED</MenuItem>
                  <MenuItem value="READY_FOR_PICKUP">READY_FOR_PICKUP</MenuItem>
                  <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                </Select>
                <Typography variant="h6" style={{ marginTop: "1rem" }}>
                  Placed At:{" "}
                  {moment.utc(dish.createdAt).format("YYYY-MM-DD hh:mm a")}
                </Typography>
                <Typography variant="h6">
                  Quantity: {dish.mealorders[0].quantity}
                </Typography>
                <Typography variant="h6">
                  Customer Name: {dish.customer.name}
                </Typography>
                <Typography variant="h6">
                  Customer Phone Number: {dish.customer.phoneNumber}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#000" }}
                  onClick={(e) => handleUpdateOrderStatus(e, dish)}
                >
                  Update Order Status
                </Button>
              </CardActions>
            </Card>
          ))
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
