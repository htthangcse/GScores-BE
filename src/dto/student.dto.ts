import { IsString, Length, Matches } from 'class-validator';

export class GetStudentScoreDto {
  @IsString()
  @Length(8, 8, { message: 'SBD must be a string of exactly 8 characters.' })
  @Matches(/^\d+$/, { message: 'SBD must contain only numbers' })
  sbd: string;
}