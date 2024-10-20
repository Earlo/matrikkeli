import { launch } from 'puppeteer-core';
import { NextResponse } from 'next/server';
import chromium from '@sparticuz/chromium';

// Optional: If you'd like to use the new headless mode. "shell" is the default.
// NOTE: Because we build the shell binary, this option does not work.
//       However, this option will stay so when we migrate to full chromium it will work.
chromium.setHeadlessMode = true;

// Optional: If you'd like to disable webgl, true is the default.
chromium.setGraphicsMode = false;

const chromeArgs = [
  '--font-render-hinting=none', // Improves font-rendering quality and spacing
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-gpu',
  '--disable-dev-shm-usage',
  '--disable-accelerated-2d-canvas',
  '--disable-animations',
  '--disable-background-timer-throttling',
  '--disable-restore-session-state',
  '--disable-web-security', // Only if necessary, be cautious with security implications
  '--single-process', // Be cautious as this can affect stability in some environments
];

const isLocal = process.env.IS_LOCAL == 'true';

export async function POST(req) {
  const body = await req.json();
  const { people } = body;

  console.log('local?', isLocal, people);
  // Validate that `people` is an array and not empty
  if (!people || !Array.isArray(people) || people.length === 0) {
    return new NextResponse('Invalid or missing "people" data', {
      status: 400,
    });
  }

  const browser = await launch({
    ...(isLocal
      ? {}
      : {
          args: chromeArgs,
          executablePath: await chromium.executablePath(),
          ignoreHTTPSErrors: true,
          headless: true,
        }),
  });

  const page = await browser.newPage();

  let content = `
    <html>
      <head>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: #FFA500;
          }
          .page {
            width: 100%;
            height: 100%;
            page-break-after: always;
            padding: 4mm 6mm 4mm 6mm;
            box-sizing: border-box;
            position: relative;
          }
          .profile {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
          }
          .profile img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            border-bottom-right-radius: 0;
            border: 3px solid #fff;
            margin-right: 16px;
          }
          .content {
            color: #fff;
          }
          .content h1 {
            font-size: 24px;
            font-weight: bold;
            margin: 0;
          }
          .content p {
            font-size: 14px;
            margin: 4px 0;
          }
          .section-title {
            font-size: 20px;
            font-weight: bold;
            margin-top: 16px;
            margin-bottom: 8px;
          }
          .list-item {
            font-size: 14px;
            margin-bottom: 8px;
          }
          .footer {
            position: absolute;
            bottom: 8mm;
            left: 8mm;
            right: 8mm;
            border-top: 2px dashed #fff;
            padding-top: 8px;
            text-align: center;
            font-size: 14px;
          }
          .checkbox-container {
            display: flex;
            align-items: center;
            margin-top: 8px;
            font-size: 14px;
          }
          .checkbox-container input {
            margin-right: 8px;
          }
        </style>
      </head>
      <body>
  `;

  people.forEach((person) => {
    const {
      first_name,
      last_name,
      email,
      image_url_session,
      description,
      work_history,
      roles,
    } = person;
    content += `
      <div class="page">
        <div class="profile">
          <img src="${image_url_session || '/blank_user.png'}" alt="Profile Picture" />
          <div class="content">
            <h1>${first_name} ${last_name}</h1>
            <p>${email}</p>
          </div>
        </div>
        <div class="content">
          <p>${description || 'No description provided'}</p>
          <div class="section-title">Roles</div>
          <ul>
            ${JSON.parse(roles)
              .map(
                (role) => `
              <li class="list-item">
                <strong>${role.title}</strong> at ${role.organization} (${role.start} - ${role.end})
              </li>
            `,
              )
              .join('')}
          </ul>
          <div class="section-title">Work History</div>
          <ul>
            ${work_history
              .map(
                (work) => `
              <li class="list-item">
                <strong>${work.title}</strong> at ${work.organization} (${work.start} - ${work.end || 'Present'})
              </li>
            `,
              )
              .join('')}
          </ul>
        </div>
        <div class="footer">
          <div>Notes:</div>
          <div class="checkbox-container">
            <input type="checkbox" id="met-person" />
            <label for="met-person">I've met this person</label>
          </div>
        </div>
      </div>
    `;
  });

  content += `
      </body>
    </html>
  `;

  await page.setContent(content);
  const pdfBuffer = await page.pdf({
    format: 'A6',
    printBackground: true,
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  await browser.close();

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=people_booklet.pdf',
    },
  });
}
