import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { config } from "../config";
import { toast } from "react-toastify";
import { calendarDays, uploadImageToFirebase } from "../utils/config";
import moment from "moment";

export const fetchSchedulesByCook = createAsyncThunk(
  "cook/fetchSchedulesByCook",
  async (args, thunkApi) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${config.BASE_PATH}${config.MENU}${config.COOK}?cookId=${args.cookId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const schedules = await response.json();
    if (args.isCustomer) {
      console.log({ schedules });
      const schedule = schedules.filter((schedule) => {
        console.log(
          moment.utc(schedule.start_date).format("YYYY-MM-DD"),
          moment.utc().startOf("W").subtract(1, "d").format("YYYY-MM-DD")
        );

        return (
          moment.utc(schedule.start_date).format("YYYY-MM-DD") ===
          moment.utc().startOf("W").subtract(1, "d").format("YYYY-MM-DD")
        );
      })[0];

      // console.log({ schedule });
      thunkApi.dispatch(setCurrentWeekSchedule(schedule));
      const startDate = new Date(schedule?.start_date);
      const calendar = calendarDays(startDate);
      thunkApi.dispatch(setScheduleCalendarDays(calendar));
      thunkApi.dispatch(fetchMealsBySchedule({ scheduleId: schedule?.id }));
    }
    return schedules;
  }
);

export const createSchedule = createAsyncThunk(
  "cook/createSchedule",
  async (args, thunkApi) => {
    const state = thunkApi.getState();
    const token = localStorage.getItem("token");
    const name = getScheduleName(state);
    const start_date = getScheduleStartDate(state);

    const data = {
      name,
      start_date: moment.utc(start_date).format("YYYY-MM-DD h:mm:ss"),
      cookId: args.cookId,
    };

    const response = await fetch(
      `${config.BASE_PATH}${config.MENU}${config.MENU_CREATE_SCHEDULE}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    const schedule = await response.json();
    thunkApi.dispatch(fetchSchedulesByCook({ cookId: args.cookId }));
    return schedule;
  }
);

export const updateSchedule = createAsyncThunk(
  "cook/updateSchedule",
  async (args, thunkApi) => {
    const state = thunkApi.getState();
    const token = localStorage.getItem("token");
    const name = getScheduleName(state);
    const start_date = getScheduleStartDate(state);

    const data = {
      name,
      start_date: moment.utc(start_date).format("YYYY-MM-DD h:mm:ss"),
      cookId: args.cookId,
    };

    const response = await fetch(
      `${config.BASE_PATH}${config.MENU}${config.MENU_CREATE_SCHEDULE}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    const schedule = await response.json();
    thunkApi.dispatch(fetchSchedulesByCook({ cookId: args.cookId }));
    return schedule;
  }
);

export const deleteSchedule = createAsyncThunk(
  "cook/deleteSchedule",
  async (args, thunkApi) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${config.BASE_PATH}${config.MENU}${config.MENU_DELETE_SCHEDULE}/${args.scheduleId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const schedule = await response.json();
    thunkApi.dispatch(fetchSchedulesByCook({ cookId: args.cookId }));
    return schedule;
  }
);

export const createDish = createAsyncThunk(
  "cook/createDish",
  async (args, thunkApi) => {
    const state = thunkApi.getState();
    const token = localStorage.getItem("token");
    const name = dishName(state);
    const description = getDishDescription(state);
    const type = dishLabel(state);
    const image = dishImage(state);
    const imageURL = await uploadImageToFirebase(image[0]);

    const data = {
      name,
      description,
      type,
      image: imageURL,
      cookId: args.id,
    };

    const response = await fetch(
      `${config.BASE_PATH}${config.MENU}${config.MENU_CREATE_DISH}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    const menu = await response.json();
    thunkApi.dispatch(fetchDishesByCook({ cookId: args.id }));
    return menu;
  }
);

export const updateDish = createAsyncThunk(
  "cook/updateDish",
  async (args, thunkApi) => {
    const state = thunkApi.getState();
    const token = localStorage.getItem("token");
    const name = dishName(state);
    const description = getDishDescription(state);
    const type = dishLabel(state);

    const data = {
      id: args.id,
      name,
      description,
      type,
    };

    const response = await fetch(
      `${config.BASE_PATH}${config.MENU}${config.MENU_UPDATE_DISH}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    const menu = await response.json();
    thunkApi.dispatch(fetchDishesByCook({ cookId: args.cookId }));
    return menu;
  }
);

export const deleteDish = createAsyncThunk(
  "cook/deleteDish",
  async (args, thunkApi) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${config.BASE_PATH}${config.MENU}${config.MENU_DELETE_DISH}/${args.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const menu = await response.json();
    thunkApi.dispatch(fetchDishesByCook({ cookId: args.cookId }));
    return menu;
  }
);

export const fetchDishesByCook = createAsyncThunk(
  "cook/fetchDishesByCook",
  async (args, thunkApi) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${config.BASE_PATH}${config.COOKS}${config.MENU_GET_DISHES_BY_COOK}/${args.cookId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const menu = await response.json();
    return menu;
  }
);

export const fetchDishesByMeal = createAsyncThunk(
  "cook/fetchDishesByMeal",
  async (args, thunkApi) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${config.BASE_PATH}${config.MENU}${config.MENU_GET_DISHES_BY_MEAL}/${args.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const menu = await response.json();
    return menu;
  }
);

export const fetchMealsByCook = createAsyncThunk(
  "cook/fetchMealsByCook",
  async (args, thunkApi) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${config.BASE_PATH}${config.MENU}${config.MEAL}${config.COOK}/${args.cookId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const meals = await response.json();
    return meals;
  }
);

export const fetchMealsBySchedule = createAsyncThunk(
  "cook/fetchMealsBySchedule",
  async (args, thunkApi) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${config.BASE_PATH}${config.MENU}/getMealsBySchedule/${args.scheduleId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const meals = await response.json();
    return meals;
  }
);

export const addDishToMeal = createAsyncThunk(
  "cook/addDishToMeal",
  async (args, thunkApi) => {
    const state = thunkApi.getState();
    const token = localStorage.getItem("token");
    const meal_id = getMealId(state);

    const data = {
      meal_id,
      dish_id: args.dishId,
    };

    const response = await fetch(
      `${config.BASE_PATH}${config.MENU}${config.MENU_ADD_DISH_TO_MEAL}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );
    const menu = await response.json();
    return menu;
  }
);

export const addMealToSchedule = createAsyncThunk(
  "cook/addMealToSchedule",
  async (args, thunkApi) => {
    const token = localStorage.getItem("token");
    const imageURL = await uploadImageToFirebase(args.mealImage[0]);

    const data = {
      maxOrderLimit: args.mealMaxOrderLimit,
      slot: args.mealSlot,
      orderDeadline: args.mealOrderDeadline,
      mealDate: args.mealDate,
      name: args.mealName,
      price: args.mealPrice,
      image: imageURL,
      scheduleId: args.scheduleId,
    };

    const response = await fetch(
      `${config.BASE_PATH}${config.MENU}${config.MENU_ADD_MEAL_TO_SCHEDULE}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );
    const menu = await response.json();
    thunkApi.dispatch(fetchMealsByCook({ cookId: args.cookId }));
    return menu;
  }
);

export const updateMealToSchedule = createAsyncThunk(
  "cook/updateMealToSchedule",
  async (args, thunkApi) => {
    const state = thunkApi.getState();
    const token = localStorage.getItem("token");
    const mealId = getMealId(state);
    const imageURL = await uploadImageToFirebase(args.mealImage?.[0]);

    const data = {
      id: mealId,
      maxOrderLimit: args.mealMaxOrderLimit,
      slot: args.mealSlot,
      orderDeadline: args.mealOrderDeadline,
      mealDate: args.mealDate,
      name: args.mealName,
      price: args.mealPrice,
      scheduleId: args.scheduleId,
    };

    const updatedData = { ...data };
    if (args.mealImage) {
      updatedData["image"] = imageURL;
    }

    const response = await fetch(
      `${config.BASE_PATH}${config.MENU}${config.MENU_UPDATE_MEAL_TO_SCHEDULE}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      }
    );
    const menu = await response.json();
    thunkApi.dispatch(fetchMealsByCook({ cookId: args.cookId }));
    return menu;
  }
);

export const deleteMeal = createAsyncThunk(
  "cook/deleteMeal",
  async (args, thunkApi) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${config.BASE_PATH}${config.MENU}${config.MENU_DELETE_MEAL}/${args.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const menu = await response.json();
    thunkApi.dispatch(fetchMealsByCook({ cookId: args.cookId }));
    return menu;
  }
);

export const fetchOrdersByMeal = createAsyncThunk(
  "cook/fetchOrdersByMeal",
  async (args, thunkApi) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${config.BASE_PATH}${config.ORDER}${config.MEAL}/${args.mealId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const meals = await response.json();
    return meals;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "cook/updateOrderStatus",
  async (args, thunkApi) => {
    const token = localStorage.getItem("token");

    const data = {
      orderId: args.orderId,
      mealOrderId: args.mealOrderId,
      customerId: args.customerId,
      status: args.status,
    };

    const response = await fetch(
      `${config.BASE_PATH}${config.ORDER}${config.UPDATE_ORDER_STATUS}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );
    const menu = await response.json();
    thunkApi.dispatch(fetchOrdersByMeal({ mealId: args.mealId }));
    return menu;
  }
);

export const cookSlice = createSlice({
  name: "cook",
  initialState: {
    schedules: [],
    scheduleName: null,
    scheduleStartDate: null,
    meals: [],
    dishesByCook: [],
    dishesByMeal: [],
    currentDish: null,
    dishId: null,
    dishName: null,
    dishDescription: null,
    dishLabel: null,
    dishPrice: null,
    dishImage: null,
    openCreateDishForm: false,
    openCreateMealForm: false,
    openAddDishToMealForm: false,
    openCreateMealScheduleForm: false,
    openCreateMeal: false,
    mealName: null,
    mealPrice: null,
    mealImage: null,
    mealMaxOrderLimit: null,
    mealSlot: null,
    mealDate: null,
    mealOrderDeadline: null,
    mealSchedule: null,
    mealsBySchedule: [],
    mealsByLunchSchedule: [],
    mealsByDinnerSchedule: [],
    scheduleLoading: false,
    scheduleCalendarDays: [],
    updateDish: false,
    updateMeal: false,
    mealForDish: null,
    mealId: null,
    openDishesByMealDialog: false,
    currentWeekSchedule: null,
    mealOrders: null,
    orderStatus: {},
  },
  reducers: {
    setOrderStatus(state, action) {
      const tempOrderStatus = { ...state.orderStatus };
      tempOrderStatus[action.payload.id] = action.payload.value;
      state.orderStatus = { ...state.orderStatus, ...tempOrderStatus };
    },
    setCurrentWeekSchedule(state, action) {
      state.currentWeekSchedule = action.payload;
    },
    setMealId(state, action) {
      state.mealId = action.payload;
    },
    setDishName(state, action) {
      state.dishName = action.payload;
    },
    setDishDescription(state, action) {
      state.dishDescription = action.payload;
    },
    setDishLabel(state, action) {
      state.dishLabel = action.payload;
    },
    setDishPrice(state, action) {
      state.dishPrice = action.payload;
    },
    setDishImage(state, action) {
      state.dishImage = action.payload;
    },
    toggleCreateDishForm(state, action) {
      state.openCreateDishForm = action.payload;
    },
    toggleUpdateDishForm(state, action) {
      state.openUpdateDishForm = action.payload;
    },
    toggleAddDishToMealForm(state, action) {
      state.openAddDishToMealForm = action.payload;
    },
    toggleCreateMealForm(state, action) {
      state.openCreateMealForm = action.payload;
    },
    toggleCreateMealScheduleForm(state, action) {
      state.openCreateMealScheduleForm = action.payload;
    },
    setCurrentDish(state, action) {
      state.dishName = action.payload.name;
      state.dishLabel = action.payload.type;
      state.dishPrice = action.payload.price;
      state.dishId = action.payload.id;
      state.dishDescription = action.payload.description;
    },
    setDishId(state, action) {
      state.dishId = action.payload;
    },
    setMealMaxOrderLimit(state, action) {
      state.mealMaxOrderLimit = action.payload;
    },
    setMealSlot(state, action) {
      state.mealSlot = action.payload;
    },
    setMealName(state, action) {
      state.mealName = action.payload;
    },
    setMealPrice(state, action) {
      state.mealPrice = action.payload;
    },
    setMealImage(state, action) {
      state.mealImage = action.payload;
    },
    setMealDate(state, action) {
      state.mealDate = action.payload;
    },
    setMealOrderDeadline(state, action) {
      state.mealOrderDeadline = action.payload;
    },
    resetCreateDishFormValues(state, action) {
      state.dishName = null;
      state.dishDescription = null;
      state.dishLabel = null;
      state.dishPrice = null;
      state.dishImage = null;
    },
    setScheduleName(state, action) {
      state.scheduleName = action.payload;
    },
    setScheduleStartDate(state, action) {
      state.scheduleStartDate = action.payload;
    },
    toggleAddMeal(state, action) {
      state.openCreateMeal = action.payload;
    },
    setMealSchedule(state, action) {
      state.mealSchedule = action.payload;
    },
    setScheduleCalendarDays(state, action) {
      state.scheduleCalendarDays = action.payload;
    },
    toggleUpdateDish(state, action) {
      state.updateDish = action.payload;
    },
    toggleUpdateMeal(state, action) {
      state.updateMeal = action.payload;
    },
    setCurrentMeal(state, action) {
      const mealDate = new Date(action.payload.mealDate);
      const formattedMealDate = moment.utc(mealDate).format("YYYY-MM-DD");
      const orderDeadline = new Date(action.payload.orderDeadline);
      const formattedMealOrderDeadline = moment
        .utc(orderDeadline)
        .format("YYYY-MM-DDThh:mm:ss");
      state.mealName = action.payload.name;
      state.mealMaxOrderLimit = action.payload.maxOrderLimit;
      state.mealDate = formattedMealDate;
      state.mealOrderDeadline = formattedMealOrderDeadline;
      state.mealPrice = action.payload.price;
      state.mealSchedule = action.payload.schedule.name;
      state.mealSlot = action.payload.slot;
      state.mealId = action.payload.id;
    },
    resetCurrentMeal(state, action) {
      state.mealName = null;
      state.mealMaxOrderLimit = null;
      state.mealDate = null;
      state.mealOrderDeadline = null;
      state.mealPrice = null;
      state.mealSchedule = null;
      state.mealSlot = null;
      state.mealId = null;
    },
    setMealForDish(state, action) {
      state.mealForDish = action.payload;
    },
    toggleOpenDishesByMealDialog(state, action) {
      state.openDishesByMealDialog = action.payload;
    },
  },
  extraReducers: {
    // fetchSchedulesByCook
    [fetchSchedulesByCook.fulfilled]: (state, action) => {
      console.log("Fulfilled", action.payload);
      state.schedules = action.payload;
    },
    [fetchSchedulesByCook.rejected]: (state, action) => {
      console.log(action.payload);
    },

    // fetchMealsByCook
    [fetchMealsByCook.fulfilled]: (state, action) => {
      console.log("Fulfilled", action.payload);
      state.meals = action.payload;
    },
    [fetchMealsByCook.rejected]: (state, action) => {
      console.log(action.payload);
    },

    // fetchMealsBySchedule
    [fetchMealsBySchedule.pending]: (state, action) => {
      state.scheduleLoading = true;
    },
    [fetchMealsBySchedule.fulfilled]: (state, action) => {
      console.log("Fulfilled", action.payload);
      state.scheduleLoading = false;
      state.mealsBySchedule = action.payload;
      const structuredLunchSchedule = {};
      const structuredDinnerSchedule = {};
      action.payload.forEach((item) => {
        const date = new Date(item.mealDate);
        const weekDate = date.getDate();
        if (item.slot.toLowerCase() === "lunch") {
          if (structuredLunchSchedule[weekDate] == null) {
            structuredLunchSchedule[weekDate] = [item];
          } else {
            structuredLunchSchedule[weekDate] = [
              ...structuredLunchSchedule[weekDate],
              item,
            ];
          }
        } else if (item.slot.toLowerCase() === "dinner") {
          if (structuredDinnerSchedule[weekDate] == null) {
            structuredDinnerSchedule[weekDate] = [item];
          } else {
            structuredDinnerSchedule[weekDate] = [
              ...structuredDinnerSchedule[weekDate],
              item,
            ];
          }
        }
      });
      state.mealsByLunchSchedule = structuredLunchSchedule;
      state.mealsByDinnerSchedule = structuredDinnerSchedule;
    },
    [fetchMealsBySchedule.rejected]: (state, action) => {
      console.log(action.payload);
      state.scheduleLoading = false;
    },

    // createSchedule
    [createSchedule.fulfilled]: (state, action) => {
      console.log("Fulfilled", action.payload);
      toast.success("Schedule Created Successfully!");
      // state.schedules = action.payload;
    },
    [createSchedule.rejected]: (state, action) => {
      console.log(action.payload);
    },

    // deleteSchedule
    [deleteSchedule.fulfilled]: (state, action) => {
      console.log("Fulfilled", action.payload);
      toast.success("Schedule Deleted Successfully!");
      // state.schedules = action.payload;
    },
    [deleteSchedule.rejected]: (state, action) => {
      console.log(action.payload);
    },

    // addMealToSchedule
    [addMealToSchedule.fulfilled]: (state, action) => {
      console.log("Fulfilled", action.payload);
      toast.success("Meal Created Successfully!");
    },
    [addMealToSchedule.rejected]: (state, action) => {
      console.log(action.payload);
    },

    // updateMealToSchedule
    [updateMealToSchedule.fulfilled]: (state, action) => {
      console.log("Fulfilled", action.payload);
      toast.success("Meal Updated Successfully!");
    },
    [updateMealToSchedule.rejected]: (state, action) => {
      console.log(action.payload);
    },

    // deleteMeal
    [deleteMeal.fulfilled]: (state, action) => {
      console.log("Fulfilled", action.payload);
      toast.success("Meal Deleted Successfully!");
    },
    [deleteMeal.rejected]: (state, action) => {
      console.log(action.payload);
    },

    // fetchDishesByCook
    [fetchDishesByCook.fulfilled]: (state, action) => {
      console.log("Fulfilled", action.payload);
      state.dishesByCook = action.payload?.length === 0 ? null : action.payload;
    },
    [fetchDishesByCook.rejected]: (state, action) => {
      console.log(action.payload);
    },

    // fetchDishesByMeal
    [fetchDishesByMeal.fulfilled]: (state, action) => {
      console.log("Fulfilled", action.payload);
      state.dishesByMeal = action.payload?.length === 0 ? null : action.payload;
    },
    [fetchDishesByMeal.rejected]: (state, action) => {
      console.log(action.payload);
    },

    // createDish
    [createDish.fulfilled]: (state, action) => {
      console.log("Fulfilled", action.payload);
      toast.success("Dish Created Successfully!");
    },
    [createDish.rejected]: (state, action) => {
      console.log(action.payload);
    },

    // updateDish
    [updateDish.fulfilled]: (state, action) => {
      console.log("Fulfilled", action.payload);
      toast.success("Dish Updated Successfully!");
    },
    [updateDish.rejected]: (state, action) => {
      console.log(action.payload);
    },

    // deleteDish
    [deleteDish.fulfilled]: (state, action) => {
      console.log("Fulfilled", action.payload);
      toast.success("Dish Deleted Successfully!");
    },
    [deleteDish.rejected]: (state, action) => {
      console.log(action.payload);
    },

    // addDishToMeal
    [addDishToMeal.fulfilled]: (state, action) => {
      console.log("Fulfilled", action.payload);
      toast.success("Dish Added To Meal Successfully!");
    },
    [addDishToMeal.rejected]: (state, action) => {
      console.log("Rejected", action.payload);
    },

    // fetchOrdersByMeal
    [fetchOrdersByMeal.fulfilled]: (state, action) => {
      console.log("Fulfilled", action.payload);
      state.mealOrders = action.payload;
      const tempOrderStatus = { ...state.orderStatus };
      action.payload.forEach((meal) => {
        tempOrderStatus[meal.id] = meal.mealorders[0].status;
      });
      state.orderStatus = { ...state.orderStatus, ...tempOrderStatus };
    },
    [fetchOrdersByMeal.rejected]: (state, action) => {
      console.log("Rejected", action.payload);
    },

    // updateOrderStatus
    [updateOrderStatus.fulfilled]: (state, action) => {
      console.log("Fulfilled", action.payload);
      toast.success("Order Status Updated Successfully!");
    },
    [updateOrderStatus.rejected]: (state, action) => {
      console.log("Rejected", action.payload);
    },
  },
});

export const {
  setDishName,
  setDishDescription,
  setDishLabel,
  setDishPrice,
  setDishImage,
  toggleCreateDishForm,
  toggleUpdateDishForm,
  setCurrentDish,
  setMealMaxOrderLimit,
  setMealSlot,
  setMealOrderDeadline,
  setMealDate,
  toggleAddDishToMealForm,
  resetCreateDishFormValues,
  toggleCreateMealScheduleForm,
  setScheduleName,
  setScheduleStartDate,
  toggleAddMeal,
  setMealImage,
  setMealName,
  setMealPrice,
  setMealSchedule,
  setScheduleCalendarDays,
  toggleUpdateDish,
  toggleUpdateMeal,
  setCurrentMeal,
  setMealForDish,
  toggleCreateMealForm,
  setDishId,
  setMealId,
  resetCurrentMeal,
  toggleOpenDishesByMealDialog,
  setCurrentWeekSchedule,
  setOrderStatus,
} = cookSlice.actions;

export const getOrderStatus = (state) => state.cook.orderStatus;
export const getSchedules = (state) => state.cook.schedules;
export const getCurrentWeekSchedule = (state) => state.cook.currentWeekSchedule;
export const getMeals = (state) => state.cook.meals;
export const dishesByCook = (state) => state.cook.dishesByCook;
export const getCurrentDish = (state) => state.cook.currentDish;
export const dishName = (state) => state.cook.dishName;
export const getDishDescription = (state) => state.cook.dishDescription;
export const dishLabel = (state) => state.cook.dishLabel;
export const dishPrice = (state) => state.cook.dishPrice;
export const dishImage = (state) => state.cook.dishImage;
export const dishId = (state) => state.cook.dishId;
export const openCreateDishForm = (state) => state.cook.openCreateDishForm;
export const getOpenUpdateDishForm = (state) => state.cook.openUpdateDishForm;
export const getOpenAddDishToMealForm = (state) =>
  state.cook.openAddDishToMealForm;
export const getOpenCreateMealScheduleForm = (state) =>
  state.cook.openCreateMealScheduleForm;
export const getMealMaxOrderLimit = (state) => state.cook.mealMaxOrderLimit;
export const getMealSlot = (state) => state.cook.mealSlot;
export const getMealOrderDeadline = (state) => state.cook.mealOrderDeadline;
export const getMealDate = (state) => state.cook.mealDate;
export const getMealName = (state) => state.cook.mealName;
export const getMealPrice = (state) => state.cook.mealPrice;
export const getMealImage = (state) => state.cook.mealImage;
export const getScheduleName = (state) => state.cook.scheduleName;
export const getScheduleStartDate = (state) => state.cook.scheduleStartDate;
export const getOpenCreateMealForm = (state) => state.cook.openCreateMealForm;
export const getMealSchedule = (state) => state.cook.mealSchedule;
export const getMealsBySchedule = (state) => state.cook.mealsBySchedule;
export const getMealsByLunchSchedule = (state) =>
  state.cook.mealsByLunchSchedule;
export const getMealsByDinnerSchedule = (state) =>
  state.cook.mealsByDinnerSchedule;
export const getScheduleLoading = (state) => state.cook.scheduleLoading;
export const getScheduleCalendarDays = (state) =>
  state.cook.scheduleCalendarDays;
export const getUpdateDish = (state) => state.cook.updateDish;
export const getUpdateMeal = (state) => state.cook.updateMeal;
export const getMealForDish = (state) => state.cook.mealForDish;
export const getMealId = (state) => state.cook.mealId;
export const getDishesByMeal = (state) => state.cook.dishesByMeal;
export const getOpenDishesByMealDialog = (state) =>
  state.cook.openDishesByMealDialog;
export const getMealOrders = (state) => state.cook.mealOrders;

export default cookSlice.reducer;
