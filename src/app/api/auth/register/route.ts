import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { mockDb } from '@/lib/mockDb';

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Hash the password securely
    const passwordHash = hashPassword(password);
    let user;

    try {
      // Verify if email is already in use
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 400 });
      }

      // Save user to the database
      user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: role === 'OFFICER' ? 'OFFICER' : 'CITIZEN'
        }
      });
    } catch (dbError) {
      console.warn('Database unreachable, cascading Registration query to in-memory mockDb.');
      const users = mockDb.getUsers();
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 400 });
      }

      user = {
        id: `u-custom-${Date.now()}`,
        name,
        email,
        passwordHash,
        role: (role === 'OFFICER' ? 'OFFICER' : 'CITIZEN') as any,
        createdAt: new Date()
      };
      mockDb.addUser(user);
    }

    return NextResponse.json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal Server Error during registration.' }, { status: 500 });
  }
}
