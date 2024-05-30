"use client";
import React, { useState } from "react";
// import { baselightTheme } from "../../../app/utils/theme/DefaultColors";
import {Grid } from "@mui/material";
import ProductPerfomance from "../components/dashboard/ProductPerformance";
import AllOrders from "../components/dashboard/AllOrders";

const Orders = async () => {
  const res = await fetch(`http://localhost:3000/api/allorders`);
  const data = await res.json();
  let orders = data.orders;
  return (
    <Grid container spacing={0}>
    <Grid item xs={12} lg={12}>
      <AllOrders orders={orders}/>
    </Grid>
  </Grid>
  );
};

export default Orders;
