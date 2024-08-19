import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema, HydratedDocument } from 'mongoose';

export type VerifyEmailDocument = HydratedDocument<VerifyEmail>;

@Schema({ collection: 'verify-email', timestamps: true })
export class VerifyEmail {
  @Prop({ type: Number, required: true })
  userId: number;

  @Prop({ required: true, type: String, unique: true })
  code: string;

  @Prop({
    required: true,
    type: Date,
    expires: '5m',
    default: new Date(Date.now() + 5 * 60 * 1000),
  })
  expiredAt: Date;
}
export const VerifyEmailSchema = SchemaFactory.createForClass(VerifyEmail);
