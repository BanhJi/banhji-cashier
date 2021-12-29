import UserModel from "@/scripts/model/User.js";

export default class BudgetLine {
    constructor(data = {}) {
        this.uuid                   = data.uuid || '';
        this.account_uuid           = data.account_uuid || '';
        this.amount                 = data.amount || 0;
        this.note                   = data.note || '';
        this.monthly_amount         = data.monthly_amount || []; // { month_of, amount }

        // Trackable Entity
        this.created_by                 = data.created_by || new UserModel();
        this.modified_by                = data.modified_by || new UserModel();
        this.created_date               = data.created_date || null;
        this.modified_date              = data.modified_date || null;
    }
    
    constuct(data) {
        this.constructor(data);
    }
}