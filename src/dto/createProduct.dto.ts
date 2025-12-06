import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsInt,
    Min,
    MinLength,
    MaxLength,
} from "class-validator";

export class CreateProductDto {
    @IsString({ message: 'El nombre debe ser una cadena'})
    @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    @MaxLength(100, { message: 'El nombre no puede tener más de 100 caracteres' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    name!: string;

    @IsString({ message: 'La descripción debe ser una cadena'})
    @MinLength(5, { message: 'La descripción debe tener al menos 5 caracteres' })
    @MaxLength(500, { message: 'La descripción no puede tener más de 500 caracteres' })
    @IsOptional()
    description?: string;

    @IsInt({ message: 'El precio debe ser un número entero' })
    @Min(0, { message: 'El precio no puede ser negativo' })
    @IsNotEmpty({ message: 'El precio es obligatorio' })
    price!: number;

    @IsInt({ message: 'El stock debe ser un número entero' })
    @Min(0, { message: 'El stock no puede ser negativo' })
    @IsNotEmpty({ message: 'El stock es obligatorio' })
    stock!: number;

    @IsString({message: 'La URL de la imagen debe ser una cadena'})
    @IsNotEmpty({ message: 'La URL de la imagen es obligatoria' })
    url_image!: string;

    @IsString({message: 'El id de categoria debe ser una cadena'})
    @IsNotEmpty({ message: 'El id de categoria es obligatorio' })
    id_category!: string;
}