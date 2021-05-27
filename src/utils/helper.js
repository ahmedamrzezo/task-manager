class HelperService {
	static handleError(res, errorObj, statusCode = 400) {
		console.log(errorObj);
		res.status(statusCode).send(errorObj);
	}

	static handleSuccess(res, data, statusCode = 200) {
		if (!data) {
			return res.status(404).send();
		}

		res.status(statusCode).send(data);
	}

	static validateUpdateFields(fields, allowedFields) {
		return fields.every((field) => allowedFields.includes(field));
	}
}

module.exports = HelperService;
