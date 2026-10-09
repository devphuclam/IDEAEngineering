import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../..');
const DIST_DIR = path.join(REPO_ROOT, 'apps/web/dist');

// Find system Chromium / Edge binary
function findBrowserBinary() {
  const candidates = [
    process.env['PROGRAMFILES(X86)'] ? path.join(process.env['PROGRAMFILES(X86)'], 'Microsoft/Edge/Application/msedge.exe') : null,
    process.env['PROGRAMFILES'] ? path.join(process.env['PROGRAMFILES'], 'Microsoft/Edge/Application/msedge.exe') : null,
    process.env['LOCALAPPDATA'] ? path.join(process.env['LOCALAPPDATA'], 'Microsoft/Edge/Application/msedge.exe') : null,
    process.env['PROGRAMFILES(X86)'] ? path.join(process.env['PROGRAMFILES(X86)'], 'Google/Chrome/Application/chrome.exe') : null,
    process.env['PROGRAMFILES'] ? path.join(process.env['PROGRAMFILES'], 'Google/Chrome/Application/chrome.exe') : null,
    process.env['LOCALAPPDATA'] ? path.join(process.env['LOCALAPPDATA'], 'Google/Chrome/Application/chrome.exe') : null,
  ].filter(Boolean);

  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return 'msedge';
}

const BROWSER_PATH = findBrowserBinary();
const PORT = 5088;

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.json': 'application/json',
};

// Mock Server Scope Data
const testContext = {
  actorId: '11111111-1111-4111-8111-111111111111',
  accountId: '22222222-2222-4222-8222-222222222222',
  organizationId: '33333333-3333-4333-8333-333333333333',
  displayName: 'Nguyễn Văn Quản Trị',
  organizationName: 'IDEA Industrial Hub',
  actions: [
    'role.catalogue.read',
    'role.definition.prepare',
    'role.definition.activate',
    'project.admin.read',
  ],
};

const samplePermissions = [
  {
    code: 'project.read',
    owner: 'PROJECT',
    scopeKinds: ['ORGANIZATION', 'PROJECT'],
    principalKinds: ['ACTOR', 'PROJECT_GROUP'],
    participantMembershipRequired: false,
    implementationState: 'IMPLEMENTED',
  },
  {
    code: 'role.catalogue.read',
    owner: 'IAM',
    scopeKinds: ['ORGANIZATION', 'PROJECT'],
    principalKinds: ['ACTOR'],
    participantMembershipRequired: false,
    implementationState: 'IMPLEMENTED',
  },
  {
    code: 'access.inspect',
    owner: 'IAM',
    scopeKinds: ['ORGANIZATION', 'PROJECT'],
    principalKinds: ['ACTOR'],
    participantMembershipRequired: false,
    implementationState: 'IMPLEMENTED',
  },
  {
    code: 'audit.read',
    owner: 'IAM',
    scopeKinds: ['ORGANIZATION'],
    principalKinds: ['ACTOR'],
    participantMembershipRequired: false,
    implementationState: 'DESIGN',
  },
];

const sampleRoles = [
  {
    definitionId: '00000000-0000-4000-8000-000000000001',
    roleVersionId: '00000000-0000-4000-8000-000000000011',
    roleCode: 'org-admin',
    version: 1,
    displayName: 'Quản trị viên Tổ chức',
    builtIn: true,
    classification: 'HIGHEST',
    scopeKinds: ['ORGANIZATION'],
    principalKinds: ['ACTOR'],
    contentDigest: 'a'.repeat(64),
    permissions: samplePermissions.filter((p) => p.implementationState === 'IMPLEMENTED'),
    selectable: true,
    availabilityReason: null,
    managementScope: null,
  },
  {
    definitionId: '00000000-0000-4000-8000-000000000002',
    roleVersionId: '00000000-0000-4000-8000-000000000022',
    roleCode: 'custom-cad-reviewer',
    version: 1,
    displayName: 'Kỹ sư duyệt CAD Tùy biến',
    builtIn: false,
    classification: 'BUSINESS',
    scopeKinds: ['PROJECT'],
    principalKinds: ['ACTOR', 'PROJECT_GROUP'],
    contentDigest: 'b'.repeat(64),
    permissions: [samplePermissions[0]],
    selectable: true,
    availabilityReason: null,
    managementScope: { kind: 'ORGANIZATION', organizationId: '33333333-3333-4333-8333-333333333333' },
  },
];

let isAuthenticated = false;

const server = http.createServer((req, res) => {
  const urlParts = req.url.split('?');
  const reqPath = urlParts[0];

  // API endpoints
  if (reqPath === '/api/v1/administration/context' || reqPath === '/api/v1/context') {
    if (isAuthenticated) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(testContext));
    } else {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ kind: 'refused', status: 401 }));
    }
    return;
  }

  if (reqPath === '/api/v1/identity/csrf') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ headerName: 'X-CSRF-TOKEN', token: 'valid-test-csrf-token' }));
    return;
  }

  if (reqPath === '/api/v1/administration/roles' || reqPath === '/api/v1/roles') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ items: sampleRoles, offset: 0, limit: 50, hasMore: false }));
    return;
  }

  if (reqPath === '/api/v1/administration/permissions' || reqPath === '/api/v1/permissions') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ items: samplePermissions, offset: 0, limit: 50, hasMore: false }));
    return;
  }

  if (reqPath === '/api/v1/administration/projects' || reqPath === '/api/v1/projects') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ items: [], offset: 0, limit: 50, hasMore: false }));
    return;
  }

  // Static files from dist
  let filePath = path.join(DIST_DIR, reqPath === '/' ? '/index.html' : reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(fs.readFileSync(filePath));
  } else {
    const indexHtml = path.join(DIST_DIR, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(fs.readFileSync(indexHtml));
  }
});

server.listen(PORT, async () => {
  console.log(`[Runner] Embedded test server running at http://localhost:${PORT}`);

  const testReport = {
    timestamp: new Date().toISOString(),
    viewports: ['1024x768', '1440x900'],
    assertions: [],
  };

  let failures = 0;
  const recordAssertion = (name, passed, detail = '') => {
    testReport.assertions.push({ name, passed, detail });
    if (!passed) failures++;
    console.log(`[${passed ? 'PASS' : 'FAIL'}] ${name}${detail ? ` - ${detail}` : ''}`);
  };

  let browserProc = null;
  let ws = null;

  try {
    const cdpPort = 9227;
    const userDataDir = path.join(os.tmpdir(), `idea-browser-test-${Date.now()}`);
    if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });

    browserProc = spawn(BROWSER_PATH, [
      '--headless=new',
      `--remote-debugging-port=${cdpPort}`,
      `--user-data-dir=${userDataDir}`,
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--window-size=1440,900',
      'about:blank',
    ]);

    await new Promise((r) => setTimeout(r, 1500));

    const verRes = await fetch(`http://127.0.0.1:${cdpPort}/json/version`);
    const ver = await verRes.json();
    console.log(`[Runner] Connected to browser: ${ver.Browser}`);

    // Create target page
    const newPageRes = await fetch(`http://127.0.0.1:${cdpPort}/json/new?http://localhost:${PORT}/#rbac-pilot`, { method: 'PUT' });
    const target = await newPageRes.json();
    ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let msgId = 1;
    const pending = new Map();
    const consoleLogs = [];

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.method === 'Runtime.consoleAPICalled') {
        const text = data.params.args.map((a) => a.value || a.description).join(' ');
        consoleLogs.push({ type: data.params.type, text });
      } else if (data.method === 'Log.entryAdded') {
        consoleLogs.push({ type: data.params.entry.level, text: data.params.entry.text });
      }

      if (data.id && pending.has(data.id)) {
        const { resolve, reject } = pending.get(data.id);
        pending.delete(data.id);
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    };

    const send = (method, params = {}) =>
      new Promise((resolve, reject) => {
        const id = msgId++;
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Log.enable');

    // =========================================================================
    // PHASE 1: Unauthenticated Fail-Closed Verification (1024px & 1440px)
    // =========================================================================
    isAuthenticated = false;

    // Viewport 1440px
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await send('Page.navigate', { url: `http://localhost:${PORT}/#rbac-pilot` });
    await new Promise((r) => setTimeout(r, 1200));

    const checkFailClosed1440 = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const text = document.body.innerText;
          const hasWarning = text.includes('Yêu cầu phiên xác thực (AdministrationContext)');
          const hasFailClosed = text.includes('fail-closed');
          const hasCandidateBtn = Array.from(document.querySelectorAll('button')).some(b => b.textContent.includes('Tạo Candidate'));
          return { hasWarning, hasFailClosed, hasCandidateBtn };
        })()
      `,
      returnByValue: true,
    });
    recordAssertion(
      'Phase 1 — Unauthenticated Fail-Closed Screen at 1440px',
      checkFailClosed1440.result.value.hasWarning &&
      checkFailClosed1440.result.value.hasFailClosed &&
      !checkFailClosed1440.result.value.hasCandidateBtn,
      'Locked with warning, fail-closed notice, no mutation actions'
    );

    // Viewport 1024px
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1024,
      height: 768,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await new Promise((r) => setTimeout(r, 600));

    const checkFailClosed1024 = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const text = document.body.innerText;
          const hasLoginBtn = Array.from(document.querySelectorAll('a, button')).some(b => b.textContent.includes('Đăng nhập vào hệ thống'));
          return { hasLoginBtn, width: window.innerWidth };
        })()
      `,
      returnByValue: true,
    });
    recordAssertion(
      'Phase 1 — Unauthenticated Responsive Render at 1024px',
      checkFailClosed1024.result.value.hasLoginBtn && checkFailClosed1024.result.value.width === 1024,
      'Rendered login link and correct responsive layout'
    );

    // =========================================================================
    // PHASE 2: Authenticated Flow — Roles, DataTable, Inspector, Overlays
    // =========================================================================
    isAuthenticated = true;

    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await send('Page.reload');
    await new Promise((r) => setTimeout(r, 2000));

    const checkAuthCatalogue = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const text = document.body.innerText;
          const hasRoles = text.includes('Quản lý vai trò (RBAC)') && text.includes('org-admin');
          const hasCustomRole = text.includes('custom-cad-reviewer');
          const tableRows = document.querySelectorAll('.idea-table tbody tr').length;
          return { hasRoles, hasCustomRole, tableRows };
        })()
      `,
      returnByValue: true,
    });
    recordAssertion(
      'Phase 2 — Authenticated Role Catalogue & Semantic DataTable Load',
      checkAuthCatalogue.result.value.hasRoles && checkAuthCatalogue.result.value.tableRows === 2,
      `Loaded ${checkAuthCatalogue.result.value.tableRows} roles into DataTable`
    );

    // =========================================================================
    // PHASE 3: Semantic DataTable Keyboard Navigation (Enter / ArrowDown)
    // =========================================================================
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const rows = document.querySelectorAll('.idea-table tbody tr');
          if (rows.length >= 2) {
            rows[0].focus();
            rows[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
          }
        })()
      `,
    });
    await new Promise((r) => setTimeout(r, 300));

    const testTableKeyboard = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const rows = document.querySelectorAll('.idea-table tbody tr');
          const isSecondSelected = rows[1]?.classList.contains('idea-table-row--selected');
          const selectedText = document.querySelector('.idea-table-footer')?.innerText;
          return { isSecondSelected, selectedText };
        })()
      `,
      returnByValue: true,
    });
    recordAssertion(
      'Phase 3 — DataTable Real Keyboard Navigation & Selection',
      Boolean(testTableKeyboard.result.value.isSecondSelected),
      `Second row selected: ${testTableKeyboard.result.value.isSecondSelected}`
    );

    // =========================================================================
    // PHASE 4: Topmost Overlay Keyboard Isolation (Drawer + Dialog)
    // =========================================================================
    // Click "+ Tạo Candidate" to open Drawer
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const createBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Tạo Candidate'));
          if (createBtn) createBtn.click();
        })()
      `,
    });
    await new Promise((r) => setTimeout(r, 400));

    const checkDrawerOpen = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const drawer = document.querySelector('.idea-drawer');
          const appRoot = document.getElementById('appRoot');
          const isDrawerPresent = Boolean(drawer);
          const isBackgroundInert = appRoot ? appRoot.inert : false;
          const isBackgroundAriaHidden = appRoot ? appRoot.getAttribute('aria-hidden') === 'true' : false;
          return { isDrawerPresent, isBackgroundInert, isBackgroundAriaHidden };
        })()
      `,
      returnByValue: true,
    });
    recordAssertion(
      'Phase 4.1 — Open Drawer & Background Inert Isolation',
      checkDrawerOpen.result.value.isDrawerPresent &&
      checkDrawerOpen.result.value.isBackgroundInert &&
      checkDrawerOpen.result.value.isBackgroundAriaHidden,
      'Drawer open, #appRoot inert=true, aria-hidden=true'
    );

    // Type into Drawer to make dirty
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const nameInput = document.querySelector('.idea-drawer input[placeholder*="Kỹ sư"]');
          if (nameInput) {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            nativeInputValueSetter.call(nameInput, 'Chuyên viên Kiểm tra Hồ sơ Thiết kế');
            nameInput.dispatchEvent(new Event('change', { bubbles: true }));
            nameInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
        })()
      `,
    });
    await new Promise((r) => setTimeout(r, 200));

    // Click "Đóng" button on Drawer -> Opens Discard Confirmation Dialog on top of Drawer
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const closeBtn = Array.from(document.querySelectorAll('.idea-drawer-header button, .idea-drawer-footer button'))
            .find(b => b.textContent.includes('Đóng') || b.getAttribute('aria-label') === 'Đóng bảng trượt');
          if (closeBtn) closeBtn.click();
        })()
      `,
    });
    await new Promise((r) => setTimeout(r, 400));

    const checkNestedOverlays = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const drawer = document.querySelector('.idea-drawer-backdrop');
          const dialog = document.querySelector('.idea-dialog');
          const dialogTitle = dialog ? dialog.querySelector('h2')?.innerText : '';
          const isDrawerInert = drawer ? drawer.inert : false;
          const isDialogInert = dialog ? dialog.inert : true;
          return {
            hasDrawer: Boolean(drawer),
            hasDialog: Boolean(dialog),
            dialogTitle,
            isDrawerInert,
            isDialogInert
          };
        })()
      `,
      returnByValue: true,
    });
    recordAssertion(
      'Phase 4.2 — Nested Overlays Stacking (Dialog over Drawer)',
      checkNestedOverlays.result.value.hasDrawer &&
      checkNestedOverlays.result.value.hasDialog &&
      checkNestedOverlays.result.value.isDrawerInert &&
      !checkNestedOverlays.result.value.isDialogInert,
      `Dialog active; Drawer underlying layer marked inert=true`
    );

    // Press Escape once -> Closes only Dialog
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await new Promise((r) => setTimeout(r, 400));

    const checkEscapeOnce = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const drawer = document.querySelector('.idea-drawer-backdrop');
          const dialog = document.querySelector('.idea-dialog');
          const appRoot = document.getElementById('appRoot');
          return {
            hasDrawer: Boolean(drawer),
            hasDialog: Boolean(dialog),
            isDrawerInert: drawer ? drawer.inert : true,
            isBackgroundInert: appRoot ? appRoot.inert : false
          };
        })()
      `,
      returnByValue: true,
    });
    recordAssertion(
      'Phase 4.3 — First Escape Closes Only Dialog; Drawer Remains Interactive',
      checkEscapeOnce.result.value.hasDrawer &&
      !checkEscapeOnce.result.value.hasDialog &&
      !checkEscapeOnce.result.value.isDrawerInert &&
      checkEscapeOnce.result.value.isBackgroundInert,
      'Dialog closed; Drawer intact; #appRoot remains protected'
    );

    // Close drawer cleanly
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const discardBtn = Array.from(document.querySelectorAll('.idea-drawer-footer button'))
            .find(b => b.textContent.includes('Hủy') || b.textContent.includes('Đóng'));
          if (discardBtn) discardBtn.click();
        })()
      `,
    });
    await new Promise((r) => setTimeout(r, 300));

    // Confirm discard modal
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const confirmBtn = Array.from(document.querySelectorAll('.idea-dialog button'))
            .find(b => b.textContent.includes('Xác nhận') || b.textContent.includes('Hủy'));
          if (confirmBtn) confirmBtn.click();
        })()
      `,
    });
    await new Promise((r) => setTimeout(r, 400));

    const checkBothClosed = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const drawer = document.querySelector('.idea-drawer');
          const dialog = document.querySelector('.idea-dialog');
          const appRoot = document.getElementById('appRoot');
          return {
            hasDrawer: Boolean(drawer),
            hasDialog: Boolean(dialog),
            isBackgroundInert: appRoot ? appRoot.inert : true
          };
        })()
      `,
      returnByValue: true,
    });
    recordAssertion(
      'Phase 4.4 — Cleanup Restores Background Interactivity',
      !checkBothClosed.result.value.hasDrawer &&
      !checkBothClosed.result.value.hasDialog &&
      !checkBothClosed.result.value.isBackgroundInert,
      'Both overlays closed; #appRoot inert=false'
    );

    // =========================================================================
    // PHASE 5: DOM Integrity & Console Cleanliness
    // =========================================================================
    const checkDOMIntegrity = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const allIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
          const duplicates = allIds.filter((id, index) => allIds.indexOf(id) !== index);
          return { totalIds: allIds.length, duplicates };
        })()
      `,
      returnByValue: true,
    });
    recordAssertion(
      'Phase 5 — DOM Integrity & Strict ID Uniqueness',
      checkDOMIntegrity.result.value.duplicates.length === 0,
      `Total IDs: ${checkDOMIntegrity.result.value.totalIds}, Duplicates: ${checkDOMIntegrity.result.value.duplicates.length}`
    );

    const jsErrors = consoleLogs.filter((l) => l.type === 'error' && !l.text.includes('401'));
    recordAssertion(
      'Phase 5 — Browser Console Cleanliness (0 JavaScript Exceptions)',
      jsErrors.length === 0,
      `Total logs: ${consoleLogs.length}, JS Errors: ${jsErrors.length}`
    );

    console.log(`\n[Runner] Browser interaction test suite completed. Assertions: ${testReport.assertions.length}, Failures: ${failures}`);

    ws.close();
    browserProc.kill();
  } catch (err) {
    console.error('[Runner] Browser interaction test failed:', err);
    recordAssertion('Browser Interaction Suite Execution', false, String(err));
    if (ws) ws.close();
    if (browserProc) browserProc.kill();
  } finally {
    server.close();
    process.exit(failures > 0 ? 1 : 0);
  }
});
