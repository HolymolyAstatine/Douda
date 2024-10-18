import winston from 'winston';
import path from 'path';

const logDir = path.join(__dirname, '../logs');

// 커스텀 포맷 정의
const logFormat = winston.format.printf(({ level, message, timestamp, stack, err_message }) => {
    const logMessage = stack ? `${message} - ${err_message}\n${stack}` : message;
    return `[${timestamp}] ${level.toUpperCase()}: ${logMessage}`;
});

class Logger {
    private logger: winston.Logger;

    constructor() {
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(), // 타임스탬프 추가
                logFormat // 커스텀 포맷 사용
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
                new winston.transports.File({ filename: path.join(logDir, 'combined.log') }),
            ],
        });
    }

    error(error?: Error | any, message?: string) {
        this.logger.error({
            message,
            stack: error?.stack,
            err_message: error?.message
        });
    }

    info(message: string) {
        this.logger.info(message);
    }

    warn(message: string) {
        this.logger.warn(message);
    }
}

export default new Logger(); // Singleton 패턴으로 인스턴스 내보내기
