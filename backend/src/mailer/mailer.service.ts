// import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
// import { Injectable } from '@nestjs/common';
// import { ParcelStatus } from '@prisma/client';

// interface Parcel {
//   pickupLocation: string;
//   destination: string;
//   weight: number;
//   cost: number;
// }

// @Injectable()
// export class MailerService {
//   constructor(private mailer: NestMailerService) {}

//   async sendWelcomeEmail(email: string, name: string) {
//     try {
//       await this.mailer.sendMail({
//         to: email,
//         subject: 'Welcome to SendIT 🚀',
//         template: 'welcome',
//         context: { name },
//       });
//     } catch (error) {
//       // Log the error but don't fail the registration
//       console.log(`Failed to send welcome email to ${email}:`, error.message);
//     }
//   }

//   async sendResetPasswordEmail(email: string, token: string) {
//     try {
//       const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
//       await this.mailer.sendMail({
//         to: email,
//         subject: 'Reset Your Password',
//         template: 'reset-password',
//         context: { resetLink },
//       });
//     } catch (error) {
//       // Log the error but don't fail the password reset
//       console.log(
//         `Failed to send reset password email to ${email}:`,
//         error.message,
//       );
//     }
//   }

//   async sendParcelCreatedEmail(
//     senderEmail: string,
//     receiverEmail: string,
//     parcel: Parcel,
//   ) {
//     try {
//       const data = {
//         pickupLocation: parcel.pickupLocation,
//         destination: parcel.destination,
//         weight: parcel.weight,
//         cost: parcel.cost,
//       };

//       await this.mailer.sendMail({
//         to: [senderEmail, receiverEmail],
//         subject: 'New Parcel Created 📦',
//         template: 'parcel-created',
//         context: data,
//       });
//     } catch (error) {
//       // Log the error but don't fail the parcel creation
//       console.log(`Failed to send parcel created email:`, error.message);
//     }
//   }

//   async sendParcelStatusUpdateEmail(
//     senderEmail: string,
//     receiverEmail: string,
//     status: ParcelStatus,
//   ) {
//     try {
//       await this.mailer.sendMail({
//         to: [senderEmail, receiverEmail],
//         subject: `Parcel Status Updated: ${status}`,
//         template: 'parcel-status',
//         context: { status },
//       });
//     } catch (error) {
//       // Log the error but don't fail the status update
//       console.log(`Failed to send parcel status update email:`, error.message);
//     }
//   }

//   sendSms(to: string, body: string) {
//     // Simple SMS simulation - in production, replace with actual SMS service
//     console.log(`SMS to ${to}: ${body}`);
//     return { success: true, message: 'SMS sent successfully' };
//   }
// }

import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ParcelStatus } from '@prisma/client';

interface Parcel {
  pickupLocation: string;
  destination: string;
  weight: number;
  cost: number;
}

@Injectable()
export class MailerService {
  constructor(private mailer: NestMailerService) {}

  async sendWelcomeEmail(email: string, name: string) {
    try {
      const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to SendIT</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f4f4f4;
                }
                .container {
                    background-color: white;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                h2 {
                    color: #2196f3;
                    margin-bottom: 20px;
                }
                p {
                    margin-bottom: 15px;
                }
                .footer {
                    margin-top: 30px;
                    text-align: center;
                    color: #666;
                    font-size: 14px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Hello ${name},</h2>
                <p>Welcome to SendIT! We're glad you're here.</p>
                <p>You can now send and receive parcels faster and more reliably.</p>
                
                <div class="footer">
                    <p>Thank you for choosing SendIT!</p>
                </div>
            </div>
        </body>
        </html>
      `;

      await this.mailer.sendMail({
        to: email,
        subject: 'Welcome to SendIT 🚀',
        html: htmlTemplate,
      });
    } catch (error) {
      // Log the error but don't fail the registration
      console.log(
        `Failed to send welcome email to ${email}:`,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async sendResetPasswordEmail(email: string, token: string) {
    try {
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

      const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Password</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f4f4f4;
                }
                .container {
                    background-color: white;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                h2 {
                    color: #2196f3;
                    margin-bottom: 20px;
                }
                p {
                    margin-bottom: 15px;
                }
                .reset-button {
                    display: inline-block;
                    padding: 12px 30px;
                    background-color: #2196f3;
                    color: white;
                    border-radius: 5px;
                    text-decoration: none;
                    font-weight: bold;
                    margin: 20px 0;
                    transition: background-color 0.3s;
                }
                .reset-button:hover {
                    background-color: #1976d2;
                }
                .footer {
                    margin-top: 30px;
                    text-align: center;
                    color: #666;
                    font-size: 14px;
                }
                .warning {
                    background-color: #fff3cd;
                    border: 1px solid #ffeaa7;
                    color: #856404;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Reset Password</h2>
                <p>You requested to reset your password. Click the button below to reset your password:</p>
                
                <div style="text-align: center;">
                    <a href="${resetLink}" class="reset-button">Reset Password</a>
                </div>
                
                <div class="warning">
                    <p><strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request this password reset, please ignore this email.</p>
                </div>
                
                <div class="footer">
                    <p>If the button doesn't work, copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; color: #2196f3;">${resetLink}</p>
                </div>
            </div>
        </body>
        </html>
      `;

      await this.mailer.sendMail({
        to: email,
        subject: 'Reset Your Password',
        html: htmlTemplate,
      });
    } catch (error) {
      // Log the error but don't fail the password reset
      console.log(
        `Failed to send reset password email to ${email}:`,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async sendParcelCreatedEmail(
    senderEmail: string,
    receiverEmail: string,
    parcel: Parcel,
  ) {
    try {
      const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Parcel Created</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f4f4f4;
                }
                .container {
                    background-color: white;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                h2 {
                    color: #2196f3;
                    margin-bottom: 20px;
                }
                p {
                    margin-bottom: 15px;
                }
                .parcel-details {
                    background-color: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    border-left: 4px solid #2196f3;
                    margin: 20px 0;
                }
                .parcel-details ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .parcel-details li {
                    padding: 8px 0;
                    border-bottom: 1px solid #e9ecef;
                }
                .parcel-details li:last-child {
                    border-bottom: none;
                }
                .parcel-details strong {
                    color: #2196f3;
                    display: inline-block;
                    width: 120px;
                }
                .footer {
                    margin-top: 30px;
                    text-align: center;
                    color: #666;
                    font-size: 14px;
                }
                .status-badge {
                    background-color: #28a745;
                    color: white;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>📦 Parcel Created Successfully</h2>
                <p>A parcel has just been created with the following details:</p>
                
                <div class="parcel-details">
                    <ul>
                        <li><strong>Pickup:</strong> ${parcel.pickupLocation}</li>
                        <li><strong>Destination:</strong> ${parcel.destination}</li>
                        <li><strong>Weight:</strong> ${parcel.weight} kg</li>
                        <li><strong>Cost:</strong> KES ${parcel.cost}</li>
                    </ul>
                </div>
                
                <p>Your parcel is now in the system and will be processed shortly. You'll receive updates as the status changes.</p>
                
                <div class="footer">
                    <p>Thank you for using SendIT!</p>
                    <p><span class="status-badge">CREATED</span></p>
                </div>
            </div>
        </body>
        </html>
      `;

      await this.mailer.sendMail({
        to: [senderEmail, receiverEmail],
        subject: 'New Parcel Created 📦',
        html: htmlTemplate,
      });
    } catch (error) {
      // Log the error but don't fail the parcel creation
      console.log(
        `Failed to send parcel created email:`,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async sendParcelStatusUpdateEmail(
    senderEmail: string,
    receiverEmail: string,
    status: ParcelStatus,
  ) {
    try {
      // Get status-specific styling and messages
      const getStatusInfo = (status: ParcelStatus) => {
        switch (status) {
          case 'PENDING':
            return {
              color: '#6c757d',
              message: 'Your parcel has been created and is awaiting pickup.',
            };

          case 'IN_TRANSIT':
            return {
              color: '#ffc107',
              message: 'Your parcel is on its way to the destination.',
            };

          case 'DELIVERED':
            return {
              color: '#28a745',
              message:
                '🎉 Congratulations! Your parcel has been delivered successfully!',
            };

          case 'CANCELLED':
            return {
              color: '#dc3545',
              message:
                '❌ Your parcel delivery has been cancelled. Please contact support for assistance.',
            };
          default:
            return {
              color: '#6c757d',
              message: 'Parcel status has been updated.',
            };
        }
      };

      const statusInfo = getStatusInfo(status);

      const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Parcel Status Updated</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f4f4f4;
                }
                .container {
                    background-color: white;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                h2 {
                    color: #2196f3;
                    margin-bottom: 20px;
                }
                p {
                    margin-bottom: 15px;
                }
                .status-container {
                    background-color: #f8f9fa;
                    padding: 25px;
                    border-radius: 8px;
                    text-align: center;
                    margin: 20px 0;
                }
                .status-badge {
                    display: inline-block;
                    padding: 12px 30px;
                    background-color: ${statusInfo.color};
                    color: white;
                    border-radius: 25px;
                    font-size: 16px;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .footer {
                    margin-top: 30px;
                    text-align: center;
                    color: #666;
                    font-size: 14px;
                }
                .timeline {
                    margin: 20px 0;
                    padding: 20px;
                    background-color: #f8f9fa;
                    border-radius: 8px;
                }
                .timeline-item {
                    display: flex;
                    align-items: center;
                    margin: 10px 0;
                }
                .timeline-dot {
                    width: 12px;
                    height: 12px;
                    background-color: #dee2e6;
                    border-radius: 50%;
                    margin-right: 15px;
                }
                .timeline-dot.active {
                    background-color: #2196f3;
                }
                .status-message {
                    background-color: ${status === 'DELIVERED' ? '#d4edda' : status === 'CANCELLED' ? '#f8d7da' : '#d1ecf1'};
                    color: ${status === 'DELIVERED' ? '#155724' : status === 'CANCELLED' ? '#721c24' : '#0c5460'};
                    padding: 15px;
                    border-radius: 5px;
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>📦 Parcel Status Updated</h2>
                <p>The delivery status of your parcel has changed:</p>
                
                <div class="status-container">
                    <div class="status-badge">${status}</div>
                </div>
                
                <div class="status-message">
                    <p><strong>${statusInfo.message}</strong></p>
                </div>
                
                <div class="timeline">
                    <p><strong>Delivery Timeline:</strong></p>
                    <div class="timeline-item">
                        <div class="timeline-dot active"></div>
                        <span>Created</span>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-dot ${['PICKED_UP', 'IN_TRANSIT', 'DELIVERED'].includes(status) ? 'active' : ''}"></div>
                        <span>Picked Up</span>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-dot ${['IN_TRANSIT', 'DELIVERED'].includes(status) ? 'active' : ''}"></div>
                        <span>In Transit</span>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-dot ${status === 'DELIVERED' ? 'active' : ''}"></div>
                        <span>Delivered</span>
                    </div>
                </div>
                
                <div class="footer">
                    <p>Thank you for using SendIT!</p>
                    <p>For any questions, please contact our support team.</p>
                </div>
            </div>
        </body>
        </html>
      `;

      await this.mailer.sendMail({
        to: [senderEmail, receiverEmail],
        subject: `Parcel Status Updated: ${status}`,
        html: htmlTemplate,
      });
    } catch (error) {
      // Log the error but don't fail the status update
      console.log(
        `Failed to send parcel status update email:`,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  sendSms(to: string, body: string) {
    // Simple SMS simulation - in production, replace with actual SMS service
    console.log(`SMS to ${to}: ${body}`);
    return { success: true, message: 'SMS sent successfully' };
  }
}
