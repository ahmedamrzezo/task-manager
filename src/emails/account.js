const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
	const msg = {
		to: email,
		from: 'ahmedamrzezo@gmail.com',
		subject: 'Welcome to Task Manager App',
		text: `Welcome to the app, ${name}.`,
		html: `<h1>Welcome to the app, ${name}.</h1>`,
	};

	sgMail
		.send(msg);
};

module.exports = {
	sendWelcomeEmail
};