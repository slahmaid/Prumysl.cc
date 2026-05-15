/**
 * Run in <head> before CSS: set base URL for GitHub Pages project site (/Prumysl.cc/).
 */
(function () {
  if (!/github\.io$/i.test(location.hostname)) return;
  var parts = location.pathname.split('/').filter(Boolean);
  if (!parts[0] || parts[0].toLowerCase() !== 'prumysl.cc') return;
  var base = document.createElement('base');
  base.href = location.origin + '/' + parts[0] + '/';
  document.head.appendChild(base);
})();
