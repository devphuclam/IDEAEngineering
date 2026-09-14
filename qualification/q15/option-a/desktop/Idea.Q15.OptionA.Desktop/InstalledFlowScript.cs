namespace Idea.Q15.OptionA.Desktop;

internal static class InstalledFlowScript
{
    // This script drives only the rendered controls. It deliberately has no
    // API, bridge, or workspace access; the full path remains React ->
    // WebView2 -> WPF -> Named Pipe -> Workspace.
    public const string JavaScript = """
(async () => {
  const wait = async (selector, predicate = () => true, timeoutMs = 12000) => {
    const started = performance.now();
    while (performance.now() - started < timeoutMs) {
      const element = document.querySelector(selector);
      if (element && predicate(element)) return element;
      await new Promise(resolve => setTimeout(resolve, 40));
    }
    throw new Error(`TIMEOUT:${selector}`);
  };
  const setValue = (selector, value) => {
    const element = document.querySelector(selector);
    if (!element) throw new Error(`MISSING:${selector}`);
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
    setter?.call(element, value);
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  };
  const click = async (selector) => {
    const element = await wait(selector, element => !element.disabled);
    element.click();
    return element;
  };
  const result = { candidate: 'option-a', surface: 'React/WebView2/WPF', uiIntegration: true, webViewBoundary: true, wpfBridge: true, workspaceIpc: true };
  try {
    await wait('[data-q15="login-submit"]', element => !element.disabled);
    setValue('[data-q15="login-password"]', 'q15-engineer-only');
    await click('[data-q15="login-submit"]');
    await wait('[data-q15="search-query"]');
    setValue('[data-q15="search-query"]', 'pump');
    await click('[data-q15="search-submit"]');
    const row = await wait('[data-q15="grid-row-0"]');
    row.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    await wait('[data-q15="checkout"]', element => !element.disabled);
    await click('[data-q15="checkout"]');
    await wait('[data-q15="operation"]', element => element.textContent?.includes('Committed'));
    await click('[data-q15="open-workspace"]');
    await wait('[data-q15="notice"]', element => element.textContent?.includes('DOCUMENT_MATERIALIZED'));
    await click('[data-q15="checkin"]');
    await wait('[data-q15="operation"]', element => element.textContent?.includes('Committed'));
    result.result = 'PASS';
    result.hostMarker = document.documentElement.dataset.q15Host ?? 'unknown';
  } catch (error) {
    result.result = 'FAIL';
    result.stageError = String(error);
    result.hostMarker = document.documentElement.dataset.q15Host ?? 'unknown';
  }
  window.__q15InstalledFlowResult = result;
  return true;
})()
""";
}
