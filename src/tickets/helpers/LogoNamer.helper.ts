import { v4 as uuid  } from 'uuid'

export const LogoNamer = ( req: Express.Request, file: Express.Multer.File, callback: Function ) => {

    if (!file) return callback  ( new Error('El archivo está vacío'), false);
    
    const fileExtension = file.mimetype.split('/')[1];
    // paraque se guarde el logo o el side bar
    const fileName = `logo.${ fileExtension }`;
    
    // const name = file.originalname.split('.')[0];  //para poder guardar con el mismo nombre 
    // const fileName = `${name}.${ fileExtension }`;

    // const fileName = `${uuid()}.${ fileExtension }`;
    
    callback( null, fileName )
}