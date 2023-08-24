import mongoose from "mongoose";
import jobs from "../../dbConfig/models/jobslist";
import { returnSuccess, returnError } from "../../middlewares/ApiResponseHandlers";
import HttpStatusCodes from "http-status-codes"

export class jenkinsService {
    createRecord = async (data : any) => {
        try {
            return jobs.create(data);
        } catch (error) {
            const status = HttpStatusCodes.BAD_REQUEST
            const message = 'Somthing went wrong'
            return returnError(status, message);
        }
    }
}

export default new jenkinsService();