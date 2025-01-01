import React from "react";
import { Paper, Skeleton } from "@mui/material";

const ItemSkeleton = () => {
  return [...Array(3)].map((_, index) => (
    <Paper
      key={index}
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        p: "20px 16px 16px 16px",
        gap: "24px",
        width: "100%",
        borderRadius: "16px",
        backgroundImage: "none",
      }}
    >
      <Skeleton
        sx={{
          transform: "scale(1, 1)",
          pt: "75%",
          borderRadius: "16px",
        }}
      />
      {[0].includes(index) && (
        <Skeleton
          sx={{
            transform: "scale(1, 1)",
            pt: "50%",
            borderRadius: "16px",
          }}
        />
      )}
      {[0, 1].includes(index) && (
        <Skeleton
          sx={{
            transform: "scale(1, 1)",
            pt: "25%",
            borderRadius: "16px",
          }}
        />
      )}
      {[0, 1, 2].includes(index) && (
        <Skeleton
          sx={{
            transform: "scale(1, 1)",
            pt: "25%",
            borderRadius: "16px",
          }}
        />
      )}
    </Paper>
  ));
};

export default ItemSkeleton;
