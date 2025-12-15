import {
    IsString,
    IsNotEmpty,
    IsArray,
    IsInt,
    Min,
    MinLength,
    MaxLength,
    ArrayNotEmpty,
    ValidateNested,
    IsNumber,
} from "class-validator";

import { Type } from "class-transformer";

export class CreateOrderDtoProduct {
    @IsString({ message: 'El id del producto debe ser una cadena' })
    @IsNotEmpty({ message: 'El id del producto es obligatorio' })
    id_product!: string;

    @IsInt({ message: 'La cantidad debe ser un número entero' })
    @Min(1, { message: 'La cantidad debe ser al menos 1' })
    @IsNotEmpty({ message: 'La cantidad es obligatoria' })
    quantity!: number;

    @IsString({ message: 'El talle debe ser una cadena' })
    @IsNotEmpty({ message: 'El talle es obligatorio' })
    size!: string;

    @IsNumber({}, { message: 'El precio debe ser un número' })
    @Min(0, { message: 'El precio no puede ser negativo' })
    @IsNotEmpty({ message: 'El precio es obligatorio' })
    price!: number;
}

export class CreateOrderDto {
    @IsString({ message: 'El id del usuario debe ser una cadena' })
    @IsNotEmpty({ message: 'El id del usuario es obligatorio' })
    id_user!: string;

    @IsArray({ message: 'Los items del carrito deben ser una cadena JSON' })
    @ArrayNotEmpty({ message: 'Los items del carrito son obligatorios' })
    @ValidateNested({ each: true })
    @Type(() => CreateOrderDtoProduct)
    products!: CreateOrderDtoProduct[];

    @IsNumber({}, { message: 'El monto total debe ser un número' })
    @Min(0, { message: 'El monto total no puede ser negativo' })
    @IsNotEmpty({ message: 'El monto total es obligatorio' })
    total_amount!: number;

    @IsString({message: 'La dirección debe ser una cadena'})
    @MinLength(5, { message: 'La dirección debe tener al menos 5 caracteres' })
    @MaxLength(200, { message: 'La dirección no puede tener más de 200 caracteres' })
    @IsNotEmpty({ message: 'La dirección es obligatoria' })
    address!: string;

    @IsString({message: 'La ciudad debe ser una cadena'})
    @MinLength(2, { message: 'La ciudad debe tener al menos 2 caracteres' })
    @MaxLength(100, { message: 'La ciudad no puede tener más de 100 caracteres' })
    @IsNotEmpty({ message: 'La ciudad es obligatoria' })
    city!: string;

    @IsString({message: 'El código postal debe ser una cadena'})
    @MinLength(3, { message: 'El código postal debe tener al menos 3 caracteres' })
    @MaxLength(10, { message: 'El código postal no puede tener más de 10 caracteres' })
    @IsNotEmpty({ message: 'El código postal es obligatorio' })
    postal_code!: string;

    @IsString({message: 'El teléfono debe ser una cadena'})
    @MinLength(7, { message: 'El teléfono debe tener al menos 7 caracteres' })
    @MaxLength(20, { message: 'El teléfono no puede tener más de 20 caracteres' })
    @IsNotEmpty({ message: 'El teléfono es obligatorio' })
    phone!: string;
}

export class updateStatusDto {
    @IsString({ message: 'El nuevo estado debe ser una cadena' })
    @IsNotEmpty({ message: 'El nuevo estado es obligatorio' })
    status!: string;
}