import Joi from "joi";

const columns = {
    monthColumns: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
    sortOrderTypes: ['asc', 'desc']
}

export default Joi.object().keys({
    topN: Joi.number().integer(),
    playYear: Joi.number().integer(),   
    sortByMonth: Joi.string().valid(...columns.monthColumns).allow(null).allow('').optional(),
    sortOrder: Joi.string().valid(...columns.sortOrderTypes).allow(null).allow('').optional(),
});