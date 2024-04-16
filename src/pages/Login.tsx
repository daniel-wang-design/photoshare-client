import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import { UserLogin, AuthDetails, UserSignUp } from "../components/Types.ts";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://www.daniel-wang.me/">
        Daniel Wang
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const Login: React.FC<{
  updateLoginStatus: (e: boolean) => void;
  updateAuthDetails: (e: AuthDetails) => void;
}> = ({ updateLoginStatus, updateAuthDetails }) => {
  const [password, setPassword] = useState<string>("");
  const [usernameOrEmail, setUsernameOrEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  const defaultTheme = createTheme();

  const url = "https://" + process.env.BASE_URL;

  const handleSubmitSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user: UserLogin = {
        usernameOrEmail: usernameOrEmail,
        password: password,
      };
      const response = await axios.post<AuthDetails>(
        url + "/api/auth/login",
        user
      );
      const jwtObj: AuthDetails = response.data;
      console.log(jwtObj);
      updateAuthDetails(jwtObj);
      updateLoginStatus(true);
    } catch (e) {
      setError("Invalid username or password");
    }
    setLoading(false);
  };

  const handleCloseError = () => {
    setError("");
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const data: FormData = new FormData(e.currentTarget);
    if (data.get("password") !== data.get("password2")) {
      setError("Passwords do not match");
      return;
    }
    try {
      const user: UserSignUp = {
        name: String(data.get("name")),
        username: String(data.get("username")),
        email: String(data.get("email")),
        password: String(data.get("password")),
        token: String(data.get("token")),
      };
      await axios.post<AuthDetails>(url + "/api/auth/signup", user);
      setError("Sign up successful!");
      setIsSignUp(false);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response?.data) {
          const errorMessage: string = error.response.data;
          setError(errorMessage || "Failed to sign in. Please try again.");
        } else {
          setError("Failed to sign in. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
    setLoading(false);
  };

  if (isSignUp)
    return (
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSignup}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="name"
                    required
                    fullWidth
                    label="Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Username"
                    name="username"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                      fullWidth
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    autoComplete="new-password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password2"
                    label="Repeat Password"
                    type="password"
                    autoComplete="new-password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Early Access Token"
                    name="token"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link
                    href="#"
                    variant="body2"
                    onClick={(
                      e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
                    ) => {
                      e.preventDefault();
                      setIsSignUp(false);
                    }}
                  >
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
            <Snackbar
              open={Boolean(error)}
              autoHideDuration={8000}
              onClose={handleCloseError}
              message={error}
            />
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </Container>
      </ThemeProvider>
    );

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmitSignIn}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? "Logging in..." : "Sign In"}
            </Button>
            <Grid container>
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  onClick={(
                    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
                  ) => {
                    e.preventDefault();
                    setIsSignUp(true);
                  }}
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
          <Snackbar
            open={Boolean(error)}
            autoHideDuration={6000}
            onClose={handleCloseError}
            message={error}
          />
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};

export default Login;
