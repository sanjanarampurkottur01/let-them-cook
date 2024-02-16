import React, { useEffect } from "react";
import { Box, Card, CardMedia, Input, Paper, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrdersByCustomer,
  fetchTiffinServicesByBusinessName,
  getSearchCookBusinessName,
  getTiffinServices,
  setSearchCookBusinessName,
  setSelectedStore,
} from "./customerSlice";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import CustomerAppBar from "./CustomerAppBar";

export default function CustomerDashboard() {
  const tiffinServices = useSelector(getTiffinServices);
  const dispatch = useDispatch();
  const history = useHistory();
  const searchCookBusinessName = useSelector(getSearchCookBusinessName);
  const { id } = useParams();

  const handleOnStoreClick = (e, store) => {
    dispatch(setSelectedStore(store));
    history.push(`/customer/${id}/store`);
  };

  const handleOnNameSearch = (e) => {
    console.log(e.target.value);
    dispatch(setSearchCookBusinessName(e.target.value));
  };

  useEffect(() => {
    dispatch(
      fetchTiffinServicesByBusinessName({
        businessName: searchCookBusinessName,
      })
    );
    dispatch(fetchOrdersByCustomer({ id }));
  }, [dispatch, searchCookBusinessName, id]);

  return (
    <div>
      <CustomerAppBar />
      <div
        style={{
          marginTop: "3rem",
          padding: "2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <Typography variant="h5">Available Tiffin Services</Typography>
          <Paper
            elevation={3}
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#fff",
              padding: "10px 0",
              borderRadius: "10px",
            }}
          >
            <SearchIcon
              style={{
                color: "#000",
                marginLeft: "1.5rem",
              }}
            />
            <Input
              placeholder="Search By Restaurant"
              disableUnderline
              value={searchCookBusinessName}
              onChange={handleOnNameSearch}
            />
          </Paper>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          {tiffinServices.map((tiffin) => (
            <Box
              onClick={(e) => handleOnStoreClick(e, tiffin)}
              style={{
                width: "30%",
                marginBottom: "2rem",
              }}
            >
              <Card
                style={{ borderRadius: "1rem", boxShadow: "3px 3px 5px #000" }}
              >
                <CardMedia sx={{ height: 140 }} image={tiffin.bannerImage} />
              </Card>
              <Typography variant="h6" style={{ marginLeft: "5px" }}>
                {tiffin.businessName}
              </Typography>
            </Box>
          ))}
        </div>
      </div>
    </div>
  );
}
