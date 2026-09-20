const koffi = require('koffi');

const kernel32 = koffi.load('kernel32.dll');
const user32 = koffi.load('user32.dll');

const RECT = koffi.struct('RECT', {
  left: 'int32',
  top: 'int32',
  right: 'int32',
  bottom: 'int32'
});

const GetCurrentProcessId = kernel32.func('uint __stdcall GetCurrentProcessId()');

const SetProcessDPIAware = user32.func('int __stdcall SetProcessDPIAware()');
const GetDesktopWindow = user32.func('void *__stdcall GetDesktopWindow()');
const GetWindow = user32.func('void *__stdcall GetWindow(void *hWnd, uint uCmd)');
const IsWindowVisible = user32.func('bool __stdcall IsWindowVisible(void *hWnd)');
const GetWindowRect = user32.func('bool __stdcall GetWindowRect(void *hWnd, RECT *rect)');
const SetWindowPos = user32.func('bool __stdcall SetWindowPos(void *hWnd, void *hWndInsertAfter, int x, int y, int cx, int cy, uint flags)');
const GetForegroundWindow = user32.func('int __stdcall GetForegroundWindow()');
const GetWindowThreadProcessId = user32.func('uint __stdcall GetWindowThreadProcessId(void *hWnd, intptr_t *lpdwProcessId)');
const GetWindowLongW = user32.func('int __stdcall GetWindowLongW(void *hWnd, int nIndex)');
const GetWindowLongPtrW = user32.func('int __stdcall GetWindowLongPtrW(void *hWnd, int nIndex)');
const GetClassNameA = user32.func('int __stdcall GetClassNameA(void *hWnd, char *lpClassName, int nMaxCount)');

const GW_HWNDNEXT = 2;
const GW_CHILD = 5;
const WS_EX_TOOLWINDOW = 0x00000080;
const SWP_NOZORDER = 0x0004;
const SWP_SHOWWINDOW = 0x0040;
const MAX_NAME = 256;

const ownPid = GetCurrentProcessId();

function getWindowInfo(hwnd) {
  try {
    const rectPtr = koffi.alloc('RECT', 1);
    const ok = GetWindowRect(hwnd, rectPtr);
    if (!ok) return null;
    const rect = koffi.decode(rectPtr, 'RECT');

    const clsBuf = koffi.alloc('char', MAX_NAME);
    const clsLen = GetClassNameA(hwnd, clsBuf, MAX_NAME);
    const className = clsLen > 0 ? koffi.decode(clsBuf, 'char', clsLen) : '';

    const style = GetWindowLongW(hwnd, -16);
    const exStyle = GetWindowLongPtrW(hwnd, -20);

    return {
      hwnd,
      className,
      rect: {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.right - rect.left,
        height: rect.bottom - rect.top
      },
      style,
      exStyle
    };
  } catch (err) {
    return null;
  }
}

function getWindowPid(hwnd) {
  try {
    const pidPtr = koffi.alloc('intptr_t', 1);
    GetWindowThreadProcessId(hwnd, pidPtr);
    const pid = Number(koffi.decode(pidPtr, 'intptr_t')) || 0;
    return pid;
  } catch (err) {
    return 0;
  }
}

function isAuxiliaryWindow(info) {
  if (!info || !info.hwnd) return true;

  const pid = getWindowPid(info.hwnd);
  if (pid && pid === ownPid) return true;

  const cls = (info.className || '').toLowerCase();
  if (cls === 'progman' || cls === 'workerw' || cls === 'shell_traywnd' || cls === 'toolkit_window' || cls === 'candybar') return true;

  if (info.exStyle & WS_EX_TOOLWINDOW) return true;

  if (!IsWindowVisible(info.hwnd)) return true;

  if (info.rect.width < 80 || info.rect.height < 80) return true;

  const blacklist = [
    'directuihwnd', 'windowsuicore', 'application_frame_window',
    'msctfime', 'glassframe', 'uicontainer'
  ];
  if (blacklist.includes(cls)) return true;

  return false;
}

function enumerateSnappableWindows() {
  const windows = [];
  const desktop = GetDesktopWindow();
  if (!desktop) return windows;

  let hwndPtr = GetWindow(desktop, GW_CHILD);

  while (hwndPtr) {
    const hwnd = hwndPtr;
    hwndPtr = GetWindow(hwnd, GW_HWNDNEXT);

    const info = getWindowInfo(hwnd);
    if (isAuxiliaryWindow(info)) continue;

    windows.push({
      handle: hwnd,
      className: info.className,
      pid: getWindowPid(hwnd),
      rect: info.rect
    });
  }

  return windows;
}

function getTopMostSnappableWindow() {
  const desktop = GetDesktopWindow();
  if (!desktop) return null;

  let hwndPtr = GetWindow(desktop, GW_CHILD);

  while (hwndPtr) {
    const hwnd = hwndPtr;
    hwndPtr = GetWindow(hwnd, GW_HWNDNEXT);

    const info = getWindowInfo(hwnd);
    if (isAuxiliaryWindow(info)) continue;

    return { hwnd, info, pid: getWindowPid(hwnd) };
  }

  return null;
}

function snapWindowToBounds(hwnd, bounds) {
  const flags = SWP_NOZORDER | SWP_SHOWWINDOW;
  return SetWindowPos(
    hwnd,
    null,
    Math.round(bounds.x),
    Math.round(bounds.y),
    Math.round(bounds.width),
    Math.round(bounds.height),
    flags
  );
}

function getForegroundWindowHandle() {
  try {
    return GetForegroundWindow();
  } catch (err) {
    return 0;
  }
}

function getForegroundSnappableHandle() {
  const hwnd = getForegroundWindowHandle();
  if (!hwnd) return 0;

  const info = getWindowInfo(hwnd);
  if (isAuxiliaryWindow(info)) return 0;

  return hwnd;
}

try {
  SetProcessDPIAware();
} catch (err) {
  console.warn('SetProcessDPIAware failed:', err);
}

module.exports = {
  getForegroundWindowHandle,
  getForegroundSnappableHandle,
  enumerateSnappableWindows,
  getTopMostSnappableWindow,
  snapWindowToBounds,
  getWindowInfo
};