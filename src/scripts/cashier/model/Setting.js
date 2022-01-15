export default class Setting {
    constructor(data = {}) {
        this.id = data.id || ''
        this.lastRefNum = data.lastRefNum || 1
        this.searchOption = data.searchOption || {}
        this.msgJournal = data.msgJournal || ''
    }

    constuct(data) {
        this.constructor(data);
    }
}