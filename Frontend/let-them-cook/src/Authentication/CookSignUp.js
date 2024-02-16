import React, { useState } from "react";
import cooking from "./images/cooking.jpg";
import Grid from "@mui/material/Grid";
import "./Login.css";
import {
  Box,
  Button,
  Input,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom";
import {
  createUser,
  getCookBannerImage,
  getCookBusinessAddress,
  getCookBusinessDocument,
  getCookBusinessName,
  getCookProfilePicture,
  setCookBannerImage,
  setCookBusinessAddress,
  setCookBusinessDocument,
  setCookBusinessName,
  setCookProfilePicture,
} from "./authSlice";
import { toast } from "react-toastify";

function CookSignUp() {
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [value, setValue] = useState(0);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const businessName = useSelector(getCookBusinessName);
  const address = useSelector(getCookBusinessAddress);
  const profilePicture = useSelector(getCookProfilePicture);
  const bannerImage = useSelector(getCookBannerImage);
  const businessDocument = useSelector(getCookBusinessDocument);

  const userRole = location.pathname.split("/")[1];

  const onTabValueChange = (event, newValue) => {
    setValue(newValue);
  };

  const onNameChange = (e) => {
    setName(e.target.value);
  };

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onAddressChange = (e) => {
    dispatch(setCookBusinessAddress(e.target.value));
  };

  const onBusinessNameChange = (e) => {
    dispatch(setCookBusinessName(e.target.value));
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const onConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const onProfilePictureFileChange = (e) => {
    dispatch(setCookProfilePicture(e.target.files));
  };

  const onBannerImageFileChange = (e) => {
    dispatch(setCookBannerImage(e.target.files));
  };

  const onBusinessDocumentFileChange = (e) => {
    dispatch(setCookBusinessDocument(e.target.files));
  };

  const handleCookRegistration = () => {
    const enableRegistration =
      name &&
      email &&
      password &&
      confirmPassword &&
      businessName &&
      address &&
      businessDocument &&
      profilePicture &&
      bannerImage;

    if (enableRegistration) {
      if (password === confirmPassword) {
        dispatch(
          createUser({
            name,
            email,
            password,
            role: userRole,
            history,
          })
        );
      } else {
        toast.warning("PASSWORD AND CONFIRM PASSWORD DOESN'T MATCH!");
      }
    } else {
      toast.warning("PLEASE FILL REQUIRED FIELDS IN BOTH SECTIONS!");
    }
  };

  return (
    <Grid container className="mainContainer">
      <Grid
        item
        xs={12}
        container
        justifyContent="center"
        alignItems="center"
        marginTop={2}>
        <div className="logoDiv">
          <img src="/logo.png" alt="Let Them Cook" className="logo" />
        </div>
        <div>
          <Typography variant="h5">Let Them</Typography>
          <Typography variant="h3">Cook</Typography>
        </div>
      </Grid>
      <Grid container padding="0 1rem" className="container">
        <Grid
          item
          xs={6}
          container
          className="leftItem"
          alignItems="center"
          justifyContent="center">
          <Grid item>
            <Typography variant="h4">Late To School?</Typography>
            <Typography>Order food from favorite cooks near by.</Typography>
          </Grid>
          <Grid item>
            <img src={cooking} alt="Let Them Cook" className="cookingPicture" />
          </Grid>
        </Grid>
        <Grid
          item
          xs={6}
          container
          className="rightItem"
          alignItems="flex-start"
          justifyContent="center">
          <div className="signin">
            <Typography marginBottom="0.5rem" variant="h5">
              Cook Sign Up
            </Typography>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={onTabValueChange}
                aria-label="basic tabs example">
                <Tab
                  label="Personal Details"
                  id="simple-tab-0"
                  aria-controls="simple-tabpanel-0"
                />
                <Tab
                  label="Business Details"
                  id="simple-tab-1"
                  aria-controls="simple-tabpanel-1"
                />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <Box className="register">
                <TextField
                  required
                  id="outlined-required"
                  label="Username"
                  value={name}
                  onChange={onNameChange}
                  sx={{ marginBottom: "1rem" }}
                />
                <TextField
                  required
                  id="outlined-required"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={onEmailChange}
                  sx={{ marginBottom: "1rem" }}
                />
                <TextField
                  required
                  id="outlined-disabled"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={onPasswordChange}
                  sx={{ marginBottom: "1rem" }}
                />
                <TextField
                  required
                  id="outlined-disabled"
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={onConfirmPasswordChange}
                  sx={{ marginBottom: "1rem" }}
                />
              </Box>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <Box className="register">
                <TextField
                  required
                  id="outlined-disabled"
                  label="Business Name"
                  value={businessName}
                  onChange={onBusinessNameChange}
                  sx={{ marginBottom: "1rem" }}
                />
                <TextField
                  required
                  id="outlined-disabled"
                  label="Pickup Address"
                  value={address}
                  onChange={onAddressChange}
                  multiline
                  sx={{ marginBottom: "1rem" }}
                />
                <Typography>Upload Your Profile Picture: </Typography>
                <Input
                  value={profilePicture?.[1]}
                  onChange={onProfilePictureFileChange}
                  type="file"
                  disableUnderline="true"
                  sx={{ marginBottom: "1rem" }}
                />
                <Typography>Upload Your Banner Image: </Typography>
                <Input
                  value={bannerImage?.[1]}
                  onChange={onBannerImageFileChange}
                  type="file"
                  disableUnderline="true"
                  sx={{ marginBottom: "1rem" }}
                />
                <Typography>
                  Upload Your Business Verification Document:{" "}
                </Typography>
                <Input
                  value={businessDocument?.[1]}
                  onChange={onBusinessDocumentFileChange}
                  type="file"
                  disableUnderline="true"
                  sx={{ marginBottom: "1rem" }}
                />
              </Box>
            </CustomTabPanel>
            <Button
              variant="contained"
              className="actionButton"
              onClick={handleCookRegistration}>
              Register
            </Button>
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
}

function CustomTabPanel(props) {
  const { children, value, index } = props;

  return <div>{value === index && children}</div>;
}

export default CookSignUp;
