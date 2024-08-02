import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class HealthCheckController {

    @Get()
    check() {
        return 'OK client-gateway';
    }
}
