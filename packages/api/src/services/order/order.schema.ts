import Joi from "joi";
import { IOrderCreateRequest } from "./order.interface";

export const orderFields: Record<keyof IOrderCreateRequest, Joi.Schema> = {
  product: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().required().messages({
          "string.empty": "Product ID is required",
          "any.required": "Product ID is required",
        }),
        variant: Joi.string().optional().allow(null),
        quantity: Joi.number().integer().min(1).required().messages({
          "number.base": "Quantity must be a number",
          "number.integer": "Quantity must be an integer",
          "number.min": "Quantity must be at least 1",
          "any.required": "Quantity is required",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one product is required",
      "any.required": "Products are required",
    }),
  delivery_address: Joi.alternatives().conditional("pickup_address", {
    is: Joi.string().exist().not(null).not(""),
    then: Joi.forbidden().messages({
      "any.unknown": "checkout.errors.delivery-address-required",
    }),
    otherwise: Joi.object({
      address: Joi.string().required(),
      lat: Joi.number().required(),
      lng: Joi.number().required(),
    })
      .required()
      .messages({
        "any.required": "checkout.errors.delivery-address-required",
      }),
  }),

  payment_method: Joi.string().required().messages({
    "string.empty": "checkout.errors.payment-method-required",
    "any.required": "checkout.errors.payment-method-required",
  }),
  delivery_method: Joi.string(),
  pickup_address: Joi.string(),
  customer_info: Joi.object({
    name: Joi.string().required().messages({
      "string.empty": "Name is required",
      "any.required": "Name is required",
    }),
    phone: Joi.string().required().messages({
      "string.empty": "Phone is required",
      "any.required": "Phone is required",
    }),
  }),
  notes: Joi.string().max(500).optional().allow("").messages({
    "string.max": "Notes must be less than 500 characters",
  }),
};

export const createOrderValidator = Joi.object(orderFields)
  .xor("delivery_method", "pickup_address")
  .messages({
    "object.missing": "checkout.errors.delivery-method-required",
    "object.xor": "checkout.errors.delivery-method-required",
  })
  .prefs({ errors: { label: "key" } })
  .error((errors) => {
    errors.forEach((err) => {
      if (err.path.length === 0) {
        // This is the "root" object error
        err.path = ["pickup_location_and_delivery_method"];
      }
    });
    return errors;
  });
