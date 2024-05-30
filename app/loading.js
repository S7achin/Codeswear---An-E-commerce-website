import { Box, CircularProgress } from "@mui/material";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <main className="text-center my-28">
      {/* <Box
        sx={{
          display: "flex",
          flexDirection:"column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100vh",
        }}
      > */}
        <h2 className="text-pink-500 text-3xl font-mono mt-16 mb-5">Loading...</h2>
        <CircularProgress />
        <p className="my-5 text-xl font-mono">Hopefully not for too long :)</p>
      {/* </Box> */}
    </main>
  );
}
