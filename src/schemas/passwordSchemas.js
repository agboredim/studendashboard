import * as yup from "yup";

export const requestPasswordResetSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
});

export const confirmPasswordResetSchema = yup.object().shape({
  new_password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("new_password"), null], "Passwords must match")
    .required("Confirm password is required"),
});
