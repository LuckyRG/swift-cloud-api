import Joi from "joi";

export default Joi.object().keys({
    songid: Joi.number().integer(),
    songname: Joi.string().normalize().min(1).max(500),
    artist: Joi.string().normalize().min(1).max(500),
    writer: Joi.string().normalize().min(1).max(500),
    album: Joi.string().normalize().min(1).max(500),
    releaseyear: Joi.number().integer()
});