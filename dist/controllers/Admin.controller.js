"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../config/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthController {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password } = req.body;
            try {
                const [result] = yield db_1.default.query('SELECT * FROM admin WHERE email = ?', [email]);
                if (result.length > 0) {
                    res.status(400).json({ message: 'User already exists' });
                    return;
                }
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const [insertResult] = yield db_1.default.query('INSERT INTO admin (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
                const [newUser] = yield db_1.default.query('SELECT id, name, email FROM admin WHERE id = ?', [insertResult.insertId]);
                res.status(201).json({
                    message: 'User registered successfully',
                    user: newUser[0],
                });
            }
            catch (error) {
                console.error('Error during registration:', error);
                res.status(500).json({ message: 'Server error' });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const [result] = yield db_1.default.query('SELECT * FROM admin WHERE email = ?', [email]);
                if (result.length === 0) {
                    res.status(400).json({ message: 'Invalid email or password' });
                    return;
                }
                const user = result[0];
                const isMatch = yield bcrypt_1.default.compare(password, user.password);
                if (!isMatch) {
                    res.status(400).json({ message: 'Invalid email or password' });
                    return;
                }
                res.status(200).json({
                    message: 'Login successful',
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                    },
                });
            }
            catch (error) {
                console.error('Error during login:', error);
                res.status(500).json({ message: 'Server error' });
            }
        });
    }
}
exports.default = new AuthController();
