class StatusError extends Error {

    constructor(message, status) {
        super(message);
        if (status < 100 || status >= 600) {
            console.log(`Invalid status code ${status}. Returning 500`);
            status = 500
        }
        this.status = status;
        this.name = this.constructor.name;
    }

}

module.exports = StatusError;
