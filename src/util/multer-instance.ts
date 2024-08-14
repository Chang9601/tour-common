import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';

import { Code } from '../code/code';
import { MulterInvalidMimeTypeError } from '../error/multer/multer-invalid-mimetype.error';
import { MulterUninitializedError } from '../error/multer/multer-unintialized.error';
import { FileUtil } from './file.util';
import { RequestWithUser } from '../type/auth-type';
import { DestinationCallback, FilenameCallback } from '../type/multer-type';

// TODO: skaffold에서 싱글톤 작동하는지 확인하기. 싱글톤이 아닌 Util 클래스로 수정하기.
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
    service?: string,
    mimetype: string = 'image'
  ): void {
    // TODO: setFileFilter() 메서드 생성하기.
    this._multer = multer({
      storage: this.setStorage(destination, service),
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
    service?: string
  ): multer.StorageEngine {
    return destination && service
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
            let filename;

            if (service === 'user') {
              filename = FileUtil.create(service, file, request.user!.id);
            } else {
              filename = FileUtil.create(service, file, request.params.id);
            }

            callback(null, filename);
          },
        })
      : multer.memoryStorage();
  }
}

export const multerInstance = new MulterInstance();
