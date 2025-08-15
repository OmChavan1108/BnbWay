
//using jio lib for server side validation so if hacker skips forntend(with postman) and try to send uneven data
//which we have set required fortend in html using required form will not get submit.But at server side it will not work

const Joi = require('joi');

module.exports.listingSchema = Joi.object({     //exporting listingSchema
                                                                 
     title: Joi.string().required(),                  //postman title,description etc sagla deycha
     description: Joi.string().required(),
     price: Joi.number().required().min(0),  //so no negative
     location: Joi.string().required(),
     country: Joi.string().required(),
     image: Joi.string().allow("",null)     //beacause image stores {img:url}
});


module.exports.reviewSchema = Joi.object({     //exporting listingSchema
    review:Joi.object({                                          //postman review[comment]  ani review[rating] deycha
     rating: Joi.number().required().min(0).max(5),
     comment: Joi.string().required(),
    }).required()  
});


