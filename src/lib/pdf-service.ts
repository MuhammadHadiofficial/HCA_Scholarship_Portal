import puppeteer from "puppeteer";
import { prisma } from "./prisma";

export interface ScholarshipCertificateData {
  studentName: string;
  studentId: string;
  scholarshipAmount: number;
  scholarshipType: string;
  intakeName: string;
  semester: string;
  year: string;
  awardedDate: string;
  certificateId: string;
}

export interface ReportData {
  title: string;
  period: string;
  statistics: {
    totalScholarships: number;
    totalAmount: number;
    totalStudents: number;
    totalAlumni: number;
    totalDonations: number;
  };
  details: any[];
}

export interface GuidelinesData {
  title: string;
  version: string;
  lastUpdated: string;
  sections: {
    title: string;
    content: string;
    subsections?: {
      title: string;
      content: string;
    }[];
  }[];
  contactInfo: {
    email: string;
    phone: string;
    office: string;
  };
}

export class PDFService {
  private static async generateHTML(template: string, data: any): Promise<string> {
    // Simple template replacement - in production, use a proper templating engine
    let html = template;
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, data[key]);
    });
    return html;
  }

  private static getScholarshipCertificateTemplate(): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Scholarship Certificate</title>
        <style>
          body {
            font-family: 'Times New Roman', serif;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .certificate {
            background: white;
            padding: 60px;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 800px;
            width: 100%;
            position: relative;
            overflow: hidden;
          }
          .certificate::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 8px;
            background: linear-gradient(90deg, #667eea, #764ba2);
          }
          .header {
            margin-bottom: 40px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 10px;
          }
          .title {
            font-size: 36px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          .subtitle {
            font-size: 18px;
            color: #666;
            margin-bottom: 40px;
          }
          .content {
            margin: 40px 0;
            line-height: 1.8;
          }
          .student-name {
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
            margin: 20px 0;
            text-transform: uppercase;
          }
          .details {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 10px;
            margin: 30px 0;
            text-align: left;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 5px 0;
            border-bottom: 1px solid #eee;
          }
          .detail-label {
            font-weight: bold;
            color: #333;
          }
          .detail-value {
            color: #666;
          }
          .amount {
            font-size: 24px;
            font-weight: bold;
            color: #28a745;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #eee;
          }
          .signature {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
          }
          .signature-box {
            text-align: center;
            flex: 1;
            margin: 0 20px;
          }
          .signature-line {
            border-top: 2px solid #333;
            margin: 20px 0 10px 0;
          }
          .certificate-id {
            font-size: 12px;
            color: #999;
            margin-top: 20px;
          }
          .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 120px;
            color: rgba(102, 126, 234, 0.1);
            z-index: -1;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="watermark">HCA</div>
          <div class="header">
            <div class="logo">HCA Scholarship Portal</div>
            <div class="title">Certificate of Scholarship</div>
            <div class="subtitle">Awarded for Academic Excellence and Financial Need</div>
          </div>
          
          <div class="content">
            <p>This is to certify that</p>
            <div class="student-name">{{studentName}}</div>
            <p>has been awarded a scholarship for demonstrating outstanding academic performance and financial need.</p>
          </div>
          
          <div class="details">
            <div class="detail-row">
              <span class="detail-label">Student ID:</span>
              <span class="detail-value">{{studentId}}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Scholarship Type:</span>
              <span class="detail-value">{{scholarshipType}}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Intake Period:</span>
              <span class="detail-value">{{intakeName}} - {{semester}} {{year}}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Scholarship Amount:</span>
              <span class="detail-value amount">${{scholarshipAmount}}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Awarded Date:</span>
              <span class="detail-value">{{awardedDate}}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>This scholarship is made possible through the generous contributions of our alumni network and is administered by the HCA Scholarship Committee.</p>
            
            <div class="signature">
              <div class="signature-box">
                <div class="signature-line"></div>
                <p>Scholarship Committee Chair</p>
              </div>
              <div class="signature-box">
                <div class="signature-line"></div>
                <p>University Registrar</p>
              </div>
            </div>
            
            <div class="certificate-id">
              Certificate ID: {{certificateId}}
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private static getGuidelinesTemplate(): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>{{title}}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
            line-height: 1.6;
          }
          .guidelines {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #667eea;
            padding-bottom: 20px;
          }
          .title {
            font-size: 28px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
          }
          .version-info {
            font-size: 14px;
            color: #666;
            margin-bottom: 5px;
          }
          .last-updated {
            font-size: 12px;
            color: #999;
          }
          .section {
            margin: 30px 0;
            page-break-inside: avoid;
          }
          .section-title {
            font-size: 20px;
            font-weight: bold;
            color: #333;
            margin-bottom: 15px;
            border-bottom: 2px solid #eee;
            padding-bottom: 5px;
            color: #667eea;
          }
          .subsection {
            margin: 20px 0 20px 20px;
          }
          .subsection-title {
            font-size: 16px;
            font-weight: bold;
            color: #555;
            margin-bottom: 10px;
          }
          .content {
            margin: 15px 0;
            text-align: justify;
          }
          .contact-section {
            margin-top: 40px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #667eea;
          }
          .contact-title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-bottom: 15px;
          }
          .contact-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          .contact-item {
            display: flex;
            align-items: center;
          }
          .contact-label {
            font-weight: bold;
            color: #555;
            margin-right: 10px;
            min-width: 80px;
          }
          .contact-value {
            color: #666;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #eee;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
          .important-note {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
          }
          .important-note strong {
            color: #856404;
          }
        </style>
      </head>
      <body>
        <div class="guidelines">
          <div class="header">
            <div class="title">{{title}}</div>
            <div class="version-info">Version {{version}}</div>
            <div class="last-updated">Last Updated: {{lastUpdated}}</div>
          </div>
          
          <div class="important-note">
            <strong>Important:</strong> These guidelines are subject to change. Please refer to the portal for the most current version.
          </div>
          
          {{#each sections}}
          <div class="section">
            <div class="section-title">{{title}}</div>
            <div class="content">{{content}}</div>
            {{#if subsections}}
              {{#each subsections}}
              <div class="subsection">
                <div class="subsection-title">{{title}}</div>
                <div class="content">{{content}}</div>
              </div>
              {{/each}}
            {{/if}}
          </div>
          {{/each}}
          
          <div class="contact-section">
            <div class="contact-title">Contact Information</div>
            <div class="contact-info">
              <div class="contact-item">
                <span class="contact-label">Email:</span>
                <span class="contact-value">{{contactInfo.email}}</span>
              </div>
              <div class="contact-item">
                <span class="contact-label">Phone:</span>
                <span class="contact-value">{{contactInfo.phone}}</span>
              </div>
              <div class="contact-item">
                <span class="contact-label">Office:</span>
                <span class="contact-value">{{contactInfo.office}}</span>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p>Generated on {{generatedDate}} | HCA Scholarship Portal</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private static getReportTemplate(): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>{{title}}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
          }
          .report {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #667eea;
            padding-bottom: 20px;
          }
          .title {
            font-size: 28px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
          }
          .period {
            font-size: 16px;
            color: #666;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
          }
          .stat-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border-left: 4px solid #667eea;
          }
          .stat-number {
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
          }
          .stat-label {
            font-size: 14px;
            color: #666;
            text-transform: uppercase;
          }
          .details-section {
            margin: 30px 0;
          }
          .section-title {
            font-size: 20px;
            font-weight: bold;
            color: #333;
            margin-bottom: 15px;
            border-bottom: 2px solid #eee;
            padding-bottom: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #eee;
          }
          th {
            background: #f8f9fa;
            font-weight: bold;
            color: #333;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #eee;
            text-align: center;
            color: #666;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="report">
          <div class="header">
            <div class="title">{{title}}</div>
            <div class="period">{{period}}</div>
          </div>
          
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">{{totalScholarships}}</div>
              <div class="stat-label">Total Scholarships</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${{totalAmount}}</div>
              <div class="stat-label">Total Amount</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{totalStudents}}</div>
              <div class="stat-label">Students Supported</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{totalAlumni}}</div>
              <div class="stat-label">Alumni Contributors</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${{totalDonations}}</div>
              <div class="stat-label">Total Donations</div>
            </div>
          </div>
          
          <div class="details-section">
            <div class="section-title">Detailed Breakdown</div>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Count</th>
                  <th>Amount</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {{#each details}}
                <tr>
                  <td>{{category}}</td>
                  <td>{{count}}</td>
                  <td>${{amount}}</td>
                  <td>{{percentage}}%</td>
                </tr>
                {{/each}}
              </tbody>
            </table>
          </div>
          
          <div class="footer">
            <p>Generated on {{generatedDate}} | HCA Scholarship Portal</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  static async generateScholarshipCertificate(data: ScholarshipCertificateData): Promise<Buffer> {
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      const template = this.getScholarshipCertificateTemplate();
      const html = await this.generateHTML(template, data);
      
      await page.setContent(html);
      await page.setViewport({ width: 1200, height: 1600 });
      
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in'
        }
      });
      
      await browser.close();
      return pdf;
    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error('Failed to generate certificate PDF');
    }
  }

  static async generateReport(data: ReportData): Promise<Buffer> {
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      const template = this.getReportTemplate();
      const html = await this.generateHTML(template, {
        ...data,
        generatedDate: new Date().toLocaleDateString()
      });
      
      await page.setContent(html);
      await page.setViewport({ width: 1200, height: 1600 });
      
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in'
        }
      });
      
      await browser.close();
      return pdf;
    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error('Failed to generate report PDF');
    }
  }

  static async generateGuidelines(data: GuidelinesData): Promise<Buffer> {
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      const template = this.getGuidelinesTemplate();
      const html = await this.generateHTML(template, {
        ...data,
        generatedDate: new Date().toLocaleDateString()
      });
      
      await page.setContent(html);
      await page.setViewport({ width: 1200, height: 1600 });
      
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in'
        }
      });
      
      await browser.close();
      return pdf;
    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error('Failed to generate guidelines PDF');
    }
  }
}

