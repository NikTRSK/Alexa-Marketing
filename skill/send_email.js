const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'alexa.skill.mailer@gmail.com',
        pass: 'Cq365LZVvjjn'
    }
});

exports.send_email = function(to, subject, msg, attachment) {
    const mailOptions = {
        from: 'NBCU Promo Skill <alexa.skill.mailer@gmail.com>',
        to: to,
        subject: subject,
        text: msg,
        attachments: { filename: 'report.xls', content: attachment, encoding: 'binary' }
        // attachments: { filename: 'test.txt', content: 'testing' }
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}