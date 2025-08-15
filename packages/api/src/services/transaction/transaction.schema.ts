import Joi from "joi";

export const uploadChequeImageValidator = Joi.object({
  cheque_image: Joi.string().required(),
});
