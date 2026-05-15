/**
 * GitHub Pages project sites live at /Prumysl.cc/ — root-absolute URLs (/moka/, /css/) break.
 * On prumysl.cc this script does nothing.
 */
(function () {
  function projectPrefix() {
    if (!/github\.io$/i.test(location.hostname)) return '';
    var parts = location.pathname.split('/').filter(Boolean);
    if (parts[0] && parts[0].toLowerCase() === 'prumysl.cc') return '/' + parts[0];
    return '';
  }

  function patchRootPaths() {
    var prefix = projectPrefix();
    if (!prefix) return;

    var attrs = ['href', 'src', 'srcset'];
    document.querySelectorAll('[href^="/"], [src^="/"], [srcset^="/"]').forEach(function (el) {
      attrs.forEach(function (attr) {
        var val = el.getAttribute(attr);
        if (!val || !val.startsWith('/') || val.startsWith('//')) return;
        el.setAttribute(attr, prefix + val);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', patchRootPaths);
  } else {
    patchRootPaths();
  }
})();
