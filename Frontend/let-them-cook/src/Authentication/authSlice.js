import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { config } from "../config";
import { toast } from "react-toastify";
import { uploadImageToFirebase } from "../utils/config";
import { fetchCooks } from "../Admin/adminSlice";

export const createUser = createAsyncThunk(
  "auth/createUser",
  async (args, thunkApi) => {
    const data = {
      name: args.name,
      email: args.email,
      password: args.password,
      role: args.role,
    };

    const response = await fetch(`${config.BASE_PATH}${config.USER_REGISTER}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const userInfo = await response.json();

    if (userInfo != null && userInfo.role) {
      if (userInfo.role === "cook") {
        thunkApi.dispatch(
          createCookProfile({ id: userInfo.id, history: args.history })
        );
      } else if (userInfo.role === "user") {
        thunkApi.dispatch(
          createCustomerProfile({
            userId: userInfo.id,
            name: userInfo.name,
            history: args.history,
          })
        );
      } else {
        args.history.push("/");
      }
    }

    return userInfo;
  }
);

export const userLogin = createAsyncThunk("auth/userLogin", async (args) => {
  const data = {
    email: args.email,
    password: args.password,
  };

  const response = await fetch(`${config.BASE_PATH}${config.USER_LOGIN}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const user = await response.json();
  if (user != null) {
    console.log({ user });
    const role = user.userInfo.role;
    if (role === "admin") {
      args.history.push("/admin");
    } else if (role === "cook") {
      args.history.push(`/cook/${user.userInfo.id}`);
    } else if (role === "user") {
      args.history.push(`/customer/${user.userInfo.id}`);
    }
  }
  return user;
});

export const createCookProfile = createAsyncThunk(
  "auth/createCookProfile",
  async (args, thunkApi) => {
    const state = thunkApi.getState();
    const businessName = getCookBusinessName(state);
    const address = getCookBusinessAddress(state);
    const profilePicture = getCookProfilePicture(state);
    const businessDocument = getCookBusinessDocument(state);
    const bannerImage = getCookBannerImage(state);
    const profilePictureURL = await uploadImageToFirebase(profilePicture[0]);
    const businessDocumentURL = await uploadImageToFirebase(
      businessDocument[0]
    );
    const bannerImageURL = await uploadImageToFirebase(bannerImage[0]);

    const data = {
      userId: args.id,
      businessName,
      address,
      profilePhoto: profilePictureURL,
      businessDocument: businessDocumentURL,
      bannerImage: bannerImageURL,
    };

    const response = await fetch(
      `${config.BASE_PATH}${config.COOKS}${config.COOK_CREATE_PROFILE}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const cookInfo = await response.json();
    args.history.push("/");
    return cookInfo;
  }
);

export const createCustomerProfile = createAsyncThunk(
  "auth/createCustomerProfile",
  async (args, thunkApi) => {
    const state = thunkApi.getState();
    const phoneNumber = getCustomerPhoneNumber(state);

    const data = {
      userId: args.userId,
      name: args.name,
      phoneNumber,
    };

    console.log({ args }, { data });
    const response = await fetch(
      `${config.BASE_PATH}${config.CUSTOMERS}${config.CUSTOMERS_CREATE_PROFILE}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const cookInfo = await response.json();
    args.history.push("/");
    return cookInfo;
  }
);

export const fetchCookById = createAsyncThunk(
  "auth/fetchCookById",
  async (args, thunkApi) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${config.BASE_PATH}${config.COOKS}/${args.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const cookInfo = await response.json();
    return cookInfo;
  }
);

export const updateCookProfile = createAsyncThunk(
  "auth/updateCookProfile",
  async (args, thunkApi) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${config.BASE_PATH}${config.COOKS}/updateProfile`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(args.data),
      }
    );
    const cookInfo = await response.json();
    if (args.isAdmin) {
      thunkApi.dispatch(fetchCooks());
    } else {
      thunkApi.dispatch(fetchCookById({ id: args.data.id }));
      args.history.push(`/cooks/${args.data.id}`);
    }
    return cookInfo;
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    currentUserInfo: {},
    currentUserRole: null,
    userToken: null,
    cookBusinessName: null,
    cookBusinessAddress: null,
    cookProfilePicture: null,
    cookBannerImage: null,
    cookBusinessDocument: null,
    cookInfo: {},
    photo1: null,
    photo2: null,
    customerPhoneNumber: null,
  },
  reducers: {
    setCustomerPhoneNumber(state, action) {
      console.log(action.payload);
      state.customerPhoneNumber = action.payload;
    },
    setCookBusinessName(state, action) {
      state.cookBusinessName = action.payload;
    },
    setCookBusinessAddress(state, action) {
      state.cookBusinessAddress = action.payload;
    },
    setCookProfilePicture(state, action) {
      state.cookProfilePicture = action.payload;
    },
    setCookBannerImage(state, action) {
      state.cookBannerImage = action.payload;
    },
    setCookBusinessDocument(state, action) {
      state.cookBusinessDocument = action.payload;
    },
    setCurrentUserRole(state, action) {
      state.currentUserRole = action.payload;
    },
  },
  extraReducers: {
    //Create User
    [createUser.fulfilled]: (state, action) => {
      if (action.payload.role) {
        action.payload.role !== "cook" &&
          toast.success("USER CREATED SUCCESSFULLY!");
      } else {
        toast.error(action.payload.message.toUpperCase() + "!");
      }
    },
    [createUser.rejected]: (state, action) => {
      console.log(action.payload.message);
    },

    //User Login
    [userLogin.fulfilled]: (state, action) => {
      localStorage.setItem("token", action.payload.token);
      state.userToken = action.payload.token;
      if (action.payload.userInfo) {
        state.currentUserInfo = action.payload.userInfo;
        state.currentUserRole = action.payload.userInfo.role;
        toast.success("USER LOGGED IN SUCCESSFULLY!");
      } else {
        toast.error(action.payload.message.toUpperCase() + "!");
      }
    },
    [userLogin.rejected]: (state, action) => {
      console.log(action.payload);
    },

    //Create Cook Profile
    [createCookProfile.fulfilled]: (state, action) => {
      console.log("Cook profile created", action.payload);
      toast.success("COOK REGISTERED SUCCESSFULLY!");
    },
    [createCookProfile.rejected]: (state, action) => {
      console.log(action.payload);
    },
    //Create Customer Profile
    [createCustomerProfile.fulfilled]: (state, action) => {
      console.log("Customer profile created", action.payload);
      toast.success("CUSTOMER REGISTERED SUCCESSFULLY!");
    },
    [createCustomerProfile.rejected]: (state, action) => {
      console.log(action.payload);
    },

    //Fetch Cook By id
    [fetchCookById.fulfilled]: (state, action) => {
      console.log(action.payload);
      state.cookInfo = action.payload;
      state.cookBusinessAddress = action.payload.address;
    },
    [fetchCookById.rejected]: (state, action) => {
      console.log(action.payload);
    },

    //updateCookProfile
    [updateCookProfile.fulfilled]: (state, action) => {
      if (action.payload.id) {
        state.cookInfo = action.payload;
        toast.success("Profile Updated Suucessfully!");
      } else {
        toast.error(action.payload.message);
      }
    },
    [updateCookProfile.rejected]: (state, action) => {
      console.log(action.payload);
    },
  },
});

export const {
  setCookBusinessName,
  setCookBusinessAddress,
  setCookProfilePicture,
  setCookBusinessDocument,
  setCookBannerImage,
  setCustomerPhoneNumber,
  setCurrentUserRole,
} = authSlice.actions;

export const getCustomerPhoneNumber = (state) => state.auth.customerPhoneNumber;
export const getCurrentUserInfo = (state) => state.auth.currentUserInfo;
export const getCurrentUserRole = (state) => state.auth.currentUserRole;
export const currentUserToken = (state) => state.auth.userToken;
export const getCookBusinessName = (state) => state.auth.cookBusinessName;
export const getCookBusinessAddress = (state) => state.auth.cookBusinessAddress;
export const getCookBusinessDocument = (state) =>
  state.auth.cookBusinessDocument;
export const getCookProfilePicture = (state) => state.auth.cookProfilePicture;
export const alertType = (state) => state.auth.alertType;
export const alertMessage = (state) => state.auth.alertMessage;
export const cookInfo = (state) => state.auth.cookInfo;
export const photo1 = (state) => state.auth.photo1;
export const photo2 = (state) => state.auth.photo2;
export const getCookBannerImage = (state) => state.auth.cookBannerImage;
export default authSlice.reducer;
