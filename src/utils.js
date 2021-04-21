/**
 *
 * @param {string} html
 */
export function parseHTML(html) {
  var t = document.createElement('template');
  t.innerHTML = html;
  return t.content.cloneNode(true).childNodes[0];
}
