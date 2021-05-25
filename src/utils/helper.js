class HelperService {
	static handleError(req, res, errorObj) {
		let statusCode = 400;
		if (req.method === 'GET') {
			statusCode = 500;
		}
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
