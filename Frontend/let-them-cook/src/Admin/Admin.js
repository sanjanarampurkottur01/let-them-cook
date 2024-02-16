import {
  AppBar,
  Box,
  IconButton,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchCooks } from "./adminSlice";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import PendingCooksRequests, { CookDetails } from "./PendingCooksRequests";
import VerifiedCooksRequests from "./VerifiedCooksRequests";
import { setCurrentUserRole } from "../Authentication/authSlice";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tab-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function Admin() {
  const [value, setValue] = useState(0);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleLogout = () => {
    dispatch(setCurrentUserRole(null));
    history.push("/");
  };

  useEffect(() => {
    dispatch(fetchCooks());
  }, [dispatch]);

  return (
    <div>
      <AppBar
        style={{ backgroundColor: "#fff", color: "#000" }}
        position="sticky"
      >
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Let Them Cook</Typography>
          <div style={{ display: "flex" }}>
            <Tooltip title="Logout">
              <IconButton onClick={handleLogout}>
                <LogoutIcon style={{ color: "#000" }} />
              </IconButton>
            </Tooltip>
          </div>
        </Toolbar>
      </AppBar>
      <div>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Pending Requests" id="tab-0" />
          <Tab label="Verified Requests" id="tab-1" />
        </Tabs>
        <CustomTabPanel value={value} index={0}>
          <PendingCooksRequests />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <VerifiedCooksRequests />
        </CustomTabPanel>
      </div>
      <CookDetails />
    </div>
  );
}
