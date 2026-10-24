import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-static';

const SIZE = 512;

/** PNG brand logo for Google (structured data needs a raster logo, min 112×112). */
export async function GET() {
  const svg = await readFile(path.join(process.cwd(), 'public', 'favicon.svg'), 'utf8');
  const src = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#ffffff' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={SIZE} height={SIZE} alt="GetReviewQR" />
      </div>
    ),
    { width: SIZE, height: SIZE }
  );
}
