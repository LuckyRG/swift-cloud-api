import Joi from "joi";

const columns = {
    sortByColumns: ['songId', 'songName', 'artist', 'writer', 'album', 'releaseYear'],
    sortOrderTypes: ['asc', 'desc']
}

export default Joi.object().keys({
    pageSize: Joi.number().integer().allow(null).optional(),
    pageNumber: Joi.number().integer().allow(null).optional(),
    sortBy: Joi.string().valid(...columns.sortByColumns).allow(null).allow('').optional(),
    sortOrder: Joi.string().valid(...columns.sortOrderTypes).allow(null).allow('').optional(),
    songName: Joi.string().allow(null).allow('').optional(),
    artist: Joi.string().allow(null).allow('').optional(),
    writer: Joi.string().allow(null).allow('').optional(),
    album: Joi.string().allow(null).allow('').optional(),
    releaseYear: Joi.string().allow(null).allow('').optional(),
});