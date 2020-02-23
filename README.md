# valid-email-check

Verify email address by checking MX records and SMTP connection.

## Installation

To install via npm:
```
npm install valid-email-check
```

## Usage

*  Verify Email to check if it exists:
	```
		const validEmailCheck = require('valid-email-check');

		validEmailCheck.check('email@domain.com', function(response,error){
			console.log('email verification result: '+res);
		});
	```

### Maintained by [mails.wtf](https://mails.wtf/?utm_source=npm&utm_medium=readme&utm_campaign=valid-email-check)

<a href="https://mails.wtf">
<p align="center">
  <img src="https://mails.wtf/logo.png" alt="mails.wtf Email Finder">
  <br>
</p>
</a>

