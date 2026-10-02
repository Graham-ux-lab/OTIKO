import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CheckoutDto {
  @IsUUID() eventId!: string;
  @IsUUID() ticketTypeId!: string;
  @IsString() @IsNotEmpty() customerName!: string;
  @IsEmail() customerEmail!: string;
  @IsString() @IsNotEmpty() customerPhone!: string;
}
