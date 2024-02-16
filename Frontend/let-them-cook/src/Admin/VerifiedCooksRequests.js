import React from "react";
import {
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
  getVerifiedCooks,
  setSelectedCook,
  setShowCookDetails,
} from "./adminSlice";

export default function VerifiedCooksRequests() {
  const cooks = useSelector(getVerifiedCooks);
  const dispatch = useDispatch();

  const handleOnRowClick = (e, cook) => {
    dispatch(setSelectedCook(cook));
    dispatch(setShowCookDetails(true));
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Business Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cooks?.map((cook) => (
            <TableRow
              key={cook.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              onClick={(e) => handleOnRowClick(e, cook)}
            >
              <TableCell component="th" scope="row">
                {cook.businessName}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
