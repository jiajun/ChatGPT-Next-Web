import styles from "./auth.module.scss";
import { IconButton } from "./button";

import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { getHeaders } from "../client/api";
import Locale from "../locales";
import md5 from "spark-md5";
import { useState } from "react";

import BotIcon from "../icons/bot.svg";

export function ResetPassword() {
  const navigate = useNavigate();
  const goHome = () => navigate(Path.Home);

  const [resetUserName, setResetUserName] = useState("");
  const [resetPassword, setPassword] = useState("");
  const [resetNewPassword, setNewPassword] = useState("");
  const [resultMsg, setResultMsg] = useState("");

  const updatePassword = async () => {
    const result = await fetch("/api/openai/resetPassword", {
      method: "post",
      body: JSON.stringify({
        userName: resetUserName,
        password: md5.hash(resetPassword),
        newPassword: md5.hash(resetNewPassword),
      }),
    });

    const resultJson = await result.json();

    if (!resultJson) {
      setResultMsg("系统错误，重置密码失败！");
    } else {
      if (resultJson.error) {
        setResultMsg(resultJson.msg);
      } else {
        setResultMsg("密码重置成功！");
      }
    }
  };

  return (
    <div className={styles["auth-page"]}>
      <div className={`no-dark ${styles["auth-logo"]}`}>
        <BotIcon />
      </div>

      <div className={styles["auth-title"]}>{Locale.ResetPassword.Title}</div>
      <div className={styles["auth-tips"]}>{Locale.ResetPassword.Tips}</div>

      <input
        className={styles["auth-input"]}
        type="text"
        placeholder={Locale.ResetPassword.UserName}
        value={resetUserName}
        onChange={(e) => {
          setResetUserName(e.currentTarget.value);
        }}
      />

      <input
        className={styles["auth-input"]}
        type="password"
        placeholder={Locale.ResetPassword.Password}
        value={resetPassword}
        onChange={(e) => {
          setPassword(e.currentTarget.value);
        }}
      />

      <input
        className={styles["auth-input"]}
        type="password"
        placeholder={Locale.ResetPassword.NewPassword}
        value={resetNewPassword}
        onChange={(e) => {
          setNewPassword(e.currentTarget.value);
        }}
      />

      <div className={styles["reset-msg-result"]}>{resultMsg}</div>

      <div className={styles["auth-actions"]}>
        <IconButton
          text={Locale.ResetPassword.Confirm}
          type="primary"
          onClick={() => updatePassword()}
        />
        <IconButton text={Locale.ResetPassword.Later} onClick={goHome} />
      </div>
    </div>
  );
}
