import mongoose from 'mongoose';

export class FileUtil {
  public static create = (
    service: string,
    file: Express.Multer.File,
    // TODO: ObjectId로 강제.
    id: mongoose.Types.ObjectId | string
  ) => {
    const extension = file.mimetype.split('/')[1];
    const filename = `${service}-${id}-${Date.now()}.${extension}`;

    return filename;
  };
}
