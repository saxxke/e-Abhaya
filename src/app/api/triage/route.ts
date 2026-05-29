import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { title, description } = await req.json();
    const text = ((title || '') + ' ' + (description || '')).toLowerCase();

    let category = 'THEFT';
    let priorityScore = 30;
    let suggestedSections: string[] = ['Section 303(2) BNS - Theft'];
    let aiSummary = 'Auto-triage: Stolen item reported.';

    if (
      text.includes('hacked') ||
      text.includes('card code') ||
      text.includes('phishing') ||
      text.includes('scam') ||
      text.includes('otp') ||
      text.includes('online fraud')
    ) {
      category = 'CYBER';
      priorityScore = 78;
      suggestedSections = [
        'Section 318 BNS - Cheating',
        'Section 66D - Information Technology Act'
      ];
      aiSummary = 'AI Triage: Suspected online financial fraud or credential phishing. Immediate account freeze advice is suggested.';
    } else if (
      text.includes('hit') ||
      text.includes('threatened') ||
      text.includes('assault') ||
      text.includes('weapon') ||
      text.includes('kill') ||
      text.includes('beat')
    ) {
      category = 'ASSAULT';
      priorityScore = 92;
      suggestedSections = [
        'Section 115 BNS - Voluntary Hurt',
        'Section 351 BNS - Criminal Intimidation',
        'Section 331 BNS - House-trespass'
      ];
      aiSummary = 'AI Triage: Explicit physical violence or personal intimidation reported. High threat level detected.';
    } else if (
      text.includes('stole') ||
      text.includes('broke in') ||
      text.includes('theft') ||
      text.includes('robbed') ||
      text.includes('burglar')
    ) {
      category = 'THEFT';
      priorityScore = 55;
      suggestedSections = [
        'Section 303(2) BNS - Theft',
        'Section 331 BNS - House-trespass'
      ];
      aiSummary = 'AI Triage: Trespass or theft from physical premises. Moderate priority assigned.';
    } else {
      category = 'THEFT';
      priorityScore = 25;
      suggestedSections = ['Section 303(2) BNS - Theft'];
      aiSummary = 'AI Triage: General reporting filed. Scheduled for standard officer review.';
    }

    return NextResponse.json({
      category,
      priorityScore,
      suggestedSections,
      aiSummary
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
}
