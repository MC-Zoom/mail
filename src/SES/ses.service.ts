import { Injectable } from '@nestjs/common';
import { SES } from 'aws-sdk';

@Injectable()
export class SESService {
  private ses = new SES({ region: 'us-east-1' });

  async sendEmail(to: string, subject: string, body: string) {
    const params = {
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: body,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: 'youremail@example.com',
    };

    try {
      const result = await this.ses.sendEmail(params).promise();
      console.log(`Email sent to ${to}. Message ID: ${result.MessageId}`);
    } catch (err) {
      console.error(`Error sending email to ${to}: ${err.message}`);
    }
  }

  async sendTemplatedEmail(
    to: string,
    templateName: string,
    templateData: Record<string, any>,
  ) {
    const params = {
      Destination: {
        ToAddresses: [to],
      },
      Template: templateName,
      TemplateData: JSON.stringify(templateData),
      Source: 'youremail@example.com',
    };

    try {
      const result = await this.ses.sendTemplatedEmail(params).promise();
      console.log(`Email sent to ${to}. Message ID: ${result.MessageId}`);
    } catch (err) {
      console.error(`Error sending email to ${to}: ${err.message}`);
    }
  }

  async sendBulkTemplatedEmail(
    to: string[],
    templateName: string,
    templateData: Record<string, any>[],
  ) {
    const destinations = to.map((email, index) => ({
      Destination: {
        ToAddresses: [email],
      },
      ReplacementTemplateData: JSON.stringify(templateData[index]),
    }));

    const params = {
      Source: 'youremail@example.com',
      Template: templateName,
      Destinations: destinations,
    };

    try {
      const result = await this.ses.sendBulkTemplatedEmail(params).promise();
      console.log(`Bulk email sent. Message IDs: ${result.Status}`);
    } catch (err) {
      console.error(`Error sending bulk email: ${err.message}`);
    }
  }

  async createTemplate(name, subject, html, text) {
    const params = {
      Template: {
        TemplateName: name,
        SubjectPart: subject,
        HtmlPart: html,
        TextPart: text,
      },
    };

    this.ses.createTemplate(params, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Template created successfully:', data);
      }
    });
  }
}
