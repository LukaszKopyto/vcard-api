const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.static('vcard'))


const user = {
	firstName: 'Lukasz',
	lastName: 'Kopyto',
	phone: '+48 111 222 333',
	email: 'lukasz.kopyto@ventrurelabs.team',
	organization: 'Venture Labs',
	title: 'Javascript developer',
	img: 'https://storage.googleapis.com/tap2link-storage/1659335547209.png',
}

app.get('/api/download', async (req, res) => {
	const axios = require('axios');

	try {
		const response = await axios.get(user.img, {responseType: 'arraybuffer'})
		const base64Image = Buffer.from(response.data, 'binary').toString('base64');
		const vCard = require('vcards-js');
		const myCard = vCard();
		myCard.firstName = user.firstName;
		myCard.lastName = user.lastName;
		myCard.homePhone = user.phone;
		myCard.cellPhone = user.phone;
		myCard.workPhone = user.phone;
		myCard.email = user.email;
		myCard.title = user.title;
		myCard.organization = user.organization;
		myCard.version = '3.0';
		myCard.photo.embedFromString(base64Image, 'image/png')

		myCard.saveToFile('new.vcf');
		const file = `${__dirname}/new.vcf`;

		res.set('Content-Type', 'text/vcard; name="new.vcf"');
		res.set('Content-Disposition', 'inline; filename="new.vcf"');

		res.download(file);
	} catch (e) {
		console.log('error', e);
	}

})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})