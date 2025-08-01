import Joi from "joi";
import { UserRoles } from "./user.enum";

export const userFields = {
  full_name: Joi.string().required().max(255).messages({
    "any.required": "Full name is required",
    "string.max": "Full name must be at most 255 characters long",
  }),
  phone: Joi.string().min(13).max(13).messages({
    "string.base": "profile.phone_number_error",
    "string.max": "profile.phone_number_error",
  }),
  password: Joi.string().min(8).max(32).required().messages({
    "any.required": "Password is required",
    "string.pattern.base": "Password must be at least 8 characters long",
    "string.min": "Password must be at least 8 characters long",
    "string.max": "Password must be at most 32 characters long",
  }),
  confirm_password: Joi.string()
    .min(8)
    .max(32)
    .allow("")
    .valid(Joi.ref("password"))
    .messages({
      "any.required": "Confirm password is required",
      "any.only": "Passwords do not match",
      "string.pattern.base": "Password must be at least 8 characters long",
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password must be at most 32 characters long",
    }),
  photo: Joi.string().max(255).allow(null).messages({
    "string.max": "Photo must be at most 255 characters long",
    "string.uri": "Photo must be a valid URL",
  }),
  roles: Joi.array()
    .items(Joi.string().valid(...Object.values(UserRoles)))
    .messages({
      "array.includes": "Invalid role",
    }),
  shops: Joi.array().items(Joi.string().hex().length(24)).messages({
    "array.includes": "Invalid shop",
  }),
};

export const checkUserExistsValidator = Joi.object({
  phone: userFields.phone,
});

export const loginUserValidator = Joi.object({
  phone: userFields.phone,
  password: userFields.password,
});

export const createUserValidator = Joi.object({
  phone: userFields.phone,
  password: userFields.password,
  full_name: userFields.full_name,
  confirm_password: userFields.confirm_password,
});