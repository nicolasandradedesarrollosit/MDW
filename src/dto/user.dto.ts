import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  Min,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  Validate,
  MinLength,
  MaxLength,
  Max,
} from "class-validator";
import userModel from "../models/userModel.js";

@ValidatorConstraint({ async: true })
class IsEmailAlreadyExist implements ValidatorConstraintInterface {
  async validate(email: string) {
    const user = await userModel.findOne({ email });
    return !user;
  }
  defaultMessage = () => "El email ya está en uso";
}

export class CreateUserDto {
    @IsString({ message: 'El nombre debe ser una cadena'})
    @MinLength(2, { message: 'El nombre debe tener al menos 5 caracteres' })
    @MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    name!: string;

    @IsString({ message: 'El apellido debe ser una cadena'})
    @MinLength(2, { message: 'El apellido debe tener al menos 5 caracteres' })
    @MaxLength(50, { message: 'El apellido no puede tener más de 50 caracteres' })
    @IsNotEmpty({ message: 'El apellido es obligatorio' })
    @IsOptional()
    lastName!: string;

    @IsEmail({}, { message: 'El email debe ser válido' })
    @IsNotEmpty({ message: 'El email es obligatorio' })
    @MinLength(5, { message: 'El email debe tener al menos 5 caracteres' })
    @MaxLength(100, { message: 'El email no puede tener más de 100 caracteres' })
    @Validate(IsEmailAlreadyExist)
    email!: string;

    @IsInt({ message: 'La edad debe ser un número entero' })
    @Min(0, { message: 'La edad no puede ser negativa' })
    @IsOptional()
    age?: number;

    @IsString({ message: 'La contraseña debe ser una cadena' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    password!: string;
}

export class LogInDto {
    @IsEmail({}, { message: 'El email debe ser válido' })
    @IsNotEmpty({ message: 'El email es obligatorio' })
    @MaxLength(100, { message: 'El email no puede tener más de 100 caracteres' })
    email!: string;

    @IsString({ message: 'La contraseña debe ser una cadena' })
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    @MaxLength(100, { message: 'La contraseña no puede tener más de 100 caracteres' })
    password!: string;
}