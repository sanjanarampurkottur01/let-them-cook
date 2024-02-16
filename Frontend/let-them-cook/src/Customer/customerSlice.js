import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { config } from "../config";
import { toast } from "react-toastify";

export const fetchTiffinServices = createAsyncThunk(
  "cook/fetchTiffinServices",
  async (args, thunkApi) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${config.BASE_PATH}${config.COOKS}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const tiffins = await response.json();
    return tiffins;
  }
);

export const fetchTiffinServicesByBusinessName = createAsyncThunk(
  "customer/fetchTiffinServicesByBusinessName",
  async (args, thunkApi) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${config.BASE_PATH}${config.COOKS}${config.COOK_BY_BUSINESSNAME}?businessName=${args.businessName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const tiffins = await response.json();
    return tiffins;
  }
);

export const fetchOrdersByCustomer = createAsyncThunk(
  "customer/fetchOrdersByCustomer",
  async (args, thunkApi) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${config.BASE_PATH}${config.ORDER}${config.ORDER_BY_CUSTOMER}?customerId=${args.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const orders = await response.json();
    return orders;
  }
);

export const orderPayment = createAsyncThunk(
  "customer/orderPayment",
  async (args, thunkApi) => {
    const data = {
      amount: args.amount * 100,
      token: args.token,
    };

    console.log(data);
    const response = await fetch(`${config.BASE_PATH}${config.ORDER_PAYMENT}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    const paymentResponse = await response.json();
    return paymentResponse;
  }
);

export const createOrder = createAsyncThunk(
  "customer/createOrder",
  async (args, thunkApi) => {
    const state = thunkApi.getState();
    const authToken = localStorage.getItem("token");
    const mealsInCart = getMealsInCart(state);
    const subscribeMeal = getSubscribeMeal(state);
    const mealsInCartQuantity = getMealsInCartQuantity(state);
    const mealOrders = [];
    Object.keys(mealsInCart).forEach((meal) => {
      mealOrders.push({
        mealId: mealsInCart[meal].id,
        quantity: mealsInCartQuantity[meal],
      });
    });

    const data = {
      customerId: args.id,
      type: subscribeMeal ? "subscribe" : "normal",
      status: "PENDING",
      paymentStatus: "ACCEPTED",
      mealorderInputs: mealOrders,
    };

    const response = await fetch(
      `${config.BASE_PATH}${config.ORDER}${config.CREATE_ORDER}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      }
    );
    const paymentResponse = await response.json();
    thunkApi.dispatch(resetMealCart());
    thunkApi.dispatch(setPaymentSucceeded(false));
    args.history.push(`/customer/${args.id}/order-history`);
    return paymentResponse;
  }
);

export const customerSlice = createSlice({
  name: "customer",
  initialState: {
    tiffinServices: [],
    selectedStore: null,
    mealsInCart: {},
    mealsInCartQuantity: {},
    orderTotalAmount: 0,
    searchCookBusinessName: "",
    orders: null,
    paymentSucceeded: false,
    subscribeMeal: false,
  },
  reducers: {
    setSubscribeMeal(state, action) {
      state.subscribeMeal = action.payload;
    },
    setPaymentSucceeded(state, action) {
      state.paymentSucceeded = action.payload;
    },
    setSelectedStore(state, action) {
      state.selectedStore = action.payload;
    },
    addMealsInCart(state, action) {
      console.log(action.payload);
      const mealId = action.payload.id;
      const addMeal = { ...state.mealsInCart };
      const addMealQuantity = { ...state.mealsInCartQuantity };
      if (addMeal[mealId] == null) {
        addMeal[mealId] = action.payload;
      }
      state.mealsInCart = { ...addMeal };

      if (addMealQuantity[mealId] == null) {
        addMealQuantity[mealId] = 1;
      }
      state.mealsInCartQuantity = { ...addMealQuantity };
      state.orderTotalAmount += addMeal[mealId].price;
    },
    toggleMealsInCartQuantity(state, action) {
      const mealId = action.payload.mealId;
      const addMealQuantity = { ...state.mealsInCartQuantity };
      // if (addMealQuantity[mealId] == null) {
      //   addMealQuantity[mealId] = action.payload;
      // }
      addMealQuantity[mealId] = action.payload.value;
      state.mealsInCartQuantity = { ...addMealQuantity };
    },
    incrementOrderTotalAmount(state, action) {
      state.orderTotalAmount += action.payload;
    },
    decrementOrderTotalAmount(state, action) {
      state.orderTotalAmount -= action.payload;
    },
    setSearchCookBusinessName(state, action) {
      state.searchCookBusinessName = action.payload;
    },
    resetMealCart(state) {
      state.mealsInCart = {};
      state.mealsInCartQuantity = {};
      state.orderTotalAmount = 0;
    },
  },
  extraReducers: {
    // fetchTiffinServices
    [fetchTiffinServices.fulfilled]: (state, action) => {
      console.log("Fulfilled", action.payload);
      state.tiffinServices = action.payload;
    },
    [fetchTiffinServices.rejected]: (state, action) => {
      console.log(action.payload);
    },

    // fetchTiffinServicesByBusinessName
    [fetchTiffinServicesByBusinessName.fulfilled]: (state, action) => {
      console.log("Fulfilled", action.payload);
      state.tiffinServices = action.payload;
    },
    [fetchTiffinServicesByBusinessName.rejected]: (state, action) => {
      console.log(action.payload);
    },

    // orderPayment
    [orderPayment.fulfilled]: (state, action) => {
      console.log("Fulfilled", action.payload);
      toast.success("Payment Successful!");
      // state.tiffinServices = action.payload;
    },
    [orderPayment.rejected]: (state, error) => {
      console.log(error);
      toast.error("Payment Failed");
    },

    // fetchOrdersByCustomer
    [fetchOrdersByCustomer.fulfilled]: (state, action) => {
      console.log("Fulfilled", action.payload);
      // toast.success("Payment Successful!");
      state.orders = action.payload;
    },
    [fetchOrdersByCustomer.rejected]: (state, error) => {
      console.log(error);
      // toast.error("Payment Failed");
    },

    // createOrder
    [createOrder.fulfilled]: (state, action) => {
      console.log("Fulfilled", action.payload);
      toast.success("Order Successfully Placed!");
      // state.orders = action.payload;
    },
    [createOrder.rejected]: (state, error) => {
      console.log(error);
      // toast.error("Payment Failed");
    },
  },
});

export const {
  setSelectedStore,
  addMealsInCart,
  toggleMealsInCartQuantity,
  incrementOrderTotalAmount,
  decrementOrderTotalAmount,
  setSearchCookBusinessName,
  resetMealCart,
  setPaymentSucceeded,
  setSubscribeMeal,
} = customerSlice.actions;

export default customerSlice.reducer;

export const getPaymentSucceeded = (state) => state.customer.paymentSucceeded;
export const getTiffinServices = (state) => state.customer.tiffinServices;
export const getSelectedStore = (state) => state.customer.selectedStore;
export const getMealsInCart = (state) => state.customer.mealsInCart;
export const getMealsInCartCount = (state) =>
  Object.keys(getMealsInCart(state)).length;
export const getMealsInCartQuantity = (state) =>
  state.customer.mealsInCartQuantity;
export const getOrderTotalAmount = (state) => state.customer.orderTotalAmount;
export const getSearchCookBusinessName = (state) =>
  state.customer.searchCookBusinessName;
export const getOrders = (state) => state.customer.orders;
export const getSubscribeMeal = (state) => state.customer.subscribeMeal;
