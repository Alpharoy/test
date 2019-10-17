export default class {
    constructor(info) {
        this.limit = _.toSafeInteger(info.limit);
        this.remaining = _.toSafeInteger(info.remaining);
        this.retryAfter = _.toSafeInteger(info.retryAfter);
        this.resetAt = info.resetAt ? info.resetAt : null;
    }
}