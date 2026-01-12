import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { SignUpSchema } from "../../validation/authSchema";
import { signUpUser } from "../../api/auth";
import type { SignUpData } from "../../types/user.types";
import style from './SignUpPage.module.css'
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";
import { getAvatarUri } from "../../utils/utils";
export default function SignUpPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const avatarUri = getAvatarUri();

  const handleToggle = () => {
    setShowPassword(prev => !prev);
  };
  const SignUpMutation = useMutation({
    mutationFn: signUpUser,
    onSuccess: () => {
      navigate("/login");
    },
  });

  const formik = useFormik<SignUpData>({
    initialValues: { name: "", email: "", password: "" },
    validate: (values) => {
      const result = SignUpSchema.safeParse(values);

      if (!result.success) {
        const errors: Record<string, string> = {};

        result.error.issues.forEach((issue) => {
          const fieldName = issue.path[0] as string;
          if (!errors[fieldName]) {
            errors[fieldName] = issue.message;
          }
        });

        return errors;
      }

      return {};
    },
    onSubmit: (values) => {
      SignUpMutation.mutate(values);
    },
  });

  const serverErrorMessage = (SignUpMutation.error as any)?.response?.data?.message
    || SignUpMutation.error?.message;

  return (
    <div className={style.containerForm}>
      <form className={style.form} onSubmit={formik.handleSubmit}>
        <div className={style.img}>
          <img src={avatarUri} alt="user" style={{ width: '24px' }} />
        </div>
        <div>
          <label>Username</label>
          <input
            type="text"
            {...formik.getFieldProps("name")}
          />
          {formik.touched.name && formik.errors.name && (
            <p style={{ color: "red" }}>{formik.errors.name}</p>
          )}
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email && (
            <p style={{ color: "red" }}>{formik.errors.email}</p>
          )}
        </div>

        <div>
          <label>Password</label>
          <div className={style.passwordWrapper} style={{ position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              {...formik.getFieldProps("password")}
            />
            <span
              onClick={handleToggle}
              className={style.iconEye}
            >
              {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
            </span>
          </div>
          {formik.touched.password && formik.errors.password && (
            <p style={{ color: "red" }}>{formik.errors.password}</p>
          )}
        </div>

        {SignUpMutation.isError && (
          <p style={{ color: "orange" }}>{serverErrorMessage}</p>
        )}
        <div className={style.bottuns}>

          <button className={style.submit} type="submit" disabled={SignUpMutation.isPending}>
            {SignUpMutation.isPending ? "Signing up..." : "Sign Up"}
          </button>
          <button className={style.bottun}
            type="button"
            onClick={() => navigate("/login")}
          >
            LOGIN
          </button>
        </div>
      </form>
    </div>
  );
}