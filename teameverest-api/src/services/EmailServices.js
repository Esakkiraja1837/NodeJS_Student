const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const logger = require('../config/logger');
const { constants, errors } = require('../utils');

const EmailServices = {
  sendMail: async (userData) => {
    try {
      const env = process.env;
      const config = {
        userName: env.EMAIL_USERNAME,
        password: env.EMAIL_PASSWORD
      };
      const transporter = nodemailer.createTransport({
        service: env.EMAIL_SERVICE,
        host: env.EMAIL_HOST,
        port: env.EMAIL_SERVICE_PORT,
        secure: true,
        auth: {
          user: config.userName,
          pass: config.password
        }
      });
      // point to the template folder
      const handlebarOptions = {
        viewEngine: {
          defaultLayout: false,
          partialsDir: path.resolve('./src/email_templates/')
        },
        viewPath: path.resolve('./src/email_templates/')
      };
      let subject = 'Activate Your Account';
      if (userData.templateName === 'forgot_password') {
        subject = 'Reset Your Account Password';
      }
      // use a template file with nodemailer
      transporter.use('compile', hbs(handlebarOptions));
      const mailData = {
        from: `"Team Everest" <${config.userName}>`,
        to: userData.email,
        subject: `Team Everest - ${subject}`,
        template: userData.templateName,
        context: {
          name: userData.firstname,
          link: `${env.PASSWORD_SETUP_URL}?activationCode=${userData.activationCode}`
        }
      };
      return await transporter.sendMail(mailData);
    } catch (error) {
      logger.error(`Error while sending user activation code to ${userData.firstname}`);
      logger.error(errors.ERROR_IN_SENDING_USER_ACTIVATION_EMAIL, error);
      return {
        code: constants.status.SERVER_ERROR,
        errors: { message: errors.ERROR_IN_SENDING_USER_ACTIVATION_EMAIL }
      };
    }
  }
};

module.exports = EmailServices;
