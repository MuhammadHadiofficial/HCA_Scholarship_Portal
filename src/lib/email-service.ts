import nodemailer from "nodemailer";

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailData {
  to: string;
  from?: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private static transporter: nodemailer.Transporter;

  private static async getTransporter(): Promise<nodemailer.Transporter> {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
    return this.transporter;
  }

  static async sendEmail(data: EmailData): Promise<boolean> {
    try {
      const transporter = await this.getTransporter();
      
      const mailOptions = {
        from: data.from || process.env.SMTP_FROM || "noreply@hca.edu",
        to: data.to,
        subject: data.subject,
        html: data.html,
        text: data.text || this.stripHtml(data.html),
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${data.to}`);
      return true;
    } catch (error) {
      console.error("Email sending failed:", error);
      return false;
    }
  }

  private static stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, "");
  }

  // Email Templates
  static getScholarshipApprovedTemplate(studentName: string, scholarshipAmount: number, intakeName: string): EmailTemplate {
    return {
      subject: "🎉 Scholarship Approved - Congratulations!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🎉 Scholarship Approved!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Congratulations on your achievement!</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Dear ${studentName},</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              We are delighted to inform you that your scholarship application has been approved! 
              Your dedication to academic excellence and demonstrated financial need has been recognized.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
              <h3 style="color: #333; margin: 0 0 15px 0;">Scholarship Details</h3>
              <p style="margin: 5px 0;"><strong>Amount:</strong> $${scholarshipAmount.toLocaleString()}</p>
              <p style="margin: 5px 0;"><strong>Intake Period:</strong> ${intakeName}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">Approved</span></p>
            </div>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              The scholarship funds will be disbursed according to the schedule outlined in your award letter. 
              You can track the disbursement status through your student portal.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/student/scholarships" 
                 style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                View Scholarship Details
              </a>
            </div>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              If you have any questions about your scholarship, please don't hesitate to contact the 
              scholarship office at scholarships@hca.edu or call us at +1 (555) 123-4567.
            </p>
            
            <p style="color: #555; line-height: 1.6;">
              Congratulations again on this achievement! We look forward to supporting your academic journey.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 14px; margin: 0;">
                Best regards,<br>
                HCA Scholarship Committee<br>
                HCA University
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
        Scholarship Approved - Congratulations!
        
        Dear ${studentName},
        
        We are delighted to inform you that your scholarship application has been approved! 
        Your dedication to academic excellence and demonstrated financial need has been recognized.
        
        Scholarship Details:
        - Amount: $${scholarshipAmount.toLocaleString()}
        - Intake Period: ${intakeName}
        - Status: Approved
        
        The scholarship funds will be disbursed according to the schedule outlined in your award letter. 
        You can track the disbursement status through your student portal.
        
        If you have any questions about your scholarship, please don't hesitate to contact the 
        scholarship office at scholarships@hca.edu or call us at +1 (555) 123-4567.
        
        Congratulations again on this achievement! We look forward to supporting your academic journey.
        
        Best regards,
        HCA Scholarship Committee
        HCA University
      `
    };
  }

  static getApplicationStatusUpdateTemplate(studentName: string, status: string, applicationId: string): EmailTemplate {
    const statusEmojis = {
      "SUBMITTED": "📝",
      "UNDER_REVIEW": "🔍",
      "APPROVED": "✅",
      "REJECTED": "❌",
      "WITHDRAWN": "↩️"
    };

    const statusMessages = {
      "SUBMITTED": "Your application has been successfully submitted and is now in our review queue.",
      "UNDER_REVIEW": "Your application is currently being reviewed by our scholarship committee.",
      "APPROVED": "Congratulations! Your application has been approved for a scholarship.",
      "REJECTED": "We regret to inform you that your application was not approved at this time.",
      "WITHDRAWN": "Your application has been withdrawn as requested."
    };

    return {
      subject: `${statusEmojis[status as keyof typeof statusEmojis]} Application Status Update`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Application Status Update</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              Dear ${studentName},
            </p>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              ${statusMessages[status as keyof typeof statusMessages]}
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #333; margin: 0 0 15px 0;">Application Details</h3>
              <p style="margin: 5px 0;"><strong>Application ID:</strong> ${applicationId}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> ${status.replace("_", " ")}</p>
              <p style="margin: 5px 0;"><strong>Updated:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/student/applications" 
                 style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                View Application
              </a>
            </div>
            
            <p style="color: #555; line-height: 1.6;">
              If you have any questions about your application status, please contact us at 
              scholarships@hca.edu or call +1 (555) 123-4567.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 14px; margin: 0;">
                Best regards,<br>
                HCA Scholarship Committee<br>
                HCA University
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
        Application Status Update
        
        Dear ${studentName},
        
        ${statusMessages[status as keyof typeof statusMessages]}
        
        Application Details:
        - Application ID: ${applicationId}
        - Status: ${status.replace("_", " ")}
        - Updated: ${new Date().toLocaleDateString()}
        
        If you have any questions about your application status, please contact us at 
        scholarships@hca.edu or call +1 (555) 123-4567.
        
        Best regards,
        HCA Scholarship Committee
        HCA University
      `
    };
  }

  static getPaymentConfirmationTemplate(donorName: string, amount: number, paymentId: string): EmailTemplate {
    return {
      subject: "💝 Thank You for Your Donation!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">💝 Thank You!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Your donation has been received</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Dear ${donorName},</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              Thank you for your generous donation to the HCA Scholarship Fund! Your contribution 
              will directly support deserving students in their educational journey.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
              <h3 style="color: #333; margin: 0 0 15px 0;">Donation Details</h3>
              <p style="margin: 5px 0;"><strong>Amount:</strong> $${amount.toLocaleString()}</p>
              <p style="margin: 5px 0;"><strong>Payment ID:</strong> ${paymentId}</p>
              <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">Confirmed</span></p>
            </div>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              Your donation will be used to provide scholarships to students who demonstrate 
              academic excellence and financial need. You can track the impact of your donation 
              through our public dashboard.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/public" 
                 style="background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                View Impact Dashboard
              </a>
            </div>
            
            <p style="color: #555; line-height: 1.6;">
              Please keep this email for your records. A tax receipt will be sent to you separately 
              for your donation.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 14px; margin: 0;">
                With gratitude,<br>
                HCA Alumni Relations Team<br>
                HCA University
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
        Thank You for Your Donation!
        
        Dear ${donorName},
        
        Thank you for your generous donation to the HCA Scholarship Fund! Your contribution 
        will directly support deserving students in their educational journey.
        
        Donation Details:
        - Amount: $${amount.toLocaleString()}
        - Payment ID: ${paymentId}
        - Date: ${new Date().toLocaleDateString()}
        - Status: Confirmed
        
        Your donation will be used to provide scholarships to students who demonstrate 
        academic excellence and financial need. You can track the impact of your donation 
        through our public dashboard.
        
        Please keep this email for your records. A tax receipt will be sent to you separately 
        for your donation.
        
        With gratitude,
        HCA Alumni Relations Team
        HCA University
      `
    };
  }

  // Convenience methods for common notifications
  static async sendScholarshipApprovedEmail(studentEmail: string, studentName: string, scholarshipAmount: number, intakeName: string): Promise<boolean> {
    const template = this.getScholarshipApprovedTemplate(studentName, scholarshipAmount, intakeName);
    return this.sendEmail({
      to: studentEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  static async sendApplicationStatusEmail(studentEmail: string, studentName: string, status: string, applicationId: string): Promise<boolean> {
    const template = this.getApplicationStatusUpdateTemplate(studentName, status, applicationId);
    return this.sendEmail({
      to: studentEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  static async sendPaymentConfirmationEmail(donorEmail: string, donorName: string, amount: number, paymentId: string): Promise<boolean> {
    const template = this.getPaymentConfirmationTemplate(donorName, amount, paymentId);
    return this.sendEmail({
      to: donorEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }
}

