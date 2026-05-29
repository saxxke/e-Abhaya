import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const { status, legalSections } = await req.json();
    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    if (role !== 'OFFICER' && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Only officers can modify case files.' }, { status: 403 });
    }

    const complaintId = id;
    let updated;
    let logAction = '';

    try {
      // Fetch existing complaint
      const existing = await prisma.complaint.findUnique({
        where: { id: complaintId }
      });

      if (!existing) {
        return NextResponse.json({ error: 'Complaint not found.' }, { status: 404 });
      }

      // Apply updates
      updated = await prisma.complaint.update({
        where: { id: complaintId },
        data: {
          status: status || existing.status,
          legalSections: legalSections !== undefined ? legalSections : existing.legalSections
        }
      });

      // Write audit trail
      logAction = `Status updated to ${updated.status}`;
      if (updated.status === 'FIR_REGISTERED') {
        logAction = 'FIR Registered & Penal Sections Approved';
      } else if (updated.status === 'RESOLVED') {
        logAction = 'Case Formally Resolved and Closed';
      }

      await prisma.auditLog.create({
        data: {
          action: logAction,
          complaintId,
          performedById: userId
        }
      });
    } catch (dbError) {
      console.warn('Database unreachable, cascading Complaint PATCH to in-memory mockDb.');
      const allMockComplaints = mockDb.getComplaints();
      const existing = allMockComplaints.find(c => c.id === complaintId);

      if (!existing) {
        return NextResponse.json({ error: 'Complaint not found.' }, { status: 404 });
      }

      const updates: any = {};
      if (status) updates.status = status;
      if (legalSections) updates.legalSections = legalSections;

      updated = mockDb.updateComplaint(complaintId, updates);

      logAction = `Status updated to ${updated?.status}`;
      if (updated?.status === 'FIR_REGISTERED') {
        logAction = 'FIR Registered & Penal Sections Approved';
      } else if (updated?.status === 'RESOLVED') {
        logAction = 'Case Formally Resolved and Closed';
      }

      mockDb.addAudit({
        id: `audit-${Date.now()}`,
        action: logAction,
        complaintId,
        performedById: userId,
        timestamp: new Date()
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update complaint:', error);
    return NextResponse.json({ error: 'Failed to update complaint.' }, { status: 500 });
  }
}
