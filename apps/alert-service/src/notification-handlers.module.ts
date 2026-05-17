import { Module } from '@nestjs/common';
import { ConsoleAlertHandler } from './notification-handlers/console-handler.service';
import { AlertHandlerInterface } from './notification-handlers/alert-handler.interface';

@Module({
  providers: [
    ConsoleAlertHandler,
    {
      provide: 'CONSOLE_HANDLER',
      useClass: ConsoleAlertHandler,
    },
  ],
  exports: ['CONSOLE_HANDLER'],
})
export class NotificationHandlersModule {}