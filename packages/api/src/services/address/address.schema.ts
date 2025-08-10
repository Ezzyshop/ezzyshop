import Joi from "joi";

export const addressSchema = Joi.object({
  address: {
    address: Joi.string().required(),
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  },
  name: Joi.string().required(),
  entrance: Joi.string().optional().allow(""),
  floor: Joi.string().optional().allow(""),
  room: Joi.string().optional().allow(""),
  note: Joi.string().optional().allow(""),
});
