import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const query = (message || '').toLowerCase();

    let response =
      'Greetings! I am **Rakshak AI**, your virtual guide for legal and procedural support on e-Abhaya. Tell me what happened, or ask about standard procedures, required documents, or case tracking.';

    if (
      query.includes('document') ||
      query.includes('vehicle') ||
      query.includes('car') ||
      query.includes('bike') ||
      query.includes('phone') ||
      query.includes('theft')
    ) {
      response =
        'To register an FIR for **Theft (Vehicle/Mobile/Property)**, please ensure you gather the following documents:\n\n' +
        '1. **Proof of Ownership:** Registration Certificate (RC) for vehicles, or purchase invoice/bill for phones and electronics.\n' +
        '2. **Device Unique ID:** IMEI Number for smartphones (found on the box or dial `*#06#`), or Chassis/Engine number for motorcars/bikes.\n' +
        '3. **Valid ID Card:** Aadhaar Card, Driving License, or Voter ID to verify complainant identity.\n' +
        '4. **Incident Details:** Approximate time, location description, and active CCTV camera spots nearby if any.\n\n' +
        'Start filing this immediately via the **"File New Complaint"** button on your Citizen Portal!';
    } else if (
      query.includes('cyber') ||
      query.includes('hacked') ||
      query.includes('card') ||
      query.includes('phishing') ||
      query.includes('bank') ||
      query.includes('money') ||
      query.includes('scam')
    ) {
      response =
        '🚨 **CRITICAL STEPS FOR ONLINE FINANCIAL SCAMS:**\n\n' +
        '1. **Golden Hour Rule:** Immediately call the **National Cyber Helpline 1930** to freeze the transaction in the banking system.\n' +
        '2. **Bank Freeze:** Contact your bank immediately to block credit/debit cards and lock online banking access.\n' +
        '3. **Collect Evidence:** Take immediate screenshots of transaction messages, phishing SMS links, call history of the scammer, and bank transaction sheets.\n' +
        '4. **File Cyber Complaint:** File under the **CYBER_CRIME** category on our wizard. The case will be triaged and routed directly to the cyber investigation wing.';
    } else if (
      query.includes('fir') ||
      query.includes('register') ||
      query.includes('complaint') ||
      query.includes('submit')
    ) {
      response =
        'To file an official crime complaint and register a smart FIR:\n\n' +
        '1. Log into your **Citizen Dashboard** and click **"File New Complaint"**.\n' +
        '2. **Step 1:** Enter Incident Category, general location, and Date/Time.\n' +
        '3. **Step 2:** Write the narrative text describing exactly what happened. Our **AI Triage engine** will analyze it in real-time, predict the urgency, and suggest legal codes.\n' +
        '4. **Step 3:** Drag-and-drop screenshots or documents as evidence, then submit.\n' +
        '5. **Next steps:** You will get a unique tracking ID (e.g. `ABH-2026-xxxx`) and an Investigating Officer will review your file to lock FIR registration.';
    } else if (
      query.includes('status') ||
      query.includes('track') ||
      query.includes('timeline') ||
      query.includes('progress')
    ) {
      response =
        'You can track your complaint live on the main timeline of your Citizen Portal. Here is what the status markers represent:\n\n' +
        '- **PENDING:** Complaint is submitted and waiting for assigned officer allotment.\n' +
        '- **REVIEWING:** Investigating Officer is actively examining the case details, verifying evidence, and matching penal clauses.\n' +
        '- **FIR REGISTERED:** Officially approved! The legal BNS/IPC codes are locked, and formal investigation has commenced.\n' +
        '- **RESOLVED:** Case resolved, final report submitted, and action logged.';
    }

    return NextResponse.json({ response });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
}
