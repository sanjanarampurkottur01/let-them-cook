import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  cookInfo,
  fetchCookById,
  getCookBusinessAddress,
  getCurrentUserInfo,
  setCookBusinessAddress,
  updateCookProfile,
} from "../Authentication/authSlice";
import { toast } from "react-toastify";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import { uploadImageToFirebase } from "../utils/config";

function CookProfile() {
  const userInfo = useSelector(getCurrentUserInfo);
  const cook = useSelector(cookInfo);
  const dispatch = useDispatch();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const address = useSelector(getCookBusinessAddress);
  const history = useHistory();
  const { id } = useParams();

  const handleUpdateProfile = async () => {
    const profilePictureURL =
      profilePhoto && (await uploadImageToFirebase(profilePhoto[0]));
    const bannerImageURL =
      bannerImage && (await uploadImageToFirebase(bannerImage[0]));

    const data = {
      id: cook?.id,
      address,
      profilePhoto: profilePictureURL,
      bannerImage: bannerImageURL,
    };

    if (address !== cook?.address || profilePhoto || bannerImage) {
      dispatch(
        updateCookProfile({
          data,
          history,
        })
      );
    } else {
      toast.warning("Please update Address or Profile Photo or Banner Image!");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    dispatch(fetchCookById({ id, token }));
  }, [dispatch, id]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <img
          style={{ width: "100vw", height: "50vh" }}
          src={cook?.bannerImage}
          alt="Banner"
        />
        <Avatar
          sx={{ width: "12rem", height: "12rem" }}
          src={cook?.profilePhoto}
          alt="Profile"
          style={{
            position: "absolute",
            top: "18rem",
            border: "3px solid #fff",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginLeft: "13rem",
          }}
        >
          <Typography variant="h4">{userInfo?.name}</Typography>
          <Typography variant="h6">{userInfo?.email}</Typography>
        </div>
      </div>
      <div style={{ padding: "0 10rem", marginTop: "5rem" }}>
        <Typography>Business Details</Typography>
      </div>
      <Divider style={{ color: "#000" }} />
      <div
        style={{
          padding: "1rem 10rem",
        }}
      >
        <Box className="register">
          <Typography style={{ marginBottom: "1rem" }}>
            Business Name: {cook?.businessName}
          </Typography>
          <TextField
            required
            id="outlined-disabled"
            label="Pickup Address"
            value={address}
            onChange={(e) => dispatch(setCookBusinessAddress(e.target.value))}
            sx={{ marginBottom: "1rem" }}
          />
          <Typography>Update Your Profile Photo? </Typography>
          <Input
            value={profilePhoto?.[1]}
            onChange={(e) => setProfilePhoto(e.target.files)}
            type="file"
            disableUnderline="true"
            sx={{ marginBottom: "1rem" }}
          />
          <Typography>Update Your Banner Image? </Typography>
          <Input
            value={bannerImage?.[1]}
            onChange={(e) => setBannerImage(e.target.files)}
            type="file"
            disableUnderline="true"
            sx={{ marginBottom: "1rem" }}
          />

          <Button onClick={handleUpdateProfile}>Update</Button>
        </Box>
      </div>
    </div>
  );
}

export default CookProfile;
