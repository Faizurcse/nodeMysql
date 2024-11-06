import { Request, Response } from 'express';
import db from '../config/db';
import bcrypt from 'bcrypt';
import { RegisterRequest, LoginRequest, User } from '../interfaces/authInterfaces';

class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const { name, email, password } = req.body as RegisterRequest;

    try {
      const [result] = await db.query('SELECT * FROM admin WHERE email = ?', [email]);

      if ((result as User[]).length > 0) {
        res.status(400).json({ message: 'User already exists' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [insertResult] = await db.query(
        'INSERT INTO admin (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
      );

      const [newUser] = await db.query(
        'SELECT id, name, email FROM admin WHERE id = ?',
        [(insertResult as any).insertId]
      );

      res.status(201).json({
        message: 'User registered successfully',
        user: (newUser as User[])[0],
      });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body as LoginRequest;

    try {
      const [result] = await db.query('SELECT * FROM admin WHERE email = ?', [email]);

      if ((result as User[]).length === 0) {
        res.status(400).json({ message: 'Invalid email or password' });
        return;
      }

      const user = (result as User[])[0];

      const isMatch = await bcrypt.compare(password, user.password);

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
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export default new AuthController();
