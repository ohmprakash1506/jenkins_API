"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class approutcontroller {
    constructor() {
        this.console = async (req, res) => {
            try {
                console.log(`Hello jenkins API.....!`);
                res.json(`Hello jenkins API.....!`);
            }
            catch (error) {
                return error;
            }
        };
    }
}
exports.default = approutcontroller;
