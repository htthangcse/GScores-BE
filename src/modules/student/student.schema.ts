import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StudentDocument = Student & Document;

@Schema()
export class Student {
  @Prop({ required: true })
  sbd: string;

  @Prop({ type: Number, default: null })
  toan: number | null;

  @Prop({ type: Number, default: null })
  ngu_van: number | null;

  @Prop({ type: Number, default: null })
  ngoai_ngu: number | null;

  @Prop({ type: Number, default: null })
  vat_li: number | null;

  @Prop({ type: Number, default: null })
  hoa_hoc: number | null;

  @Prop({ type: Number, default: null })
  sinh_hoc: number | null;

  @Prop({ type: Number, default: null })
  lich_su: number | null;

  @Prop({ type: Number, default: null })
  dia_li: number | null;

  @Prop({ type: Number, default: null })
  gdcd: number | null;

  @Prop({ type: String, default: null })
  ma_ngoai_ngu: string | null;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
