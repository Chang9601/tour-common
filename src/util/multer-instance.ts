import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';

import { Code } from '../code/code';
import { MulterInvalidMimeTypeError } from '../error/multer/multer-invalid-mimetype.error';
import { MulterUninitializedError } from '../error/multer/multer-unintialized.error';
import { RequestWithUser } from '../type/auth-type';
import { DestinationCallback, FilenameCallback } from '../type/multer-type';

class MulterInstance {
  private _multer?: multer.Multer;

  public get multer() {
    if (!this._multer) {
      throw new MulterUninitializedError(
        Code.MULTER_UNINTIALIZED_ERROR,
        'Multer 인스턴스를 초기화해야 합니다.',
        false
      );
    }

    return this._multer;
  }

  public initialize(
    destination?: string,
    filename?: string,
    mimetype: string = 'image'
  ): void {
    // TODO: setFileFilter() 메서드 생성하기.
    this._multer = multer({
      storage: this.setStorage(destination, filename),
      fileFilter: (
        requset: Request,
        file: Express.Multer.File,
        callback: FileFilterCallback
      ) => {
        if (file.mimetype.startsWith(mimetype)) {
          callback(null, true);
        } else {
          callback(
            new MulterInvalidMimeTypeError(
              Code.MULTER_INVALID_MIMETYPE_ERROR,
              '이미지만 업로드할 수 있습니다.',
              false
            )
          );
        }
      },
    });
  }

  private setStorage(
    destination?: string,
    filename?: string
  ): multer.StorageEngine {
    return destination && filename
      ? multer.diskStorage({
          destination: (
            request: Request,
            file: Express.Multer.File,
            callback: DestinationCallback
          ) => {
            callback(null, destination);
          },
          filename: (
            request: RequestWithUser,
            file: Express.Multer.File,
            callback: FilenameCallback
          ) => {
            const extension = file.mimetype.split('/')[1];
            callback(
              null,
              `${filename}-${request.user!.id}-${Date.now()}.${extension}`
            );
          },
        })
      : multer.memoryStorage();
  }
}

export const multerInstance = new MulterInstance();
