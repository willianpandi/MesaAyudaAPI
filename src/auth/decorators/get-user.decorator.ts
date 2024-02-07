import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";
import { User } from "../../users/entities/user.entity";


export const GetUser = createParamDecorator(
    ( data: string, ctx: ExecutionContext ) => {
       const req = ctx.switchToHttp().getRequest();
       const user = req['user'];
      
       if (!user) {
         throw new InternalServerErrorException('Usuario no encotrado');
       }

    return ( !data )
            ? user 
            : user[data];

    }
);