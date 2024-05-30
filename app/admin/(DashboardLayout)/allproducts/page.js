"use client";
import React from "react";
import { Grid } from "@mui/material";
import ProductPerfomance from "../components/dashboard/ProductPerformance";


const Allproducts = () => {
  return (
    <Grid container spacing={0}>
    <Grid item xs={12} lg={12}>
      <ProductPerfomance />
    </Grid>
  </Grid>
  );
};

export default Allproducts;
