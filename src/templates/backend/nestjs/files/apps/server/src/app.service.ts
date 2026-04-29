import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      framework: 'nestjs',
      project: '{{projectName}}',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
