import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import "./navbar.css";
// import Link from "@material-ui/core/Link";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { MenuItemComponent } from "../sidebar/SidebarComponent";
import Axios from "../../API/api";
import History from "../../utilities/History";
import { useDispatch, useSelector } from "react-redux";
import { updateUserRole } from "../actions/userData-actions";
import { hideComponent } from "../actions/showComponent-action";
import { setPath } from "../actions/path-action";
import { setRoutes } from "../actions/routes-actions";

// import MailIcon from "@material-ui/icons/Mail";
const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },

  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

export default function Navbar() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  // eslint-disable-next-line no-unused-vars
  const [anchorEl2, setAnchorEl2] = useState(null);
  // const isNotifiOpen = Boolean(anchorEl2);
  const userData = useSelector((store) => store.userData);
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  console.log({ userData });
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleNotificationOpen = (event) => {
    setAnchorEl2(event.currentTarget);
    History.push("/hr/notifications");
    dispatch(setPath("الاخطارات"));
  };
  // const handleNotifiClose = () => {
  //   setAnchorEl2(null);
  // };
  const logout = () => {
    setAnchorEl(null);
    delete Axios.defaults.headers.token;
    dispatch(hideComponent());
    History.push("/hr/");
  };
  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      style={{ direction: "rtl", fontSize: "15px", top: "60px" }}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {userData.user_role_id !== 2 && (
        <div onClick={handleMenuClose}>
          <MenuItemComponent
            title=" الملف الشخصى"
            route={`/profile/${userData.emp_id}`}
          />
        </div>
      )}

      <div onClick={handleMenuClose}>
        <MenuItemComponent title="تغيير كلمة السر" route="/resetPassword" />
      </div>

      {(userData.user_role_id === 2 ||
        (userData.user_role_id === 3 && userData.emp_id === 192)) && (
        <MenuItem
          onClick={() => {
            console.log({ userData });
            Axios.defaults.headers.token = userData.token.emp;
            dispatch(setPath("اضافة طلب"));
            dispatch(updateUserRole(1));
            dispatch(setRoutes(userData.routes.emp));
            History.push(userData.routes.emp[0]);
            handleMenuClose();
          }}
          style={{ fontSize: "15px" }}
        >
          تبديل الحساب الى موظف
        </MenuItem>
      )}
      <MenuItem onClick={logout} style={{ fontSize: "15px" }}>
        الخروج
      </MenuItem>
    </Menu>
  );

  const mobileMenuId2 = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId2}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <p style={{ marginLeft: "10px", marginTop: "20px" }}>EN</p>
      </MenuItem>
      <MenuItem onClick={handleNotificationOpen}>
        {/* badgeContent={17} */}
        <IconButton aria-label="show 17 new notifications" color="inherit">
          <Badge color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p style={{ marginTop: "20px" }}>الأخطارات</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          edge="end"
          aria-label="account of current user"
          aria-controls={menuId}
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            color="inherit"
          />
        </IconButton>
        <p style={{ marginTop: "20px" }}>{userData.name}</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          edge="end"
          aria-label="account of current user"
          aria-controls={menuId}
          aria-haspopup="true"
          color="inherit"
        >
          <ExpandMoreIcon
            edge="end"
            onClick={handleProfileMenuOpen}
            aria-label="expand"
            aria-controls={menuId}
            aria-haspopup="true"
            color="inherit"
          />
        </IconButton>
      </MenuItem>
    </Menu>
  );
  const renderNotification = (
    <></>
    // <Menu
    //   className="notificationMenu"
    //   anchorEl={anchorEl2}
    //   anchorOrigin={{ vertical: "top", horizontal: "right" }}
    //   id={menuId}
    //   keepMounted
    //   transformOrigin={{ vertical: "top", horizontal: "right" }}
    //   open={isNotifiOpen}
    //   onClose={handleNotifiClose}
    // >
    //   <div onClick={handleNotifiClose}>
    //     <MenuItemComponent
    //       title="تمت الموافقه على طلب الاجازه الخاص بك فى"
    //       route="/"
    //     />
    //   </div>

    //   <div onClick={handleNotifiClose}>
    //     <MenuItemComponent
    //       title="تمت الموافقه على طلب الاجازه الخاص بك فى 7/5"
    //       route="/"
    //     />
    //   </div>

    //   <div onClick={handleNotifiClose}>
    //     <MenuItemComponent
    //       title=" تم رفض الاذن الخاص بك فى تاريخ 9/5"
    //       route="/"
    //     />
    //   </div>
    //   <div onClick={handleNotifiClose}>
    //     <MenuItemComponent
    //       title=" تم رفض الاذن الخاص بك فى تاريخ 9/5"
    //       route="/"
    //     />
    //   </div>
    //   <Link style={{ float: "left" }} onClick={handleNotifiClose}>
    //     <MenuItemComponent title="<< عرض المزيد" route="/notifications" />
    //   </Link>
    // </Menu>
  );
  const mobileMenuId = "primary-search-account-menu-mobile";
  return (
    <div className={classes.grow}>
      <AppBar
        position="static"
        style={{
          backgroundColor: "#2B2D35",
          direction: "rtl",
          maxHeight: "59px",
        }}
      >
        <Toolbar>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <p style={{ marginLeft: "10px", marginTop: "20px" }}>EN</p>
            <IconButton
              aria-label="show 17 new notifications"
              color="inherit"
              onClick={handleNotificationOpen}
            >
              {/* badgeContent={17} */}
              <Badge color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                color="inherit"
              />
            </IconButton>
            <p style={{ marginTop: "20px" }}>{userData.name}</p>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              color="inherit"
            >
              <ExpandMoreIcon
                edge="end"
                onClick={handleProfileMenuOpen}
                aria-label="expand"
                aria-controls={menuId}
                aria-haspopup="true"
                color="inherit"
              />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              onClick={handleMobileMenuOpen}
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      {renderNotification}
    </div>
  );
}
