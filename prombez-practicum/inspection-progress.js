(() => {
  // v4.3.6 parent page info supplies the host viewport height.
  // https://github.com/davidjbradshaw/iframe-resizer/tree/v4.3.6
  if (window.self !== window.top) {
    document.documentElement.style.setProperty('--panel-height', '480px');
    const previousReady = window.iFrameResizer?.onReady;
    window.iFrameResizer = {
      ...window.iFrameResizer,
      onReady() {
        previousReady?.();
        window.parentIFrame?.getPageInfo?.(info => {
          const height = Math.round(info.clientHeight * .75);
          if (height > 0) {
            const value = height + 'px';
            if (document.documentElement.style.getPropertyValue('--panel-height') !== value) {
              document.documentElement.style.setProperty('--panel-height', value);
              window.parentIFrame?.size?.();
            }
          }
        });
      },
    };
  }
  const prefix = 'prombez.inspection.v1.';
  const memory = new Map();

  function read(id) {
    try {
      return JSON.parse(localStorage.getItem(prefix + id)) || {};
    } catch {
      return memory.get(id) || {};
    }
  }

  function update(id, defects, recorded = false) {
    const previous = read(id);
    const next = {
      defects: [...new Set([...(previous.defects || []), ...defects])],
      recorded: Boolean(recorded || previous.recorded),
    };
    memory.set(id, next);
    try { localStorage.setItem(prefix + id, JSON.stringify(next)); } catch {}
    window.dispatchEvent(new Event('inspection-progress'));
  }

  window.inspectionProgress = { update };
})();
