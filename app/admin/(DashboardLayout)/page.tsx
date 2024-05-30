"use client";
import { Grid, Box } from "@mui/material";
import PageContainer from "../(DashboardLayout)/components/container/PageContainer";
// components
import SalesOverview from "../(DashboardLayout)/components/dashboard/SalesOverview";
import DailyActivity from "../(DashboardLayout)/components/dashboard/DailyActivity";
import ProductPerformance from "../(DashboardLayout)/components/dashboard/ProductPerformance";
import BlogCard from "../(DashboardLayout)/components/dashboard/Blog";
import {useAuth} from "../../../context/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Dashboard = () => {
  const { user } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!user.isAdmin) {
      router.push("/");
    }
  }, []);

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <BlogCard />
          </Grid>
          <Grid item xs={12} lg={12}>
            {/* <SalesOverview /> */}
          </Grid>
          {/* ------------------------- row 1 ------------------------- */}
          <Grid item xs={12} lg={4}>
            <DailyActivity />
          </Grid>
          <Grid item xs={12} lg={8}>
            <ProductPerformance />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
