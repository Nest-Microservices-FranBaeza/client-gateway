import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Inject,
    Query,
    Patch,
    ParseUUIDPipe,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { catchError } from 'rxjs';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from 'src/common';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { StatusDto } from './dto/status.dto';

@Controller('orders')
export class OrdersController {
    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    ) {}

    @Post()
    create(@Body() createOrderDto: CreateOrderDto) {
        console.log('')
        return this.client.send('createOrder', createOrderDto).pipe(
            catchError((err) => {
                throw new RpcException(err);
            }),
        );
    }

    @Get()
    findAll(@Query() paginationDto: OrderPaginationDto) {
        return this.client.send('findAllOrders', paginationDto).pipe(
            catchError((err) => {
                throw new RpcException(err);
            }),
        );
    }

    @Get('id/:id')
    findOne(@Param('id') id: string) {
        return this.client.send('findOneOrder', { id }).pipe(
            catchError((err) => {
                throw new RpcException(err);
            }),
        );
    }

    @Get(':status')
    findByStatus(
        @Param() status: StatusDto,
        @Query() paginationDto: PaginationDto,
    ) {
        console.log(status, paginationDto);
        return this.client
            .send('findByStatus', { status: status.status, ...paginationDto })
            .pipe(
                catchError((err) => {
                    throw new RpcException(err);
                }),
            );
    }

    @Patch(':id')
    changeStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() statusDto: StatusDto,
    ) {
        return this.client
            .send('changeOrderStatus', { id, status: statusDto.status })
            .pipe(
                catchError((err) => {
                    throw new RpcException(err);
                }),
            );
    }
}
