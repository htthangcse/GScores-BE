// src/modules/student/student.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { StudentService } from './student.service';
import { Student } from './student.schema';
import { GetStudentScoreDto } from 'src/dto/student.dto';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('score/:sbd')
  async getScoreBySbd(@Param() params: GetStudentScoreDto): Promise<Student> {
    return this.studentService.getScoreBySbd(params.sbd);
  }

  @Get('report/levels')
  async getScoreLevelsReport() {
    return this.studentService.getScoreLevelsReport();
  }

  @Get('report/topScores')
  async getTopGroupAStudents() {
    return this.studentService.getTopGroupAStudents();
  }
}