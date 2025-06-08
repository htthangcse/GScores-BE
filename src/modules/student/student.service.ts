import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, StudentDocument } from './student.schema';

@Injectable()
export class StudentService {
  constructor(@InjectModel(Student.name) private studentModel: Model<StudentDocument>) {}

  async getScoreBySbd(sbd: string): Promise<Student> {
    const student = await this.studentModel.findOne({ sbd }).exec();
    if (!student) {
      throw new NotFoundException(`Student with sbd ${sbd} not found`);
    }
    return student;
  }
}
