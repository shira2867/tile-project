import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth";
import { LoginSchema } from "../../validation/authSchema";
import type { LoginData } from "../../types/user.types";


export default function LoginPage() {
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: loginUser,
        onSuccess: () => {
            navigate("/signup");
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
        <div>
            <h1>Login</h1>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <label>Email</label>
                    <input type="email" {...formik.getFieldProps("email")} />
                    {formik.touched.email && formik.errors.email && (
                        <p style={{ color: "red" }}>{formik.errors.email}</p>
                    )}
                </div>

                <div>
                    <label>Password</label>
                    <input type="password" {...formik.getFieldProps("password")} />
                    {formik.touched.password && formik.errors.password && (
                        <p style={{ color: "red" }}>{formik.errors.password}</p>
                    )}
                </div>

                {mutation.isError && (
                    <p style={{ color: "orange" }}>{serverErrorMessage}</p>
                )}

                <button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}
