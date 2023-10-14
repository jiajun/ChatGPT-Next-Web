import styles from "./auth.module.scss";
import { IconButton } from "./button";

import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { useAccessStore } from "@/app/store";
import Locale from "../locales";
import md5 from "spark-md5";
import { useState } from "react";

import BotIcon from "../icons/bot.svg";

export function Login() {
  const navigate = useNavigate();
  const goHome = () => navigate(Path.Home);

  const [loginUserName, setLoginUserName] = useState("");
  const [loginPassword, setPassword] = useState("");
  const [loginMsg, setLoginMsg] = useState("");

  const doLogin = async () => {
    const result = await fetch("/api/openai/login", {
      method: "post",
      body: JSON.stringify({
        userName: loginUserName,
        password: md5.hash(loginPassword),
      }),
    });

    const resultJson = await result.json();

    if (!resultJson) {
      setLoginMsg("系统错误，登录失败！");
    } else {
      if (resultJson.error) {
        setLoginMsg(resultJson.msg);
      } else {
        useAccessStore.getState().updateToken(resultJson.data);
        goHome();
      }
    }
  };

  return (
    <div className={styles["auth-page"]}>
      <div className={`no-dark ${styles["auth-logo"]}`}>
        <BotIcon />
      </div>

      <div className={styles["auth-title"]}>{Locale.Login.Title}</div>
      <div className={styles["auth-tips"]}>{Locale.Login.Tips}</div>

      <input
        className={styles["auth-input"]}
        type="text"
        placeholder={Locale.Login.UserName}
        value={loginUserName}
        onChange={(e) => {
          setLoginUserName(e.currentTarget.value);
        }}
      />

      <input
        className={styles["auth-input"]}
        type="password"
        placeholder={Locale.Login.Password}
        value={loginPassword}
        onChange={(e) => {
          setPassword(e.currentTarget.value);
        }}
      />

      <div className={styles["login-msg-result"]}>{loginMsg}</div>

      <div className={styles["auth-actions"]}>
        <IconButton
          text={Locale.Login.Confirm}
          type="primary"
          onClick={() => doLogin()}
        />
      </div>
    </div>
  );
}
