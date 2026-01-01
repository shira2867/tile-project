import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { SignUpSchema } from "../validation/authSchema";
import { signUpUser } from "../api/auth";
import type { SignUpData } from "../types/user.types";


export default function SignUpPage() {
  const navigate = useNavigate();

  const mutation = useMutation({
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
      mutation.mutate(values);
    },
  });

  const serverErrorMessage = (mutation.error as any)?.response?.data?.message 
    || mutation.error?.message;

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={formik.handleSubmit}>
        
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
          <input
            type="password"
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password && (
            <p style={{ color: "red" }}>{formik.errors.password}</p>
          )}
        </div>

        {mutation.isError && (
          <p style={{ color: "orange" }}>{serverErrorMessage}</p>
        )}

        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}