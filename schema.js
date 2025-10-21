
const Joi=require('joi');

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.object({
      url: Joi.string().allow("", null),
      filename: Joi.string().allow("", null),
    }).allow(null),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),

    geometry: Joi.object({
      type: Joi.string()
        .valid('Point')
        .optional()
        .messages({
          'any.only': 'geometry.type must be "Point"',
          'any.required': 'geometry.type is required',
        }),
      coordinates: Joi.array()
        .ordered(
          Joi.number().min(-180).max(180).optional(), // longitude
          Joi.number().min(-90).max(90).optional()    // latitude
        )
        .required()
        .messages({
          'array.base': 'geometry.coordinates must be an array of numbers',
          'any.required': 'geometry.coordinates is required',
        }),
    }).optional()
  }).required()
});


module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required()
    }).required()
});