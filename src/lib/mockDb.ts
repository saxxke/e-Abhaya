import { hashPassword } from './auth';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'CITIZEN' | 'OFFICER' | 'ADMIN';
  createdAt: Date;
}

export interface Complaint {
  id: string;
  trackingId: string;
  title: string;
  description: string;
  category: string;
  status: 'PENDING' | 'REVIEWING' | 'FIR_REGISTERED' | 'RESOLVED';
  aiSummary: string | null;
  aiPriorityScore: number;
  legalSections: string[];
  location: string;
  createdAt: Date;
  updatedAt: Date;
  submittedById: string;
  assignedOfficerId: string | null;
  submittedBy?: {
    name: string;
    email: string;
  };
}

export interface EmergencyContact {
  id: string;
  agencyName: string;
  phoneNumber: string;
  category: string;
  locationScope: string;
}

export interface AuditLog {
  id: string;
  action: string;
  complaintId: string;
  performedById: string;
  timestamp: Date;
}

// Global cached variables to survive Hot Module Reloading in Next.js
declare global {
  var mockUsers: User[] | undefined;
  var mockComplaints: Complaint[] | undefined;
  var mockContacts: EmergencyContact[] | undefined;
  var mockAudits: AuditLog[] | undefined;
}

// SHA-256 hashed version of 'password123'
const DEFAULT_HASH = 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f';

export function initializeMockDb() {
  if (!globalThis.mockUsers) {
    globalThis.mockUsers = [
      {
        id: 'u-citizen-1',
        name: 'Rohan Sharma',
        email: 'citizen@eabhaya.in',
        passwordHash: DEFAULT_HASH,
        role: 'CITIZEN',
        createdAt: new Date()
      },
      {
        id: 'u-officer-1',
        name: 'Inspector Vikram Singh',
        email: 'officer@eabhaya.gov.in',
        passwordHash: DEFAULT_HASH,
        role: 'OFFICER',
        createdAt: new Date()
      },
      {
        id: 'u-admin-1',
        name: 'System Admin',
        email: 'admin@eabhaya.gov.in',
        passwordHash: DEFAULT_HASH,
        role: 'ADMIN',
        createdAt: new Date()
      }
    ];
  }

  if (!globalThis.mockContacts) {
    globalThis.mockContacts = [
      {
        id: 'c-1',
        agencyName: 'General Police Helpline',
        phoneNumber: '112',
        category: 'NATIONAL',
        locationScope: 'All India'
      },
      {
        id: 'c-2',
        agencyName: 'Cyber Crime Cell Helpline',
        phoneNumber: '1930',
        category: 'CYBER',
        locationScope: 'All India'
      },
      {
        id: 'c-3',
        agencyName: 'Women Helpline',
        phoneNumber: '1091',
        category: 'REGIONAL',
        locationScope: 'All India'
      }
    ];
  }

  if (!globalThis.mockComplaints) {
    globalThis.mockComplaints = [
      {
        id: 'comp-1',
        trackingId: 'ABH-2026-0001',
        title: 'Stolen Smartphone at Metro Station',
        description: 'My iPhone 13 was stolen from my pocket while boarding the metro train at Central Station around 8:30 AM. It was active until 9:00 AM, then switched off.',
        category: 'THEFT',
        status: 'PENDING',
        aiSummary: 'iPhone 13 stolen from user pocket at Central Metro Station during boarding time (8:30 AM). Device is currently offline.',
        aiPriorityScore: 45,
        legalSections: ['Section 303(2) BNS - Theft'],
        location: 'Central Metro Station, Platform 2',
        createdAt: new Date(Date.now() - 3600000 * 2), // 2 hours ago
        updatedAt: new Date(Date.now() - 3600000 * 2),
        submittedById: 'u-citizen-1',
        assignedOfficerId: 'u-officer-1',
        submittedBy: { name: 'Rohan Sharma', email: 'citizen@eabhaya.in' }
      },
      {
        id: 'comp-2',
        trackingId: 'ABH-2026-0002',
        title: 'Online Credit Card Phishing Scam',
        description: 'I received a message claiming my credit card was blocked. I clicked the link and entered my card code. Subsequently, Rs. 45,000 was debited from my account.',
        category: 'CYBER_CRIME',
        status: 'REVIEWING',
        aiSummary: 'Phishing victim clicked SMS link and provided credit card credentials, leading to unauthorized transfer of Rs. 45,000.',
        aiPriorityScore: 78,
        legalSections: ['Section 318 BNS - Cheating', 'Section 66D - Information Technology Act'],
        location: 'Online / Cyber Space',
        createdAt: new Date(Date.now() - 3600000 * 24), // 1 day ago
        updatedAt: new Date(Date.now() - 3600000 * 24),
        submittedById: 'u-citizen-1',
        assignedOfficerId: 'u-officer-1',
        submittedBy: { name: 'Rohan Sharma', email: 'citizen@eabhaya.in' }
      },
      {
        id: 'comp-3',
        trackingId: 'ABH-2026-0003',
        title: 'Physical Threat and Attempted Break-in',
        description: 'An unknown individual broke in my backyard and threatened me with violence when confronted. He hit the window with a wooden club and ran away when I shouted.',
        category: 'ASSAULT',
        status: 'FIR_REGISTERED',
        aiSummary: 'Physical trespass, attempted break-in, and explicit verbal threat accompanied by physical damage to property using a club.',
        aiPriorityScore: 92,
        legalSections: ['Section 331 BNS - House-trespass', 'Section 351 BNS - Criminal Intimidation'],
        location: 'Sector 4, Dwarka, New Delhi',
        createdAt: new Date(Date.now() - 3600000 * 48), // 2 days ago
        updatedAt: new Date(Date.now() - 3600000 * 48),
        submittedById: 'u-citizen-1',
        assignedOfficerId: 'u-officer-1',
        submittedBy: { name: 'Rohan Sharma', email: 'citizen@eabhaya.in' }
      }
    ];
  }

  if (!globalThis.mockAudits) {
    globalThis.mockAudits = [];
  }

  return {
    getUsers: () => globalThis.mockUsers!,
    getComplaints: () => globalThis.mockComplaints!,
    getContacts: () => globalThis.mockContacts!,
    getAudits: () => globalThis.mockAudits!,
    
    addUser: (user: User) => {
      globalThis.mockUsers!.push(user);
    },
    addComplaint: (complaint: Complaint) => {
      globalThis.mockComplaints!.unshift(complaint);
    },
    updateComplaint: (id: string, updates: Partial<Complaint>) => {
      const idx = globalThis.mockComplaints!.findIndex(c => c.id === id);
      if (idx !== -1) {
        globalThis.mockComplaints![idx] = {
          ...globalThis.mockComplaints![idx],
          ...updates,
          updatedAt: new Date()
        };
        return globalThis.mockComplaints![idx];
      }
      return null;
    },
    addAudit: (audit: AuditLog) => {
      globalThis.mockAudits!.unshift(audit);
    }
  };
}

export const mockDb = initializeMockDb();
