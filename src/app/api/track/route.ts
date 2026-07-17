import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { UAParser } from 'ua-parser-js';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'visitors.json');

// Helper to ensure the file and directory exist
async function initDataFile() {
  try {
    await fs.mkdir(path.dirname(DATA_FILE_PATH), { recursive: true });
    try {
      await fs.access(DATA_FILE_PATH);
    } catch {
      await fs.writeFile(DATA_FILE_PATH, JSON.stringify({ globalUniqueCount: 0, visitors: [] }, null, 2));
    }
  } catch (error) {
    console.error('Error initializing data file:', error);
  }
}

export async function GET(request: NextRequest) {
  try {
    await initDataFile();
    const data = JSON.parse(await fs.readFile(DATA_FILE_PATH, 'utf-8'));

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

    // Find visitor in data
    let visitorIndex = data.visitors.findIndex((v: any) => v.id === visitorId);

    if (visitorIndex === -1) {
      // First time this ID is seen in the database (even if cookie existed but DB was cleared)
      data.globalUniqueCount += 1;
      data.visitors.push({
        id: visitorId,
        deviceName: deviceName.trim(),
        visitCount: 1,
        lastVisit: new Date().toISOString()
      });
      isNewVisitor = true; // Force cookie reset if DB was cleared
    } else {
      // Returning visitor
      data.visitors[visitorIndex].visitCount += 1;
      data.visitors[visitorIndex].lastVisit = new Date().toISOString();
      // Optionally update device name if they switched browsers but kept the cookie?
      // For now, keep the original or update it
      data.visitors[visitorIndex].deviceName = deviceName.trim();
    }

    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2));

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
    console.error('Error tracking visitor:', error);
    return NextResponse.json({ success: false, error: 'Failed to track' }, { status: 500 });
  }
}
