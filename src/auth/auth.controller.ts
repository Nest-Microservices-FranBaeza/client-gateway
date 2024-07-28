import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { User } from './decorator/user.decorator';
import { Token } from './decorator/token.decorator';

@Controller('auth')
export class AuthController {
    constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

    @Post('login')
    loginUser(@Body() loginUserDto: LoginUserDto) {
        return this.client.send('auth.login.user', loginUserDto).pipe(
            catchError((err) => {
                throw new RpcException(err);
            }),
        );
    }

    @Post('register')
    registerUser(@Body() registerUserDto: RegisterUserDto) {
        return this.client.send('auth.register.user', registerUserDto).pipe(
            catchError((err) => {
                throw new RpcException(err);
            }),
        );
    }

    @UseGuards(AuthGuard)
    @Get('verify')
    verifyUser(
        @User() user: { id: number; name: string; email: string },
        @Token() token: string,
    ) {
        return { user, token };
        // return this.client.send('auth.verify.user', {}).pipe(
        //     catchError((err) => {
        //         throw new RpcException(err);
        //     }),
        // );
    }
}
