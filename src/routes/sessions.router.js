import { Router } from "express";
import { userModel } from "../dao/mongo/models/user.model.js";

// Passport
import passport from "passport";

const sessions = Router();

// Endpoint para loguearse:
sessions.post("/login", passport.authenticate('login'), async (req, res) => {
	try {
		const email = req.user.email;
		await userModel.findOne({email});
		req.session.user = {
			first_name: req.user.first_name,
			last_name: req.user.last_name,
			email: req.user.email,
		};
		return res.status(200).send({status: 'success', response: 'User loged'});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

// Endpoint para registrarse:
sessions.post("/register", passport.authenticate("register"), async (req, res) => {
	try {
		req.session.user = {
			first_name: req.user.first_name,
			last_name: req.user.last_name,
			email: req.user.email,
		};
		return res.status(200).send({status: 'success', response: 'User created'});
	} catch (err) {
		return res.status(500).json({ status: 'error', response: err.message });
	};
});

// Endpoint para desloguearse:
sessions.post("/logout", (req, res) => {
	try {
		req.session.destroy((err) => {
			if (!err) {
				return res.status(200).send(`Loged out`);
			};

			return res.status(500).send({ status: `Logout error`, payload: err });
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

export default sessions;