class ApiError extends Error {

    constructor(statusCode, message = "Something went wrong", error = [], stack) {
        super(message);
        this.statusCode = statusCode,
        this.errors = error;
        this.success = false;
        this.data = null;
        this.message = message;

        if (stack)
            this.stack = stack;
        else {
            Error.captureStackTrace(this, this.stack)
        }
    }

    toJSON() {

        return {
            success: this.success,
            statusCode: this.statusCode,
            errors: this.errors,
            data:this.data,
            message:this.message
        }

    }


}

export { ApiError }