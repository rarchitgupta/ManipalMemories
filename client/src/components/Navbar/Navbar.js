import React, { useState, useEffect } from "react";
import { AppBar, Typography, Toolbar, Avatar, Button } from "@material-ui/core";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import decode from "jwt-decode";
import { withStyles } from "@material-ui/core/styles";
import { blue, red } from "@material-ui/core/colors";

import logo from "../../images/logo.png";
import * as actionType from "../../constants/actionTypes";
import useStyles from "./styles";

const PrimaryColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(blue[500]),
    backgroundColor: blue[500],
    "&:hover": {
      backgroundColor: blue[700],
    },
  },
}))(Button);

const SecondaryColorButton = withStyles((theme) => ({
  root: {
    color: "white",
    backgroundColor: red[400],
    "&:hover": {
      backgroundColor: red[600],
    },
  },
}))(Button);

const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();

  const logout = () => {
    dispatch({ type: actionType.LOGOUT });

    history.push("/auth");

    setUser(null);
  };

  useEffect(() => {
    const token = user?.token;

    if (token) {
      const decodedToken = decode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem("profile")));
  }, [location]);

  return (
    <AppBar className={classes.appBar} position="static" color="inherit">
      <Link to="/" className={classes.brandContainer}>
        <img
          className={classes.image}
          src={logo}
          alt="icon"
          height="50px"
          marginBottom="20px"
        />
        <Typography
          component={Link}
          to="/"
          variant="h4"
          className={classes.userName}
        >
          Memories
        </Typography>
      </Link>
      <Toolbar className={classes.toolbar}>
        {user?.result ? (
          <div className={classes.profile}>
            <Typography className={classes.userName} variant="h6">
              {user?.result.name}
            </Typography>
            <SecondaryColorButton
              variant="contained"
              className={classes.logout}
              color="secondary"
              onClick={logout}
            >
              Logout
            </SecondaryColorButton>
          </div>
        ) : (
          <PrimaryColorButton
            component={Link}
            to="/auth"
            variant="contained"
            color="primary"
          >
            Sign In
          </PrimaryColorButton>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
