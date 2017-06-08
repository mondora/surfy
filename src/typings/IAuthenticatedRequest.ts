import {Request} from "express";

interface IRequestUser {
    id: string;
}

interface IAuthenticatedRequest extends Request {
    user: IRequestUser;
    userId: string;
}

export default IAuthenticatedRequest;
