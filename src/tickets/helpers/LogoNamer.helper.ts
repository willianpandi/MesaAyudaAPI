import { v4 as uuid  } from 'uuid'

export const LogoNamer = ( req: Express.Request, file: Express.Multer.File, callback: Function ) => {

    if (!file) return callback  ( new Error('El archivo está vacío'), false);
    
    const fileExtension = file.mimetype.split('/')[1];

    const fileName = `logo.${ fileExtension }`;
    
    callback( null, fileName )
}