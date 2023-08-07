export declare type ApiServiceResponse = {
    statusCode : number;
    response : {
        status : boolean;
        code : number;
        message: string;
        data?: [] | object;
    }
}