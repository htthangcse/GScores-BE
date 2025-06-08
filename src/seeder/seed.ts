import * as fs from 'fs';
import * as csv from 'csv-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, StudentDocument } from '../modules/student/student.schema';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const studentModel = app.get<Model<StudentDocument>>(getModelToken('Student'));

  const batchSize = 1000;
  let batch: Partial<Student>[] = [];

  function parseScore(value: string | undefined): number | null {
    if (!value || value.trim() === '') return null;
    const n = parseFloat(value);
    return isNaN(n) ? null : n;
  }

  const filePath = path.resolve(__dirname, '../assets/diem_thi_thpt_2024.csv');

  // Helper insert batch
  async function flushBatch() {
    if (batch.length === 0) return;
    try {
      await studentModel.insertMany(batch);
      console.log(`Đã insert batch ${batch.length} bản ghi`);
      batch = [];
    } catch (err) {
      console.error('Lỗi insert batch:', err);
    }
  }

  const stream = fs.createReadStream(filePath).pipe(csv());

  await new Promise<void>((resolve, reject) => {
    stream.on('data', async (row) => {
      batch.push({
        sbd: row['sbd'],
        toan: parseScore(row['toan']),
        ngu_van: parseScore(row['ngu_van']),
        ngoai_ngu: parseScore(row['ngoai_ngu']),
        vat_li: parseScore(row['vat_li']),
        hoa_hoc: parseScore(row['hoa_hoc']),
        sinh_hoc: parseScore(row['sinh_hoc']),
        lich_su: parseScore(row['lich_su']),
        dia_li: parseScore(row['dia_li']),
        gdcd: parseScore(row['gdcd']),
        ma_ngoai_ngu: row['ma_ngoai_ngu'],
      });

      if (batch.length >= batchSize) {
        // Pause stream trước khi insert
        stream.pause();

        await flushBatch();

        // Resume đọc tiếp
        stream.resume();
      }
    })
    .on('end', async () => {
      await flushBatch();
      console.log('Dữ liệu đã được thêm vào MongoDB!');
      resolve();
    })
    .on('error', (err) => {
      reject(err);
    });
  });

  await app.close();
}

bootstrap();
