const nodemailer = require('nodemailer');

async function sendMaill({from,to,subject,text,html}){
  try {
    var transport = nodemailer.createTransport({
      host: process.env.MAIL_HOST, 
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
      }
    });
    let info = await transport.sendMail({
      from:`InShare<${from}>`,
      to,
      subject,
      text,
      html
    });
    console.log(info);
  } catch (error) {
    console.log(error);
  }

}

module.exports = sendMaill;