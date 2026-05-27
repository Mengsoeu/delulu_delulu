import { BadRequestException } from "@nestjs/common";

export class emailInUse extends BadRequestException {
    constructor ({
        message,
        errorCode,
    }) {
        super({
            success: false,
            message,
            errorCode,
        })
    }
}
