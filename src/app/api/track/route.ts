import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { UAParser } from 'ua-parser-js';
import { getDb } from '@/utils/db';

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();

    // Check for existing visitor cookie
    let visitorId = request.cookies.get('visitor_id')?.value;
    let isNewVisitor = false;

    if (!visitorId) {
      visitorId = uuidv4();
      isNewVisitor = true;
    }

    const userAgentStr = request.headers.get('user-agent') || 'Unknown';
    const parser = new UAParser(userAgentStr);
    const result = parser.getResult();
    
    const deviceName = result.device.model 
      ? `${result.device.vendor} ${result.device.model}` 
      : `${result.browser.name || 'Unknown Browser'} on ${result.os.name || 'Unknown OS'}`;

    // Upsert visitor logic
    const upsertQuery = `
      INSERT INTO visitors (id, device_name, visit_count, last_visit)
      VALUES ($1, $2, 1, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE 
      SET 
        visit_count = visitors.visit_count + 1,
        last_visit = CURRENT_TIMESTAMP,
        device_name = $2
      RETURNING xmax;
    `;
    
    const res = await db.query(upsertQuery, [visitorId, deviceName.trim()]);
    
    // In PostgreSQL, xmax is 0 if it was an insert, and non-zero if it was an update.
    // However, since we might just rely on the cookie presence to know if it's new:
    if (res.rowCount && res.rows[0].xmax === '0') {
       isNewVisitor = true;
    }

    const response = NextResponse.json({ success: true, isNewVisitor });
    
    if (isNewVisitor) {
      // Set a cookie that expires in 10 years
      response.cookies.set('visitor_id', visitorId, { 
        path: '/',
        maxAge: 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: 'lax'
      });
    }

    return response;
  } catch (error) {
    console.error('Error tracking visitor in DB:', error);
    return NextResponse.json({ success: false, error: 'Failed to track' }, { status: 500 });
  }
}
