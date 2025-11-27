
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const configPath = path.join(__dirname, '../../config.json');
let config: any = {};

try {
  const configFile = fs.readFileSync(configPath, 'utf-8');
  config = JSON.parse(configFile);
} catch (error) {
  console.error('Failed to load config.json', error);
}

const transporter = nodemailer.createTransport({
  host: config.smtp?.host,
  port: config.smtp?.port,
  secure: config.smtp?.secure || false,
  auth: {
    user: config.smtp?.user,
    pass: config.smtp?.pass,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"${config.smtp?.fromName || 'Notiq App'}" <${config.smtp?.user}>`,
      to,
      subject,
      html,
    });
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email', error);
    throw error;
  }
};
