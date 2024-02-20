// //Configuracion de MULTER
// import { multer } from "multer";

// const storage = multer.diskStorage({
//     destination: function(rec,file,cb){
//         cb(null,__dirname+'/public/img')
//     },
//     filename: function(req,file,cb){
//         cb(null,file.originalname)
//     }
// })

// export const uploader = multer({storage})

import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname