export default class {
    constructor(info) {
        this.currentPage = _.toSafeInteger(info.currentPage);
        this.perPage = _.toSafeInteger(info.perPage);
        this.totalCount = _.toSafeInteger(info.totalCount);
    }
}