import { IncomingWebhook } from '@slack/webhook';

export class SlackWebhook {

  private webhook: IncomingWebhook;
  
  constructor(url: string) {
    this.webhook = new IncomingWebhook(url);
  }
  async alert(payload: { name: string; code: string; message: string }) {
    let { name, code, message } = payload;
    await this.webhook.send({
      text: this.switchText(),
      attachments: [
        {
          fields: [
            { title: 'name', value: name, short: true },
            { title: 'Error code', value: code, short: true },
            { title: 'alert message', value: message, short: false },
          ],
        },
      ],
    });
  }
  private switchText(): string {
    switch (process.env.NODE_ENV) {
      case 'dev':
        return 'Development';
      case 'prod':
        return 'Production';
      case 'staging':
        return 'Testing';
      case 'jest':
        return 'Unit Test';
      default:
        return 'Local';
    }
  }
}