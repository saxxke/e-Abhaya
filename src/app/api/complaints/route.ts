import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { mockDb } from '@/lib/mockDb';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    let complaints;
    try {
      if (role === 'OFFICER') {
        complaints = await prisma.complaint.findMany({
          where: { assignedOfficerId: userId },
          include: { submittedBy: true },
          orderBy: { aiPriorityScore: 'desc' }
        });
      } else {
        complaints = await prisma.complaint.findMany({
          where: { submittedById: userId },
          orderBy: { createdAt: 'desc' }
        });
      }
    } catch (dbError) {
      console.warn('Database unreachable, cascading Complaints GET to in-memory mockDb.');
      const allMockComplaints = mockDb.getComplaints();
      if (role === 'OFFICER') {
        complaints = allMockComplaints.filter(c => c.assignedOfficerId === userId || c.assignedOfficerId === 'u-officer-1');
      } else {
        complaints = allMockComplaints.filter(c => c.submittedById === userId);
      }
    }

    return NextResponse.json(complaints);
  } catch (error) {
    console.error('Failed to fetch complaints:', error);
    return NextResponse.json({ error: 'Failed to fetch complaints' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      title,
      description,
      category,
      location,
      aiSummary,
      aiPriorityScore,
      legalSections
    } = await req.json();

    if (!title || !description || !category || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const userId = (session.user as any).id;
    const userName = (session.user as any).name;
    const userEmail = (session.user as any).email;

    // Generate unique Tracking ID: e.g. ABH-2026-9812
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingId = `ABH-2026-${randomSuffix}`;

    let complaint;
    try {
      // Get an officer to assign (assigning to our seeded officer: Inspector Vikram Singh)
      const officers = await prisma.user.findMany({
        where: { role: 'OFFICER' }
      });
      const assignedOfficerId = officers.length > 0 ? officers[0].id : null;

      complaint = await prisma.complaint.create({
        data: {
          trackingId,
          title,
          description,
          category,
          location,
          aiSummary: aiSummary || 'Awaiting officer initial review.',
          aiPriorityScore: aiPriorityScore || 20,
          legalSections: legalSections || [],
          submittedById: userId,
          assignedOfficerId,
          status: 'PENDING'
        }
      });

      // Create Audit Log
      await prisma.auditLog.create({
        data: {
          action: 'Complaint Submitted',
          complaintId: complaint.id,
          performedById: userId
        }
      });
    } catch (dbError) {
      console.warn('Database unreachable, cascading Complaints POST to in-memory mockDb.');
      complaint = {
        id: `comp-custom-${Date.now()}`,
        trackingId,
        title,
        description,
        category,
        location,
        aiSummary: aiSummary || 'Awaiting officer initial review.',
        aiPriorityScore: aiPriorityScore || 20,
        legalSections: legalSections || [],
        submittedById: userId,
        assignedOfficerId: 'u-officer-1', // Default mock officer ID
        status: 'PENDING' as any,
        createdAt: new Date(),
        updatedAt: new Date(),
        submittedBy: {
          name: userName || 'Rohan Sharma',
          email: userEmail || 'citizen@eabhaya.in'
        }
      };
      mockDb.addComplaint(complaint);
      
      mockDb.addAudit({
        id: `audit-${Date.now()}`,
        action: 'Complaint Submitted',
        complaintId: complaint.id,
        performedById: userId,
        timestamp: new Date()
      });
    }

    return NextResponse.json(complaint);
  } catch (error) {
    console.error('Failed to create complaint:', error);
    return NextResponse.json({ error: 'Failed to file complaint' }, { status: 500 });
  }
}
