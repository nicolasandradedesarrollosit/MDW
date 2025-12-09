import {
    IsString,
    IsNotEmpty,
    IsInt,
    Min,
    IsOptional
} from "class-validator";

export class CreateProductSizeDto {
    @IsString({message: 'El id del producto debe ser una cadena'})
    @IsNotEmpty({message: 'El id del producto es obligatorio'})
    id_product!: string;

    @IsString({message: 'El talle debe ser una cadena'})
    @IsNotEmpty({message: 'El talle es obligatorio'})
    size!: string;

    @IsInt({message: 'El stock debe ser un número entero'})
    @Min(0, {message: 'El stock no puede ser negativo'})
    @IsNotEmpty({message: 'El stock es obligatorio'})
    stock!: number;
}

export class UpdateProductSizeDto {
    @IsString({message: 'El talle debe ser una cadena'})
    @IsNotEmpty({message: 'El talle es obligatorio'})
    @IsOptional()
    size!: string;

    @IsInt({message: 'El stock debe ser un número entero'})
    @Min(0, {message: 'El stock no puede ser negativo'})
    @IsNotEmpty({message: 'El stock es obligatorio'})
    @IsOptional()
    stock!: number;
}