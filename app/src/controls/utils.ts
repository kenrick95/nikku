export function parseHTML(html: string): Node {
  var t = document.createElement('template');
  t.innerHTML = html;
  return t.content.cloneNode(true).childNodes[0];
}
