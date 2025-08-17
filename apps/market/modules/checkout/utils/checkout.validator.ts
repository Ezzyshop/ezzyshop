import Joi from "joi";

export const checkoutUserInfoValidator = Joi.object({
  name: Joi.string().required().min(1),
  phone: Joi.string().min(13).max(13).messages({
    "string.base": "profile.phone_number_error",
    "string.max": "profile.phone_number_error",
  }),
});
