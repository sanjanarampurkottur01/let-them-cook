import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { currentUserToken } from "../Authentication/authSlice";
import { config } from "../config";

export const fetchCooks = createAsyncThunk(
  "admin/fetchCooks",
  async (args, thunkApi) => {
    const state = thunkApi.getState();
    const token = currentUserToken(state);

    const response = await fetch(`${config.BASE_PATH}${config.COOKS}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const cooks = await response.json();
    return cooks;
  }
);

export const adminSlice = createSlice({
  name: "admin",
  initialState: {
    cooks: null,
    pendingCooks: null,
    verifiedCooks: null,
    showCookDetails: false,
    selectedCook: null,
  },
  reducers: {
    setShowCookDetails(state, action) {
      console.log(action.payload);
      state.showCookDetails = action.payload;
    },
    setSelectedCook(state, action) {
      console.log(action.payload);
      state.selectedCook = action.payload;
    },
  },
  extraReducers: {
    [fetchCooks.fulfilled]: (state, action) => {
      state.cooks = action.payload;
      state.pendingCooks = action.payload.filter(
        (cook) => cook.status.toLowerCase() === "pending"
      );
      state.verifiedCooks = action.payload.filter(
        (cook) => cook.status.toLowerCase() === "accepted"
      );
    },
    [fetchCooks.rejected]: (state, action) => {
      console.log(action.payload);
    },
  },
});

export const { setShowCookDetails, setSelectedCook } = adminSlice.actions;
export const getAllCooks = (state) => state.admin.cooks;
export const getPendingCooks = (state) => state.admin.pendingCooks;
export const getVerifiedCooks = (state) => state.admin.verifiedCooks;
export const getShowCookDetails = (state) => state.admin.showCookDetails;
export const getSelectedCook = (state) => state.admin.selectedCook;

export default adminSlice.reducer;
