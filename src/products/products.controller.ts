import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    ParseIntPipe,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    ) {}

    @Post()
    createProduct(@Body() createProductDto: CreateProductDto) {
        return this.client
            .send({ cmd: 'create_product' }, createProductDto)
            .pipe(
                catchError((err) => {
                    throw new RpcException(err);
                }),
            );
    }

    @Get()
    findAllProducts(@Query() paginationDto: PaginationDto) {
        return this.client.send(
            { cmd: 'find_all_products' },
            paginationDto,
        );
    }

    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.client
            .send({ cmd: 'find_one_product' }, { id })
            .pipe(
                catchError((err) => {
                    throw new RpcException(err);
                }),
            );
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.client
            .send({ cmd: 'delete_product' }, { id })
            .pipe(
                catchError((err) => {
                    throw new RpcException(err);
                }),
            );
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProductDto: UpdateProductDto,
    ) {
        return this.client
            .send({ cmd: 'update_product' }, { id, ...updateProductDto })
            .pipe(
                catchError((err) => {
                    throw new RpcException(err);
                }),
            );
    }
}
