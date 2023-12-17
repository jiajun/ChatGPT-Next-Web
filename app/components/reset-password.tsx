import styles from "./auth.module.scss";
import { IconButton } from "./button";

import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { getHeaders } from "../client/api";
import Locale from "../locales";
import md5 from "spark-md5";
import { useState } from "react";
import EyeIcon from "../icons/eye.svg";
import EyeOffIcon from "../icons/eye-off.svg";

import BotIcon from "../icons/bot.svg";

export function ResetPassword() {
  const navigate = useNavigate();
  const goHome = () => navigate(Path.Home);

  const [resetUserName, setResetUserName] = useState("");
  const [resetPassword, setPassword] = useState("");
  const [resetNewPassword, setNewPassword] = useState("");
  const [resultMsg, setResultMsg] = useState("");
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);

  function changeVisibility1() {
    setVisible1(!visible1);
  }

  function changeVisibility2() {
    setVisible2(!visible2);
  }

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
      <div className={"password-input-container"}>
        <input
          className={styles["auth-input"]}
          type={visible1 ? "text" : "password"}
          placeholder={Locale.ResetPassword.Password}
          value={resetPassword}
          onChange={(e) => {
            setPassword(e.currentTarget.value);
          }}
        />
        <IconButton
          icon={visible1 ? <EyeIcon /> : <EyeOffIcon />}
          onClick={changeVisibility1}
          className={"password-eye"}
        />
      </div>

      <div className={"password-input-container"}>
        <input
          className={styles["auth-input"]}
          type={visible2 ? "text" : "password"}
          placeholder={Locale.ResetPassword.NewPassword}
          value={resetNewPassword}
          onChange={(e) => {
            setNewPassword(e.currentTarget.value);
          }}
        />
        <IconButton
          icon={visible2 ? <EyeIcon /> : <EyeOffIcon />}
          onClick={changeVisibility2}
          className={"password-eye"}
        />
      </div>

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
