
import prisma from '../plugins/prisma';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { sendEmail } from './email.service';

export const requestPasswordReset = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Return true even if user not found to prevent enumeration
    return true;
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken,
      resetTokenExpiry,
    },
  });

  const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
  const html = `
    <p>You requested a password reset.</p>
    <p>Click this link to reset your password:</p>
    <a href="${resetLink}">${resetLink}</a>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  await sendEmail(email, 'Password Reset Request', html);
  return true;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new Error('Invalid or expired token');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return true;
};
