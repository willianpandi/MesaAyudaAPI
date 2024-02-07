

export const fileFilter= ( req: Express.Request, file: Express.Multer.File, callback: Function ) =>{
    
    if (!file) return ( new Error('El archivo está vacío'), false);
    
    const fileExtension = file.mimetype.split('/')[1];
    const validExtension = ['jpg','png','doc', 'docx','gif','pdf','rar','zip','xls','xlsx']

    if (validExtension.includes( fileExtension )) {
        return callback( null, true )
    }

    // callback( null, false )
    callback( null, true )
}

export const fileFilterImage= ( req: Express.Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void ) =>{
    
    if (!file) return ( new Error('El archivo está vacío'));
    
    const fileExtension = file.mimetype.split('/')[1];
    const validExtension = 'png';

    if (fileExtension === validExtension) {
        return callback( null, true )
    }else {
        return callback(null, false);
    }
}