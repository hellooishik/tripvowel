import Joi from "joi";

export const createTripSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().required(),
    location: Joi.string().required(),
    packageType: Joi.string().valid("Basic", "Medium", "Luxury").required(),
    price: Joi.object({
      currency: Joi.string().default("USD"),
      base: Joi.number().required(),
      taxes: Joi.number().default(0),
      discount: Joi.number().default(0)
    }).required(),
    availability: Joi.number().min(0).default(0),
    startDates: Joi.array().items(Joi.date().iso()).default([]),
    durationDays: Joi.number().min(1),
    itinerary: Joi.array().items(
      Joi.object({
        day: Joi.number().min(1),
        title: Joi.string(),
        description: Joi.string(),
        activities: Joi.array().items(Joi.string())
      })
    ),
    inclusions: Joi.array().items(Joi.string()),
    exclusions: Joi.array().items(Joi.string()),
    images: Joi.array().items(Joi.string().uri()),
    meta: Joi.object().unknown(true)
  })
});

export const listTripsSchema = Joi.object({
  query: Joi.object({
    q: Joi.string(),
    location: Joi.string(),
    packageType: Joi.string().valid("Basic", "Medium", "Luxury"),
    minPrice: Joi.number(),
    maxPrice: Joi.number(),
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(20)
  })
});
