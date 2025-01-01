import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  chipClasses,
} from "@mui/material";
import React, { useState } from "react";

const TagsList = ({ tags = [], onUpdate }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [error, setError] = useState("");

  const handleAddTag = () => {
    if (!newTag.trim()) {
      setError("Tag cannot be empty");
      return;
    }

    if (tags.includes(newTag.trim())) {
      setError("Tag already exists");
      return;
    }

    onUpdate([...tags, newTag.trim()]);
    setNewTag("");
    setError("");
    setDialogOpen(false);
  };

  const handleDeleteTag = (tagToDelete) => {
    onUpdate(tags.filter((tag) => tag !== tagToDelete));
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton
          onClick={() => setDialogOpen(true)}
          color="iconButton"
          sx={{
            bgcolor: "rgba(145 158 171 / 0.08)",
            border: "dashed 1px rgba(145 158 171 / 0.2)",
          }}
        >
          <Icon icon="mingcute:add-line" width={20} />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        {tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            onDelete={() => handleDeleteTag(tag)}
            deleteIcon={<Icon icon="solar:close-circle-bold" />}
            size="small"
            sx={{
              backgroundColor: "rgba(0, 184, 217, 0.16)",
              color: "rgb(97, 243, 243)",
              borderRadius: "8px",
              [`& .${chipClasses.deleteIcon}`]: {
                opacity: 0.48,
                color: "currentColor",
                "&:hover": { opacity: 1, color: "currentColor" },
              },
            }}
          />
        ))}
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setError("");
          setNewTag("");
        }}
      >
        <DialogTitle>Add New Tag</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Tag Name"
            fullWidth
            value={newTag}
            onChange={(e) => {
              setNewTag(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDialogOpen(false);
              setError("");
              setNewTag("");
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleAddTag} variant="contained">
            Add Tag
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TagsList;
