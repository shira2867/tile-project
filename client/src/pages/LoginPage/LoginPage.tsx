import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth";
import { LoginSchema } from "../../validation/authSchema";
import type { LoginData } from "../../types/user.types";
import { getUsersByEmail } from "../../api/user";
import { useUser } from "../../context/UserContext";
import style from './LoginPage.module.css';

import { FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";

export default function LoginPage() {
    const navigate = useNavigate();
    const userContext = useUser();

    const [showPassword, setShowPassword] = useState(false);

    const handleToggle = () => {
        setShowPassword(prev => !prev);
    };

    const mutation = useMutation({
        mutationFn: loginUser,
        onSuccess: async (data, variables) => {
            const email = variables.email;
            try {
                const userResponse = await getUsersByEmail(email);
                const name = userResponse[0].name;
                const role = userResponse[0].role;
                const _id=userResponse[0]._id
                userContext.setName(name);
                userContext.setRole(role);
                userContext.setId(_id);

                navigate("/tiles");
            } catch (err) {
                console.error("Error fetching user:", err);
            }
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
            mutation.mutate(values);
        },
    });

    const serverErrorMessage = (mutation.error as any)?.response?.data?.message
        || mutation.error?.message;

    return (
        <div className={style.containerForm}>
            <form className={style.form} onSubmit={formik.handleSubmit}>
                <div className={style.img}>
                    <img src="../../../public/user (1).png" alt="user" style={{ width: '80px' }} />
                </div>

                <div>
                    <label>Email</label>
                    <input type="email" {...formik.getFieldProps("email")} />
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

                {mutation.isError && (
                    <p style={{ color: "orange" }}>{serverErrorMessage}</p>
                )}
                <div className={style.bottuns}>
                    <button className={style.submit} type="submit" disabled={mutation.isPending}>
                        {mutation.isPending ? "Logging in..." : "LOGIN"}
                    </button>
                    
                    <button className={style.bottun}
                        type="button"
                        onClick={() => navigate("/tiles")}
                    >
                        SIGNUP
                    </button>
                </div>
            </form>
        </div>
    );
}
