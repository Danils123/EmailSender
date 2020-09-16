const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");
const app = express(express.static(__dirname + "/public"));

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

var port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log("The server started on port " + port);
});

app.post("/sendmail", (req, res) => {
	console.log("request came");
	let user = req.body;
	sendMail(user, (err, info) => {
		if (err) {
			console.log(err);
			res.status(400);
			res.send({ error: "Failed to send email" });
		} else {
			console.log("Email has been sent");
			res.send(info);
		}
	});
});

const sendMail = (user, callback) => {
	const filePath = path.join(__dirname, "/public/pages/email.html");
	const source = fs.readFileSync(filePath, "utf-8").toString();
	const template = handlebars.compile(source);
	const replacements = {
		username: "Daniel Ramirez",
	};
	const htmlToSend = template(replacements);
	const mailOptions = {
		from: `"barrientosd9@gmail.com`,
		to: `<${user.email}>`,
		subject: "<Message subject>",
		html: htmlToSend,
		attachments: [
			{
				filename: "resume.pdf",
				path: "https://firebasestorage.googleapis.com/v0/b/profesional-portfolio.appspot.com/o/Resume.pdf?alt=media&token=f13f2be1-b637-4b74-9cbb-255e3ac52e29",
				contentType: "application/pdf",
			},
		],
	};
	const transporter = nodemailer.createTransport({
		service: "gmail",
		// port: 587,
		// secure: false,
		auth: {
			user: "danieldesignramirez@gmail.com",
			pass: "Ht.Daniel.ramirez.1995",
		},
	});

	transporter.sendMail(mailOptions, callback);
};

// var readHTMLFile = function (path, callback) {
// 	fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
// 		if (err) {
// 			throw err;
// 			callback(err);
// 		} else {
// 			callback(null, html);
// 		}
// 	});
// };

// readHTMLFile(__dirname + "public/pages/emailWithPDF.html", function (err, html) {
// 	var template = handlebars.compile(html);
// 	var replacements = {
// 		username: "John Doe",
// 	};
// 	var htmlToSend = template(replacements);
// 	var mailOptions = {
// 		from: "my@email.com",
// 		to: "some@email.com",
// 		subject: "test subject",
// 	};
// 	smtpTransport.templateSender(new EmailTemplate(templateURL), mailOptions, function (error, response) {
// 		if (error) {
// 			console.log(error);
// 			callback(error);
// 		}
// 	});
// });
