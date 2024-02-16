import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSelectedStore,
  getSubscribeMeal,
  setSubscribeMeal,
} from "./customerSlice";
import {
  fetchMealsBySchedule,
  fetchSchedulesByCook,
  getScheduleLoading,
  getSchedules,
  setScheduleCalendarDays,
} from "../Cook/cookSlice";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardMedia,
  CircularProgress,
  Typography,
} from "@mui/material";
import CustomerAppBar from "./CustomerAppBar";
import PlaceIcon from "@mui/icons-material/Place";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StoreMealSchedule from "./StoreMealSchedule";
import { calendarDays } from "../utils/config";

export default function TiffinServiceStorePage() {
  const store = useSelector(getSelectedStore);
  const subscribeMeal = useSelector(getSubscribeMeal);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSchedulesByCook({ cookId: store?.id, isCustomer: true }));
  }, [dispatch, store]);

  const onSubscribe = () => {
    dispatch(setSubscribeMeal(true));
  };

  return (
    <div>
      <CustomerAppBar />
      <div style={{ marginTop: "4rem" }}>
        <Card>
          <CardMedia sx={{ height: 200 }} image={store?.bannerImage} />
        </Card>
        <div style={{ padding: "1rem" }}>
          <Typography variant="h4">
            {store?.businessName.toUpperCase()}
          </Typography>
          <div style={{ display: "flex", alignItems: "center" }}>
            <PlaceIcon />
            <Typography>{store?.address}</Typography>
          </div>
        </div>
      </div>
      <div style={{ padding: "2rem" }}>
        <Button
          onClick={onSubscribe}
          variant="contained"
          style={{ backgroundColor: "#000", marginBottom: "1rem" }}
        >
          Subscribe
        </Button>
        {subscribeMeal ? <MealSubscribeView /> : <StoreMealSchedule />}
      </div>
    </div>
  );
}

function MealSubscribeView() {
  const [accordianId, setAccordianId] = useState(null);
  const schedules = useSelector(getSchedules);
  const loading = useSelector(getScheduleLoading);
  const dispatch = useDispatch();

  const handleOnChange = (e, schedule) => {
    setAccordianId(schedule.id);
    const scheduleStartDate = new Date(schedule.start_date);
    const calendar = calendarDays(scheduleStartDate);
    dispatch(setScheduleCalendarDays(calendar));
    dispatch(fetchMealsBySchedule({ scheduleId: schedule.id }));
  };

  return schedules.map((schedule) => (
    <Accordion
      key={schedule.id}
      expanded={schedule.id === accordianId}
      onChange={(e) => handleOnChange(e, schedule)}
      style={{ backgroundColor: "#eee" }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{schedule.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress style={{ color: "#000" }} />
          </div>
        ) : (
          <StoreMealSchedule />
        )}
      </AccordionDetails>
    </Accordion>
  ));
}
