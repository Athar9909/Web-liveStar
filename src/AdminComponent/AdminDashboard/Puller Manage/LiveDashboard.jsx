import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  LinearProgress,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Modal,
} from "@mui/material";
import EngineeringIcon from "@mui/icons-material/Engineering";
import moment from "moment";
import axios from "axios";
import { useState } from "react";
import ViewItemsTable from "./ViewItemsTable";
import Spin from "react-reveal/Spin";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};

const drawerWidth = 240;
function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "85%", mr: 1, ml: 0 }}>
        <LinearProgress
          sx={{ height:"6px" }}
          color="success"
          variant="determinate"
          {...props}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: "#3e4093",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function LiveDashboard() {
  const getPullerApi = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/getActiveOrders`;
  const getAllPullers = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/allPullers`;
  const [pullerDetails, setPullerDetails] = React.useState([]);
  const [pullers, setPullers] = useState([]);
  const [open, setOpen] = React.useState(true);
  const [openModal, setModalOpen] = React.useState(false);
  const [orderId, setOrderId] = useState();
  const handleOpen = (id, oId) => {
    setOrderId({ id: id, orderId: oId });
    setModalOpen(true);
  };
  const handleClose = () => setModalOpen(false);
  const [selected, setSelected] = useState();
  const [clicked, setClicked] = useState(false);
  axios.defaults.headers.common["x-auth-token-admin"] =
    localStorage.getItem("AdminLogToken");

  React.useEffect(() => {
    getPuller(selected?._id, selected);
    getPullers();
  }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const getPuller = async (id, puller) => {
    setSelected(puller);
    await axios.get(getPullerApi + "/" + id).then((res) => {
      setPullerDetails(res?.data.results?.orders);
      setClicked(false);
    });
  };

  const getPullers = async () => {
    await axios.get(getAllPullers).then((res) => {
      setPullers(res?.data.results.pullers);
    });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}>
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}>
              Live Orders Dashboard
            </Typography>
            <IconButton color="inherit">
              <Spin left when={clicked}>
                <i
                  onClick={() => {
                    setClicked(true);
                    getPuller(selected?._id, selected);
                  }}
                  style={{
                    transform:"scaleX(-1)"
                  }}
                  class="fa fa-refresh"
                  aria-hidden="true"></i>
              </Spin>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}>
            <Typography
              component="h6"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}>
              Assigned Pullers
            </Typography>
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          {console.log(pullers)}
          <List component="nav">
            {pullers
              ?.filter((itm) => itm?.isPullerBusy)
              .map((item) => (
                <ListItemButton
                  sx={
                    selected?._id === item?._id && {
                      backgroundColor: "#eb3237",
                      color: "#000",
                      fontWeight: "bold",
                    }
                  }
                  onClick={() => {
                    getPuller(item?._id, item);
                  }}>
                  <ListItemIcon>
                    <EngineeringIcon />
                  </ListItemIcon>
                  <ListItemText primary={item?.fullName} />
                </ListItemButton>
              ))}
          </List>

          {/* {secondaryListItems} */}
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}>
          <Toolbar />
          {selected && (
            <Typography
              sx={{ ml: 5, mt: 2 }}
              id="modal-modal-title"
              variant="h6"
              component="h2">
              Puller : <strong>{selected?.fullName}</strong>
            </Typography>
          )}
          <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
            <Grid
              style={{
                cursor: "pointer",
              }}
              container
              spacing={4}>
              {(pullerDetails || [])?.map((item, index) => (
                <Grid
                  onClick={() => handleOpen(item?._id, item?.orderId)}
                  item
                  xs={12}
                  md={5}
                  lg={4}
                  xl={3}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      height: 220,
                    }}>
                    <div
                      class=""
                      // onClick={() => navigate(`/app/order-detail/${item?._id}`)}
                      // state={{ id: item?._id }}
                    >
                      <div class="row liveDash">
                        <div class="col-5 mb-1 pe-0 ">
                          <div class="orderID ">
                            Order ID: <strong>{item?.orderId}</strong>
                          </div>
                        </div>

                        <div class="col-6 mb-2">
                          <div class="datee_part ">
                            Assign Date:{" "}
                            <strong>
                              {moment(item?.startTime).format("MM/DD/YYYY")}
                            </strong>
                          </div>
                        </div>
                        <div class="col-6 mb-2">
                          <div class="datee_part">
                            Assign Time:
                            <strong>
                              {" "}
                              {moment(item?.startTime).format("LT")}
                            </strong>
                          </div>
                        </div>
                        <div class="col-5 mb-2">
                          <div class="datee_part">
                            Quanity:
                            <br />
                            <strong> {item?.totalProducts}</strong>
                          </div>
                        </div>
                        <div class="col-11  mt-3 ms-2 px-2 py-2">
                          <div class="items_head">Pulling Progress:</div>
                          <Box>
                            <LinearProgressWithLabel
                              value={item?.scannedPercentage}
                            />
                          </Box>
                        </div>
                      </div>
                    </div>
                  </Paper>
                </Grid>
              ))}

              {/* Recent Orders */}
              {!pullerDetails?.length > 0 && (
                <Grid item xs={12}>
                  <Paper
                    sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                    Select Puller to View Orders
                  </Paper>
                </Grid>
              )}
            </Grid>
            {/* <Copyright sx={{ pt: 4 }} /> */}
          </Container>
        </Box>
      </Box>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Order ID :<strong> {orderId?.orderId}</strong>
          </Typography>
          <ViewItemsTable id={orderId?.id} />
        </Box>
      </Modal>
    </ThemeProvider>
  );
}
