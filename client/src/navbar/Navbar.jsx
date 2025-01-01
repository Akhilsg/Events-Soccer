import { Icon } from "@iconify/react";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Switch,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ColorModeContext } from "../components/ColorModeContext";
import Create from "./Create";
import { logout } from "../actions/auth";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const [scrolled, setScrolled] = useState(false);
  const [checked, setChecked] = useState(true);
  const [open, setOpen] = useState(false);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logOut = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleToggleColorMode = (e) => {
    setChecked(e.target.checked);
    colorMode.toggleColorMode();
  };

  return (
    <>
      <AppBar
        position="fixed"
        open={open}
        color="transparent"
        sx={(theme) => ({
          py: 1,
          zIndex: theme.zIndex.drawer - 1,
          boxShadow: "none",
          height: 80,
          ...(scrolled && {
            backdropFilter: "blur(6px)",
            backgroundColor: "rgba(20 26 33 / 0.8)",
          }),
        })}
      >
        <Box sx={{ display: "flex", alignItems: "center", pl: 2, gap: 2 }}>
          <svg
            width="50px"
            height="50px"
            fill="#00A76F"
            viewBox="-1 0 19 19"
            xmlns="http://www.w3.org/2000/svg"
            className="cf-icon-svg"
            stroke="#227a5c"
            strokeWidth="0"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M16.141 7.905c.24.102.24.269 0 .37l-7.204 3.058a1.288 1.288 0 0 1-.874 0L.859 8.276c-.24-.102-.24-.27 0-.371l7.204-3.058a1.287 1.287 0 0 1 .874 0zm-6.833 4.303 3.983-1.69v2.081c0 1.394-2.145 2.524-4.791 2.524s-4.79-1.13-4.79-2.524v-2.082l3.982 1.69a2.226 2.226 0 0 0 1.616 0zm4.94 1.677h1.642v-1.091a.822.822 0 1 0-1.643 0zm.82-3.603a.554.554 0 1 0-.553-.554.554.554 0 0 0 .554.554zm0 1.415a.554.554 0 1 0-.553-.555.554.554 0 0 0 .554.555z"></path>
            </g>
          </svg>
          <Typography
            variant="h3"
            component="h2"
            className="logo"
            sx={{
              letterSpacing: "0.2rem",
              fontFamily: "Barlow",
            }}
          >
            {user ? "Kickin' Events" : ""}
          </Typography>
          <Toolbar sx={{ marginLeft: "auto" }}>
            <Box
              sx={{
                flexGrow: 0,
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              {user ? (
                <>
                  <Switch checked={checked} onChange={handleToggleColorMode} />
                  <Button
                    variant="contained"
                    onClick={() => setOpen(true)}
                    startIcon={
                      <Icon
                        icon="solar:calendar-add-outline"
                        width="24"
                        height="24"
                      />
                    }
                  >
                    New event
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/tasks")}
                    startIcon={
                      <Icon icon="ic:outline-add-task" width="24" height="24" />
                    }
                  >
                    Add Tasks
                  </Button>
                  <Tooltip title="Logout">
                    <IconButton color="inherit" onClick={logOut}>
                      <Icon icon="solar:logout-2-bold" width="24" height="24" />
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Button color="inherit" onClick={() => navigate("/login")}>
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Box>
      </AppBar>
      {open && <Create open={open} setOpen={setOpen} />}
    </>
  );
};

export default Navbar;
