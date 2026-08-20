import { IsIn, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class StatusDto {
  @IsIn(['ACTIVE', 'SUSPENDED', 'PENDING']) status!: string;
}

export class EventStatusDto {
  @IsIn(['DRAFT', 'PUBLISHED', 'SUSPENDED']) status!: string;
}

export class CreateEventDto {
  @IsString() @IsNotEmpty() title!: string;
  @IsString() @IsOptional() description?: string;
  @IsUUID() categoryId!: string;
  @IsString() @IsOptional() posterUrl?: string;
  @IsString() @IsNotEmpty() startDate!: string;
  @IsString() @IsNotEmpty() endDate!: string;
  @IsString() @IsNotEmpty() venue!: string;
  @IsString() @IsNotEmpty() location!: string;
  @IsOptional() ticketTypes?: { name: string; price: number; quantity: number }[];
}
