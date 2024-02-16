import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrdersByCustomer, getOrders } from "./customerSlice";
import CustomerAppBar from "./CustomerAppBar";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { Box, Card, CardContent, Typography } from "@mui/material";
import moment from "moment";

export default function OrderHistory() {
  const orders = useSelector(getOrders);
  const dispatch = useDispatch();
  const { id } = useParams();

  const formatDate = (date) => {
    return moment(date).format("YYYY-MM-DD hh:mm:ss a");
  };

  useEffect(() => {
    dispatch(fetchOrdersByCustomer({ id }));
  }, [dispatch, id]);

  return (
    <div>
      <CustomerAppBar />
      <div style={{ marginTop: "5rem", padding: "1rem" }}>
        {orders?.map((order) => (
          <Card style={{ marginBottom: "2rem" }}>
            <CardContent>
              <Typography variant="h5">
                Order Placed on: {formatDate(order.createdAt)}
              </Typography>
              <Typography>Order Amount: {order.amount}</Typography>
              {order?.mealorders.map((meal) => (
                <Box>
                  <Typography>Meal Id: {meal?.id}</Typography>
                  <Typography>Meal Quantity: {meal?.quantity}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
