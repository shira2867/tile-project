import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth";
import { LoginSchema } from "../../validation/authSchema";
import type { LoginData } from "../../types/user.types";
import style from './LoginPage.module.css';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";
import { getAvatarUri } from "../../utils/utils";
export default function LoginPage() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const avatarUri = getAvatarUri();
    const handleToggle = () => {
        setShowPassword(prev => !prev);
    };

    const LoginMutation = useMutation({
        mutationFn: loginUser,
        onSuccess: () => {
            navigate("/tiles");
        },
   
    });


    const formik = useFormik<LoginData>({
        initialValues: { email: "", password: "" },
        validate: (values) => {
            const result = LoginSchema.safeParse(values);
            if (!result.success) {
                const errors: Record<string, string> = {};
                result.error.issues.forEach((issue) => {
                    const fieldName = issue.path[0] as string;
                    if (!errors[fieldName]) errors[fieldName] = issue.message;
                });
                return errors;
            }
            return {};
        },
        onSubmit: (values) => {
            LoginMutation.mutate(values);
        },
    });

    const serverErrorMessage = (LoginMutation.error as any)?.response?.data?.message
        || LoginMutation.error?.message;

    return (
        <div className={style.containerForm}>
            <form className={style.form} onSubmit={formik.handleSubmit}>
                <div className={style.img}>
                    <img src={avatarUri} alt="user"  />
                </div>

                <div>
                    <label>Email</label>
                    <input type="email" {...formik.getFieldProps("email")} />
                    {formik.touched.email && formik.errors.email && (
                    <p className={style.errorMessage}>{formik.errors.email}</p>
                    )}
                </div>

                <div>
                    <label>Password</label>
                    <div className={style.passwordWrapper} >
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
                    <p className={style.errorMessage}>{formik.errors.password}</p>
                    )}
                </div>

                {LoginMutation.isError && (
                    <p className={style.serverErrorMessage}>{serverErrorMessage}</p>
                )}
                <div className={style.bottuns}>
                    <button className={style.submit} type="submit" disabled={LoginMutation.isPending}>
                        {LoginMutation.isPending ? "LOGIN..." : "LOGIN"}
                    </button>

                    <button className={style.bottun}
                        type="button"
                        onClick={() => navigate("/signup")}
                    >
                        SIGNUP
                    </button>
                </div>
            </form>
        </div>
    );
}
