import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';

import { RequestWithUser } from '../type/auth-type';
import { DestinationCallback, FilenameCallback } from '../type/multer-type';

// TODO: 예외
class MulterInstance {
  private _multer?: multer.Multer;

  public get multer() {
    if (!this._multer) {
      throw new Error('Multer 인스턴스를 초기화해야 합니다.');
    }

    return this._multer;
  }

  public initialize(
    destination: string,
    filename: string,
    mimetype: string
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
          callback(new Error('이미지만 업로드할 수 있습니다.'));
        }
      },
    });
  }

  private setStorage(
    destination: string,
    filename: string
  ): multer.StorageEngine {
    return multer.diskStorage({
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
    });
  }
}

export const multerInstance = new MulterInstance();
