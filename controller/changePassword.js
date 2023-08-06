const { v4: uuidv4 } = require('uuid');
const Sib = require('sib-api-v3-sdk')
const path = require('path')
const bcrypt = require('bcrypt')

const passwordModel = require("../model/password")
const userModel = require("../model/userModel")

exports.forgotPassword = async (req, res) => {
    try {
        const clientEmail = req.body.email;
        console.log(clientEmail);

        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.API_KEY;

        const tranEmail = new Sib.TransactionalEmailsApi();
        const uuid = uuidv4();
        const link = `http://localhost:3001/changePassword/${uuid}`

        const user = await userModel.findOne({ where: { email: clientEmail } })
        console.log(user.id);
        await passwordModel.create({ id: uuid, isactive: true, userId: user.id })

        try {
            await tranEmail.sendTransacEmail({
                sender: { email: 'rahull9739j@gmail.com' },
                to: [{ email: clientEmail }],
                subject: 'Password change',
                htmlContent: `<a href="${link}">${link}</a>`
            });
            console.log('Email sent'); // Log after the email is sent
            return res.status(200).json({ message: 'ok' });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred while sending the email' });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'An error occurred' });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const uuid = req.params.uuid
        console.log(uuid);
        const password = await passwordModel.findOne({ where: { id: uuid } })
        // console.log(password.isactive);

        if (!password) {
            return res.status(400).json({ message: "Password reset link is invalid or has expired." });
        }

        if (password.isactive == true) {
            console.log(password.isactive);
            // return res.sendFile(path.join(__dirname, '../', 'pages', 'changePassword', 'changePassword.html'));
            return res.redirect(`/changePassword.html?uuid=${uuid}`);
        } else {
            return res.status(400).json({ message: "link expired" })
        }
    }
    catch (err) {
        console.log(err);
    }
}
exports.updatePassword = async (req, res) => {
    try {
        const data = req.body.password
        const uuid = req.params.uuid
        const password = await passwordModel.findOne({ where: { id: uuid } })
        console.log(data);
        console.log(uuid);
        console.log(password.userId);
        const userId = password.userId
        bcrypt.hash(data, 10, async (err, hash) => {
            await userModel.update({ password: hash }, { where: { id: userId } })
            await passwordModel.update({isactive:false},{where:{userId}})
            console.log('Created sucessfully');
            return res.status(201).json({ message: 'Created successfullyl' });
        })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}