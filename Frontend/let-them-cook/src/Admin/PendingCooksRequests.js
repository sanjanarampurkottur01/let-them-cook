import React, { useEffect } from "react";
import {
  Button,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCooks,
  getPendingCooks,
  getSelectedCook,
  getShowCookDetails,
  setSelectedCook,
  setShowCookDetails,
} from "./adminSlice";
import { updateCookProfile } from "../Authentication/authSlice";

export default function PendingCooksRequests() {
  const cooks = useSelector(getPendingCooks);
  const dispatch = useDispatch();

  const handleOnRowClick = (e, cook) => {
    dispatch(setSelectedCook(cook));
    dispatch(setShowCookDetails(true));
  };

  const handleAcceptRequest = (e, cook) => {
    e.stopPropagation();
    const data = {
      id: cook.id,
      status: "ACCEPTED",
      isAdmin: true,
    };
    dispatch(updateCookProfile({ data }));
  };

  const handleRejectRequest = (e, cook) => {
    e.stopPropagation();
    const data = {
      id: cook.id,
      status: "REJECTED",
      isAdmin: true,
    };
    dispatch(updateCookProfile({ data }));
  };

  useEffect(() => {
    dispatch(fetchCooks());
  }, [dispatch]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Business Name</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cooks?.map((cook) => (
            <TableRow
              key={cook.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              onClick={(e) => handleOnRowClick(e, cook)}
            >
              <TableCell>{cook.businessName}</TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  onClick={(e) => handleAcceptRequest(e, cook)}
                >
                  Accept
                </Button>
                <Button onClick={(e) => handleRejectRequest(e, cook)}>
                  Reject
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function CookDetails() {
  const cook = useSelector(getSelectedCook);
  const showCookDetails = useSelector(getShowCookDetails);
  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(setShowCookDetails(false));
  };

  return (
    <Dialog open={showCookDetails} onClose={onClose} fullScreen>
      <DialogTitle>Verify Cook Business Document</DialogTitle>
      <DialogContent>
        <CardMedia sx={{ height: "100%" }} image={cook?.businessDocument} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          style={{ backgroundColor: "#000" }}
          onClick={onClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
