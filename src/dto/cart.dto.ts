import {
    IsString,
    IsNotEmpty,
    IsInt,
    Min,
    IsArray,
    ValidateNested,
    ArrayMinSize
} from "class-validator";
import { Type } from "class-transformer";

export class ProductItemDto {
    @IsString({ message: 'El ID del producto debe ser una cadena' })
    @IsNotEmpty({ message: 'El ID del producto es obligatorio' })
    productId!: string;
    
    @IsInt({ message: 'La cantidad debe ser un número entero' })
    @Min(1, { message: 'La cantidad debe ser al menos 1' })
    quantity!: number;
}

export class CartDto {
    @IsArray({ message: 'Products debe ser un arreglo' })
    @ArrayMinSize(1, { message: 'Debe proporcionar al menos un producto' })
    @ValidateNested({ each: true })
    @Type(() => ProductItemDto)
    products!: ProductItemDto[];
}