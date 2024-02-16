import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CookDishesView from "./CookDishesView";
import { Box, Typography } from "@mui/material";
import MealScheduleView from "./MealScheduleView";
import MealsView from "./MealsView";

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

export default function CookDashboardTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Dishes" id="tab-0" />
        <Tab label="Meals" id="tab-1" />
        <Tab label="Meal Schedule" id="tab-2" />
      </Tabs>
      <CustomTabPanel value={value} index={0}>
        <CookDishesView />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <MealsView />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <MealScheduleView />
      </CustomTabPanel>
    </>
  );
}
