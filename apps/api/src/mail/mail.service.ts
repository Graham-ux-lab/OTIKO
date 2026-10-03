import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private resend: Resend | null = null;
  private smtp: nodemailer.Transporter | null = null;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpUser && smtpPass) {
      this.smtp = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });
      this.logger.log('SMTP email client ready');
    } else if (apiKey) {
      this.resend = new Resend(apiKey);
      this.logger.log('✅ Resend email client ready');
    } else {
      this.logger.warn('Email is not configured. Set Gmail SMTP credentials or RESEND_API_KEY.');
    }
  }

  async sendMail(options: { to: string; subject: string; html: string }): Promise<boolean> {
    if (!this.smtp && !this.resend) {
      this.logger.error('Email not sent: configure Gmail SMTP or RESEND_API_KEY');
      return false;
    }

    try {
      if (this.smtp) {
        const info = await this.smtp.sendMail({
          from: process.env.EMAIL_FROM || process.env.SMTP_USER,
          to: options.to,
          subject: options.subject,
          html: options.html,
        });
        if (!info.messageId) throw new Error('SMTP server did not return a message id');
      } else if (this.resend) {
        const { data, error } = await this.resend.emails.send({
          from: process.env.EMAIL_FROM || 'OTIKO <onboarding@resend.dev>',
          to: options.to,
          subject: options.subject,
          html: options.html,
        });
        if (error) throw new Error(error.message);
        if (!data?.id) throw new Error('Email provider did not return a message id');
      }
      this.logger.log('Email accepted by provider for ' + options.to);
      return true;
    } catch (error: unknown) {
      this.logger.error('Failed to send email to ' + options.to + ': ' + (error instanceof Error ? error.message : String(error)));
      return false;
    }
  }
  async sendOrganizerVerification(email: string, name: string, token: string) {
    const verifyUrl = (process.env.FRONTEND_URL || 'http://localhost:5173') + '/verify-email/' + token;

    const html = '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">' +
      '<div style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">' +
      '<h1 style="color: white; margin: 0; font-size: 32px;">OTIKO</h1>' +
      '<p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">The Pulse of Events</p>' +
      '</div>' +
      '<div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px;">' +
      '<h2 style="color: #111827;">Hi ' + name + ',</h2>' +
      '<p style="color: #374151; line-height: 1.6;">Thanks for signing up as an organizer on OTIKO. Please verify your email to continue:</p>' +
      '<div style="text-align: center; margin: 30px 0;">' +
      '<a href="' + verifyUrl + '" style="background: #2563eb; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Verify Email</a>' +
      '</div>' +
      '<p style="color: #6b7280; font-size: 14px;">Or paste this link into your browser:</p>' +
      '<p style="color: #2563eb; font-size: 13px; word-break: break-all;">' + verifyUrl + '</p>' +
      '<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">' +
      '<p style="color: #9ca3af; font-size: 12px; text-align: center;">Once verified, your organizer account will be reviewed by our team.</p>' +
      '</div></div>';

    await this.sendMail({ to: email, subject: 'Verify your OTIKO organizer account', html });
  }

  async sendOrganizerApproved(email: string, name: string, organizationName: string): Promise<boolean> {
    const dashboardUrl = (process.env.FRONTEND_URL || 'http://localhost:5173') + '/login';

    const html = '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">' +
      '<div style="background: linear-gradient(135deg, #059669, #10b981); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">' +
      '<h1 style="color: white; margin: 0; font-size: 32px;">🎉 OTIKO</h1>' +
      '<p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">You are approved!</p>' +
      '</div>' +
      '<div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px;">' +
      '<h2 style="color: #111827;">Congratulations, ' + name + '!</h2>' +
      '<p style="color: #374151; line-height: 1.6;">Your organizer account for <strong>' + organizationName + '</strong> has been approved. You can now log in and start creating events.</p>' +
      '<div style="text-align: center; margin: 30px 0;">' +
      '<a href="' + dashboardUrl + '" style="background: #059669; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Go to Dashboard</a>' +
      '</div>' +
      '</div></div>';

    return this.sendMail({ to: email, subject: 'Your OTIKO organizer account has been approved', html });
  }

  async sendOrganizerRejected(email: string, name: string, reason: string) {
    const html = '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">' +
      '<div style="background: #dc2626; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">' +
      '<h1 style="color: white; margin: 0; font-size: 32px;">OTIKO</h1>' +
      '</div>' +
      '<div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px;">' +
      '<h2 style="color: #111827;">Hi ' + name + ',</h2>' +
      '<p style="color: #374151; line-height: 1.6;">Unfortunately, your organizer application was not approved at this time.</p>' +
      '<div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px 20px; margin: 20px 0;">' +
      '<p style="color: #991b1b; margin: 0; font-weight: bold;">Reason:</p>' +
      '<p style="color: #7f1d1d; margin: 8px 0 0;">' + reason + '</p>' +
      '</div>' +
      '</div></div>';

    await this.sendMail({ to: email, subject: 'OTIKO organizer application update', html });
  }

  async sendTicketEmail(options: {
    to: string;
    customerName: string;
    eventTitle: string;
    eventDate: string;
    eventVenue: string;
    ticketType: string;
    ticketNumber: string;
    qrCodeDataUrl: string;
    orderNumber: string;
    amount: number;
  }) {
    const html = '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">' +
      '<div style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">' +
      '<h1 style="color: white; margin: 0; font-size: 32px;">🎟️ OTIKO</h1>' +
      '<p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">Your ticket is ready</p>' +
      '</div>' +
      '<div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px;">' +
      '<h2 style="color: #111827;">Hi ' + options.customerName + ',</h2>' +
      '<p style="color: #374151; line-height: 1.6;">Thanks for your purchase! Here is your ticket for <strong>' + options.eventTitle + '</strong>.</p>' +
      '<div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin: 24px 0;">' +
      '<p style="color: #111827; margin: 6px 0;"><strong>Date:</strong> ' + options.eventDate + '</p>' +
      '<p style="color: #111827; margin: 6px 0;"><strong>Venue:</strong> ' + options.eventVenue + '</p>' +
      '<p style="color: #111827; margin: 6px 0;"><strong>Ticket Type:</strong> ' + options.ticketType + '</p>' +
      '<p style="color: #111827; margin: 6px 0;"><strong>Ticket No.:</strong> ' + options.ticketNumber + '</p>' +
      '<p style="color: #111827; margin: 6px 0;"><strong>Order No.:</strong> ' + options.orderNumber + '</p>' +
      '<p style="color: #059669; margin: 6px 0;"><strong>Amount Paid:</strong> KSh ' + options.amount.toLocaleString() + '</p>' +
      '</div>' +
      '<div style="text-align: center; border: 2px dashed #e5e7eb; border-radius: 12px; padding: 24px; margin: 24px 0;">' +
      '<p style="color: #6b7280; margin: 0 0 16px; font-size: 14px; font-weight: bold;">SCAN AT THE ENTRANCE</p>' +
      '<img src="' + options.qrCodeDataUrl + '" alt="QR Code" style="width: 200px; height: 200px; display: block; margin: 0 auto;" />' +
      '<p style="color: #9ca3af; margin: 16px 0 0; font-size: 12px;">Show this QR code at the event entrance.</p>' +
      '</div>' +
      '</div></div>';

    await this.sendMail({ to: options.to, subject: '🎟️ Your ticket for ' + options.eventTitle, html });
  }
}
