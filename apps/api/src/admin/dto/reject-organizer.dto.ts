import { IsString, MinLength } from 'class-validator';

export class RejectOrganizerDto {
  @IsString()
  @MinLength(5)
  reason: string;
}