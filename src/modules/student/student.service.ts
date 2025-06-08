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

  async getScoreLevelsReport() {
    const subjects = ['toan', 'ngu_van', 'ngoai_ngu', 'vat_li', 'hoa_hoc', 'sinh_hoc', 'lich_su', 'dia_li', 'gdcd'];

    const result = {};

    for (const subject of subjects) {
      result[subject] = {
        excellent: await this.studentModel.countDocuments({ [subject]: { $ne: null, $gte: 8 } }),
        good: await this.studentModel.countDocuments({ [subject]: { $ne: null, $gte: 6, $lt: 8 } }),
        average: await this.studentModel.countDocuments({ [subject]: { $ne: null, $gte: 4, $lt: 6 } }),
        weak: await this.studentModel.countDocuments({ [subject]: { $ne: null, $lt: 4 } }),
      };
    }

    return result;
  }

  async getTopGroupAStudents(): Promise<any[]> {
    // Lấy top 10 học sinh theo totalScore giảm dần
    const top10 = await this.studentModel.aggregate([
      {
        $match: {
          toan: { $ne: null },
          vat_li: { $ne: null },
          hoa_hoc: { $ne: null }
        }
      },
      {
        $addFields: {
          totalScore: { $add: ['$toan', '$vat_li', '$hoa_hoc'] }
        }
      },
      {
        $sort: { totalScore: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          sbd: 1,
          name: 1,
          toan: 1,
          vat_li: 1,
          hoa_hoc: 1,
          totalScore: 1,
        }
      }
    ]).allowDiskUse(true).exec();

    if (top10.length === 0) return [];

    // Lấy điểm của học sinh thứ 10
    const cutoffScore = top10[top10.length - 1].totalScore;

    // Lấy tất cả học sinh có điểm >= điểm của học sinh thứ 10
    const students = await this.studentModel.aggregate([
      {
        $match: {
          toan: { $ne: null },
          vat_li: { $ne: null },
          hoa_hoc: { $ne: null }
        }
      },
      {
        $addFields: {
          totalScore: { $add: ['$toan', '$vat_li', '$hoa_hoc'] }
        }
      },
      {
        $match: {
          totalScore: { $gte: cutoffScore }
        }
      },
      {
        $project: {
          sbd: 1,
          name: 1,
          toan: 1,
          vat_li: 1,
          hoa_hoc: 1,
          totalScore: 1,
        }
      },
      {
        $sort: { totalScore: -1 }
      }
    ]).allowDiskUse(true).exec();

    return students;
  }


}
