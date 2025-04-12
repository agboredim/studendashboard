import * as yup from "yup";

// Phone regex pattern for validation
const phoneRegExp =
  /^(\+?\d{0,4})?\s?-?\s?(\d{3})\s?-?\s?(\d{3})\s?-?\s?(\d{4})?$/;

export const signupSchema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must not exceed 20 characters"),

  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email"),

  phone_number: yup
    .string()
    .required("Phone number is required")
    .matches(phoneRegExp, "Please enter a valid phone number"),

  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),

  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),

  agreeToTerms: yup
    .boolean()
    .oneOf([true], "You must agree to the terms and conditions"),
});

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email"),

  password: yup.string().required("Password is required"),
});
