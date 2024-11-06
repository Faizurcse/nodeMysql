"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Admin_controller_1 = __importDefault(require("./controllers/Admin.controller"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/register', Admin_controller_1.default.register);
app.post('/login', Admin_controller_1.default.login);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
