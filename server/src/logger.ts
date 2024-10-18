// server/src/logger.ts
import winston from 'winston';
import path from 'path';

const logDir = path.join(__dirname, '../logs');

class Logger {
    private logger: winston.Logger;

    constructor() {
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
                new winston.transports.File({ filename: path.join(logDir, 'combined.log') }),
            ],
        });
    }

    error(error?: Error|any ,message?: string, ) {
        this.logger.error({
            message,
            stack: error?.stack,
            err_message:error?.message
        });
    }

    info(message: string) {
        this.logger.info(message);
    }

    // 다른 로그 레벨에 대한 메서드 추가 가능
    warn(message: string) {
        this.logger.warn(message);
    }
}

export default new Logger(); // Singleton 패턴으로 인스턴스 내보내기
