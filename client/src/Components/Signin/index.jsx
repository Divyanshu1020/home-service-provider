import React, { useState, useEffect, useContext } from "react";
import { Button, Input, Form, Switch, Divider, notification } from "antd";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  UnlockOutlined,
} from "@ant-design/icons";
import Logo from "../../Layout/Logo";
import API from "../../api";
import axios from "axios";
import { getauth, setauth } from "../../utils/auth";
import { GlobalContext } from "../../Context/GlobalContext";

const SignIn = (props) => {
  const [form] = Form.useForm();
  const { data, dispatch } = useContext(GlobalContext);
  const [state, setState] = useState({ loader: false, error: false });
  const history = useHistory();

  useEffect(() => {
    console.log(data, "authData");
    const token = getauth();
    console.log(history, props, "hu auth");
    const fetch = async () => {
      try {
        const { data: datas } = await axios.get(API.auth, {
          headers: { "auth-token": token },
        });
        if (datas.success === true) {
          dispatch({ type: "LOGIN_SUCCESS" });
          console.log(data.categories.length);

          if (data.categories.length === 0)
            axios
              .get(API.categories)
              .then((res) => {
                console.log("auth ni category no res", res);
                if (res.data.success) {
                  dispatch({ type: "SET_CATEGORIES", payload: res.data.data });
                }
              })
              .catch((e) => console.log(e));
          if (data.states.length === 0)
            axios
              .get(API.states)
              .then((res) => {
                console.log("auth ni state no res", res);

                if (res.data.success) {
                  // console.log("ha moj ", res);
                  dispatch({ type: "SET_STATES", payload: res.data.data });
                }
              })
              .catch((e) => console.log(e));
          // console.log("yaa hu thav chu");
          history.push(
            props.location.state.data.pathname +
              props.location.state.data.search
          );
        } else {
          // ErrorDispathcer(data.msg);
        }
      } catch (e) {
        // ErrorDispathcer(e.response.statusText);
      }
    };
    fetch();
  }, []);

  const login = () => {
    console.log(data, "loginData");
    setState({ ...state, loader: true });
    const datas = form.getFieldsValue();
    console.log("sfdfd", form.getFieldsValue());
    axios
      .post(API.login, datas)
      .then((res) => {
        if (res.status) {
          dispatch({ type: "LOGIN_SUCCESS" });
          console.log(data.categories.length, res);

          if (data.categories.length === 0)
            axios
              .get(API.categories)
              .then((res) => {
                console.log("Login ni category no res", res);
                if (res.data.success) {
                  dispatch({ type: "SET_CATEGORIES", payload: res.data.data });
                }
              })
              .catch((e) => console.log(e));
          if (data.states.length === 0)
            axios
              .get(API.states)
              .then((res) => {
                console.log("Login ni state no res", res);

                if (res.data.success) {
                  // console.log("ha moj ", res);
                  dispatch({ type: "SET_STATES", payload: res.data.data });
                }
              })
              .catch((e) => console.log(e));
          if (res.headers.auth) {
            setauth(res.headers.auth);
          }
          setState({ ...state, loader: false });
          history.push(
            "/home-services/allCategories?category=all&state=all&city=&name="
          );
        } else {
          setState({ error: true, loader: false });
        }
      })
      .catch((e) => {
        setState({ error: true, loader: false });
      });
  };
  useEffect(() => {
    if (state.error) {
      notification.open({
        message: "Wrong Credentials",
        type: "error",
      });
      setState({ ...state, error: false });
    }
  }, [state.error]);

  return (
    <>
      {/* {loader && <Spinner />} */}
      <div className="signin">
        <div className="signin-form">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              position: "relative",
              right: "1rem",
            }}
          >
            <Logo /> <h1 className="title">HomeServices</h1>
          </div>
          <h2 className="welcomeBack">Welcome back</h2>
          <p class="loginIntoAccount">Please log into your account</p>
          <div>
            <Form form={form} layout="vertical">
              <Form.Item
                label="Email"
                name="email"
                //   required
                //   tooltip="This is a required field"
              >
                <Input placeholder="johndoe@gmail.com" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                //   tooltip={{
                //     title: "Password",
                //     icon: <InfoCircleOutlined />,
                //   }}
              >
                <Input.Password
                  placeholder="password"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1.5rem",
                  marginTop: "2rem",
                }}
              >
                <div>
                  <Switch></Switch>
                  <span className="remeberMe">Remember me</span>
                </div>
                <div>
                  <Link
                    style={{ color: "rgb(0, 132, 137)" }}
                    to="/forgot-password"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>
              <Form.Item style={{ width: "100%" }}>
                <Button
                  type="primary"
                  shape="round"
                  icon={<UnlockOutlined />}
                  style={{
                    width: "100%",
                    height: "2.5rem",
                    backgroundColor: "rgb(0, 132, 137)",
                    borderColor: "rgb(0, 132, 137)",
                  }}
                  loading={state.loader}
                  onClick={login}
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
            <Divider>Or login with</Divider>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                columnGap: "1rem",
                rowGap: "1rem",
              }}
            >
              <Button type="primary">Facebook</Button>
              <Button style={{ backgroundColor: "red" }} type="primary">
                Instagram
              </Button>
              <Button style={{ backgroundColor: "red" }} type="primary">
                Google
              </Button>
              <Button type="primary">Github</Button>
            </div>
            <p
              style={{
                textAlign: "center",
                margin: "1.5rem 0",
                fontSize: "1rem",
                fontWeight: "700",
                color: "rgb(119, 119, 119)",
                fontFamily: "Loto",
              }}
            >
              Don't Have an Account?
              <Link
                style={{ color: "rgb(0, 132, 137)", marginLeft: "0.5rem" }}
                to="/signup"
              >
                Registration
              </Link>
            </p>
          </div>
        </div>
        <div className="signin-image-div" />
      </div>
    </>
  );
};

export default SignIn;
