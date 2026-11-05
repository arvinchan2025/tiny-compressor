import { NextRequest, NextResponse } from 'next/server';

const HOST = 'tinycompressor.com';
const BASE_URL = `https://${HOST}`;

export async function POST(request: NextRequest) {
  const key = process.env.INDEXNOW_API_KEY;

  if (!key) {
    return NextResponse.json(
      { error: 'IndexNow key not configured' },
      { status: 500 }
    );
  }

  const { urls } = await request.json();

  if (!Array.isArray(urls) || urls.length === 0) {
    return NextResponse.json(
      { error: 'Invalid URLs' },
      { status: 400 }
    );
  }

  // Only accept URLs belonging to this website.
  const validUrls = urls.filter((value: string) => {
    try {
      const url = new URL(value);
      return (
        url.origin === BASE_URL &&
        ['http:', 'https:'].includes(url.protocol)
      );
    } catch {
      return false;
    }
  });

  if (validUrls.length === 0 || validUrls.length > 10000) {
    return NextResponse.json(
      { error: 'Invalid URL count' },
      { status: 400 }
    );
  }

  const response = await fetch(
    'https://api.indexnow.org/indexnow',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        host: HOST,
        key,
        keyLocation: `${BASE_URL}/${key}.txt`,
        urlList: validUrls,
      }),
    }
  );

  return NextResponse.json({
    success: response.ok,
    status: response.status,
  });
}