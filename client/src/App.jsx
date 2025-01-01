import {
  Box,
  CssBaseline,
  ThemeProvider,
  alertClasses,
  buttonBaseClasses,
  buttonClasses,
  colors,
  createTheme,
  dialogActionsClasses,
  listClasses,
  menuItemClasses,
  tabClasses,
  typographyClasses,
} from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import EventBus from "./api/EventBus";
import Home from "./calendar/Home";
import { ColorModeContext } from "./components/ColorModeContext";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ResetPassword from "./auth/ResetPassword";
import Navbar from "./navbar/Navbar";

import { Route, Routes } from "react-router-dom";
import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";
import { CheckboxCheckedIcon, CheckboxIcon } from "./custom/Checkbox";
import {
  PickerCalendarIcon,
  PickerLeftIcon,
  PickerRightIcon,
  PickerSwitchIcon,
} from "./custom/DatePicker";
import { RadioCheckedIcon, RadioIcon } from "./custom/Radio";
import { ArrowDownIcon } from "./custom/Select";
import { paper } from "./custom/styles/mixins";
import VerifySuccess from "./auth/VerifySuccess";
import {
  AlertErrorIcon,
  AlertInfoIcon,
  AlertSuccessIcon,
  AlertWarningIcon,
} from "./AlertIcons";
import { pxToRem, responsiveFontSizes } from "./custom/fonts";

function styleColors(ownerState, styles) {
  const outputStyle = ["info", "success", "warning", "error"].reduce(
    (acc, color) => {
      if (ownerState.severity === color) {
        acc = styles(color);
      }
      return acc;
    },
    {}
  );

  return outputStyle;
}

const softVariant = {
  colors: ["primary", "secondary", "info", "success", "warning", "error"].map(
    (color) => ({
      props: ({ ownerState }) =>
        !ownerState.disabled &&
        ownerState.variant === "soft" &&
        ownerState.color === color,
      style: ({ theme }) => ({
        backgroundColor: "rgba(255 86 48 / 0.16)",
        "&:hover": {
          backgroundColor: "rgba(255 86 48 / 0.32)",
        },
        color: theme.palette[color].light,
      }),
    })
  ),
  base: [
    {
      props: ({ ownerState }) => ownerState.variant === "soft",
      style: {
        backgroundColor: "rgba(145 158 171 / 0.08)",
        "&:hover": {
          backgroundColor: "rgba(145 158 171 / 0.24)",
        },
      },
    },
  ],
};

export default function App() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const [mode, setMode] = useState("dark");
  const dispatch = useDispatch();

  useEffect(() => {
    if (["/login", "/register"].includes(location.pathname)) {
      dispatch(clearMessage());
    }
  }, [dispatch, location]);

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  useEffect(() => {
    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, [user, logOut]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            darker: "#004B50",
            lighter: "#C8FAD6",
            dark: "#007867",
            main: "#00A76F",
            light: "#5BE49B",
            contrastText: "#FFFFFF",
          },
          secondary: {
            main: "#8E33FF",
            light: "#C684FF",
            dark: "#5119B7",
            contrastText: "#FFFFFF",
          },
          background: {
            default: mode === "dark" ? "#141A21" : "rgb(251, 251, 255)",
            paper: mode === "dark" ? "#1C252E" : "rgb(241, 245, 249)",
            neutral: mode === "dark" ? "#28323D" : "rgb(241, 245, 249)",
          },
          text: {
            primary: "#FFFFFF",
            secondary: "#919EAB",
            disabled: "#637381",
          },
          action: {
            hover: "rgba(145 158 171 / 0.08)",
            focus: "rgba(145 158 171 / 0.24)",
            active: "#919EAB",
            selected: "rgba(145 158 171 / 0.16)",
            disabled: "rgba(145 158 171 / 0.8)",
            disabledBackground: "rgba(145 158 171 / 0.24)",
            disabledOpacity: "0.48",
            activatedOpacity: "0.24",
            hoverOpacity: "0.08",
          },
          success: {
            main: "#22C55E",
            light: "#00B8D9",
            lighter: "#D3FCD2",
            dark: "#D3FCD2",
            darker: "#D3FCD2",
          },
          error: {
            main: "#FF5630",
            light: "#FFAC82",
            lighter: "#FFE9D5",
            dark: "#B71D18",
            darker: "#7A0916",
          },
          iconButton: {
            main: "#919EAB",
          },
        },
        typography: {
          fontFamily: "Public Sans",
          fontWeightRegular: 400,
          fontWeightMedium: 500,
          fontWeightSemiBold: 600,
          fontWeightBold: 700,
          h1: {
            fontWeight: 800,
            lineHeight: 80 / 64,
            fontFamily: "Barlow",
            fontSize: pxToRem(40),
            ...responsiveFontSizes({ sm: 52, md: 58, lg: 64 }),
          },
          h2: {
            fontWeight: 800,
            lineHeight: 64 / 48,
            fontFamily: "Barlow",
            fontSize: pxToRem(32),
            ...responsiveFontSizes({ sm: 40, md: 44, lg: 48 }),
          },
          h3: {
            fontWeight: 700,
            lineHeight: 1.5,
            fontFamily: "Barlow",
            fontSize: pxToRem(24),
            ...responsiveFontSizes({ sm: 26, md: 30, lg: 32 }),
          },
          h4: {
            fontWeight: 700,
            lineHeight: 1.5,
            fontSize: pxToRem(20),
            ...responsiveFontSizes({ sm: 20, md: 24, lg: 24 }),
          },
          h5: {
            fontWeight: 700,
            lineHeight: 1.5,
            fontSize: pxToRem(18),
            ...responsiveFontSizes({ sm: 19, md: 20, lg: 20 }),
          },
          h6: {
            fontWeight: 700,
            lineHeight: 28 / 18,
            fontSize: pxToRem(17),
            ...responsiveFontSizes({ sm: 18, md: 18, lg: 18 }),
          },
          subtitle1: {
            fontWeight: 600,
            lineHeight: 1.5,
            fontSize: pxToRem(16),
          },
          subtitle2: {
            fontWeight: 600,
            lineHeight: 22 / 14,
            fontSize: pxToRem(14),
          },
          body1: {
            lineHeight: 1.5,
            fontSize: pxToRem(16),
          },
          body2: {
            lineHeight: 22 / 14,
            fontSize: pxToRem(14),
          },
          caption: {
            lineHeight: 1.5,
            fontSize: pxToRem(12),
          },
          overline: {
            fontWeight: 700,
            lineHeight: 1.5,
            fontSize: pxToRem(12),
            textTransform: "uppercase",
          },
          button: {
            fontWeight: 700,
            lineHeight: 24 / 14,
            fontSize: pxToRem(14),
            textTransform: "unset",
          },
        },
        components: {
          MuiAlert: {
            defaultProps: {
              iconMapping: {
                error: <AlertErrorIcon />,
                info: <AlertInfoIcon />,
                success: <AlertSuccessIcon />,
                warning: <AlertWarningIcon />,
              },
            },
            styleOverrides: {
              root: {
                borderRadius: "10px",
              },
            },
          },
          MuiButton: {
            defaultProps: { disableElevation: true },
            variants: [...[...softVariant.base, ...softVariant.colors]],
            styleOverrides: {
              root: {
                padding: "6px 12px",
                textTransform: "capitalize",
                letterSpacing: "0.04em",
                borderRadius: "10px",
                fontWeight: 600,
                [`& .${buttonClasses.disabled}`]: {
                  backgroundColor: "rgba(145 158 171 / 1)",
                  padding: "100px",
                },
              },
              contained: ({ theme, ownerState }) => {
                const styled = {
                  inheritColor: {
                    ...(ownerState.color === "inherit" &&
                      !ownerState.disabled && {
                        color: "#1C252E",
                        backgroundColor: theme.palette.common.white,
                        "&:hover": {
                          backgroundColor: "#C4CDD5",
                        },
                      }),
                  },
                };

                return { ...styled.inheritColor };
              },
              outlined: {
                borderColor:
                  mode === "dark" ? "rgb(55, 65, 81)" : "rgb(229, 231, 235)",
                color: mode === "dark" ? "white" : "inherit",
                "&:hover": {
                  borderColor:
                    mode === "dark" ? "rgb(55, 65, 81)" : "rgb(241, 245, 249)",
                  backgroundColor: "rgba(145 158 171 / 0.08)",
                },
              },
              sizeSmall: {
                height: 30,
                paddingLeft: "8px",
                paddingRight: "8px",
              },
              sizeLarge: {
                height: 48,
                paddingLeft: "16px",
                paddingRight: "16px",
              },
            },
          },
          MuiOutlinedInput: {
            defaultProps: {
              autoComplete: "off",
            },
            styleOverrides: {
              root: {
                borderRadius: "10px",
                "& fieldset": {
                  color: "#9CA3AF",
                  borderColor:
                    mode === "dark"
                      ? "rgba(145 158 171 / 0.2)"
                      : "rgb(229, 231, 235)",
                },
              },
            },
          },
          MuiDialog: {
            styleOverrides: {
              paper: ({ ownerState, theme }) => ({
                backgroundImage: "none",
                boxShadow: "-40px 40px 80px -8px rgba(0 0 0 / 0.24)",
                borderRadius: "16px",
                ...(!ownerState.fullScreen && { margin: theme.spacing(2) }),
              }),
              paperFullScreen: { borderRadius: 0 },
            },
          },
          MuiDialogTitle: {
            styleOverrides: {
              root: ({ theme }) => ({ padding: theme.spacing(3) }),
            },
          },
          MuiDialogContent: {
            styleOverrides: {
              root: ({ theme }) => ({ padding: theme.spacing(0, 3) }),
              dividers: ({ theme }) => ({
                borderTop: 0,
                borderBottomStyle: "dashed",
                paddingBottom: theme.spacing(3),
              }),
            },
          },
          MuiDialogActions: {
            defaultProps: { disableSpacing: true },
            styleOverrides: {
              root: ({ theme }) => ({
                padding: theme.spacing(3),
                "& > :not(:first-of-type)": { marginLeft: theme.spacing(1.5) },
              }),
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paperAnchorRight: ({ ownerState }) => ({
                ...(ownerState.variant === "temporary" && {
                  ...paper({ dropdown: false }),
                  boxShadow: "-40px 40px 80px -8px rgba(0 0 0 / 0.24)",
                }),
              }),
            },
          },
          MuiInputBase: {
            styleOverrides: {
              input: ({ theme }) => ({
                fontSize: theme.typography.pxToRem(15),
                [theme.breakpoints.down("sm")]: {
                  fontSize: theme.typography.pxToRem(16),
                },
                "&::placeholder": {
                  opacity: 1,
                  color: "#637381",
                },
              }),
            },
          },
          MuiLinearProgress: {
            styleOverrides: {
              root: ({ ownerState }) => {
                const styled = {
                  color: { backgroundColor: "rgba(0 167 111 / 0.24)" },
                  inheritColor: {
                    ...(ownerState.color === "inherit" && {
                      "&::before": { display: "none" },
                      backgroundColor: "rgba(255 255 255 / 0.24)",
                    }),
                  },
                };
                return {
                  borderRadius: 4,
                  ...(ownerState.variant !== "buffer" && {
                    ...styled.inheritColor,
                    ...styled.color,
                  }),
                };
              },
              bar: { borderRadius: "inherit" },
            },
          },
          MuiMobileDateTimePicker: {
            defaultProps: {
              slots: {
                openPickerIcon: PickerCalendarIcon,
                leftArrowIcon: PickerLeftIcon,
                rightArrowIcon: PickerRightIcon,
                switchViewIcon: PickerSwitchIcon,
              },
            },
          },
          MuiPickersPopper: {
            styleOverrides: {
              paper: ({ theme }) => ({
                boxShadow:
                  "0 0 2px 0 rgba(0 0 0 / 0.24), -20px 20px 40px -4px rgba(0 0 0 / 0.24)",
                borderRadius: theme.shape.borderRadius * 1.5,
              }),
            },
          },
          MuiPickersToolbar: {
            styleOverrides: {
              root: {
                [`& .${typographyClasses.root}`]: {
                  [`&.MuiTypography-h3`]: {
                    fontWeight: 700,
                    fontSize: "1.5rem",
                    margin: 0,
                    [`&.MuiDateTimePickerToolbar-separator`]: {
                      marginTop: "0.65rem",
                    },
                  },
                  [`&.MuiTypography-h4`]: {
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    margin: 0,
                  },
                  [`&.MuiTypography-subtitle1, &.MuiTypography-overline`]: {
                    fontWeight: 700,
                    lineHeight: 1.5,
                    margin: 0,
                  },
                },
                [`& .${buttonBaseClasses.root}`]: {
                  "&:hover": {
                    backgroundColor: "rgba(145 158 171 / 0.08)",
                  },
                  "&:active": {
                    backgroundColor: "rgba(145 158 171 / 0.08)",
                  },
                },
              },
            },
          },
          MuiPickersLayout: {
            styleOverrides: {
              root: {
                [`& .${dialogActionsClasses.root}`]: {
                  [`& .${buttonClasses.root}`]: {
                    [`&:last-of-type`]: {
                      color: mode === "dark" ? colors.grey[800] : "#FFF",
                      fontWeight: 700,
                      backgroundColor: "#FFFFFF",
                    },
                    [`&:first-of-type`]: {
                      color: "#FFF",
                      "&:hover": {
                        backgroundColor: "rgba(145 158 171 / 0.08)",
                      },
                    },
                  },
                },
              },
            },
          },
          MuiPopover: {
            styleOverrides: {
              paper: {
                ...paper({ dropdown: true }),
                [`& .${listClasses.root}`]: { paddingTop: 0, paddingBottom: 0 },
              },
            },
          },
          MuiSelect: {
            defaultProps: { IconComponent: ArrowDownIcon },
            styleOverrides: {
              icon: {
                right: 10,
                width: 18,
                height: 18,
                top: "calc(50% - 9px)",
              },
            },
          },
          MuiTab: {
            defaultProps: { disableRipple: true, iconPosition: "start" },
            styleOverrides: {
              root: ({ theme }) => ({
                opacity: 1,
                minWidth: 48,
                minHeight: 48,
                padding: theme.spacing(1, 0),
                color: theme.palette.text.secondary,
                fontWeight: 500,
                lineHeight: 22 / 14,
                [`&.${tabClasses.selected}`]: {
                  color: theme.palette.text.primary,
                  fontWeight: 600,
                },
              }),
            },
          },
          MuiTabs: {
            defaultProps: {
              textColor: "inherit",
              variant: "scrollable",
              allowScrollButtonsMobile: true,
            },
            styleOverrides: {
              flexContainer: ({ ownerState, theme }) => ({
                ...(ownerState.variant !== "fullWidth" && {
                  gap: "24px",
                  [theme.breakpoints.up("sm")]: {
                    gap: "40px",
                  },
                }),
              }),
              indicator: { backgroundColor: "currentColor" },
            },
          },
          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                backgroundColor: "#454f5b",
                borderRadius: "8px",
              },
              arrow: {
                color: "#454f5b",
              },
            },
          },
          MuiMenu: {
            styleOverrides: {
              list: {
                padding: "0px",
              },
              paper: {
                ...paper({ dropdown: true }),
                position: "absolute",
                minWidth: "148px",
                outline: "0px",
                overflow: "inherit",
              },
            },
          },
          MuiMenuItem: {
            styleOverrides: {
              root: {
                lineHeight: 22 / 14,
                fontSize: `${14 / 16}rem`,
                padding: "6px 8px",
                borderRadius: "8px",
                "&:not(:last-of-type)": { marginBottom: 4 },
                "&:hover": {
                  backgroundColor: "rgba(145 158 171 / 0.08)",
                },
                [`&.${menuItemClasses.selected}`]: {
                  fontWeight: 600,
                  backgroundColor: "rgba(145 158 171 / 0.16)",
                  "&:hover": {
                    backgroundColor: "rgba(145 158 171 / 0.08)",
                  },
                },
              },
            },
          },
          MuiRadio: {
            defaultProps: {
              size: "small",
              icon: <RadioIcon />,
              checkedIcon: <RadioCheckedIcon />,
            },
          },
          MuiCheckbox: {
            defaultProps: {
              size: "small",
              icon: <CheckboxIcon />,
              checkedIcon: <CheckboxCheckedIcon />,
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />

        <Box
          sx={{
            padding:
              window.location.pathname === "/login" ||
              window.location.pathname === "/register"
                ? 0
                : 3,
            marginTop: "64px",
          }}
        >
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/tasks" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify/:token" element={<VerifySuccess />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </Box>

        {/* <AuthVerify logOut={logOut} /> */}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
