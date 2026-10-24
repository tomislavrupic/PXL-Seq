import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const index = await readFile(new URL('index.html', root), 'utf8');
for (const name of ['privacy', 'support']) {
  const html = await readFile(new URL(`${name}.html`, root), 'utf8');
  assert.ok(html.includes('info@tomislav-rupic.com'), `${name}: contact missing`);
  assert.ok(html.includes('name="viewport"'), `${name}: viewport missing`);
  assert.ok(!/awaiting owner|not yet published|owner review draft|proposed retention/i.test(html), `${name}: unapproved draft language`);
  assert.ok(html.includes('href="index.html"'), `${name}: return link missing`);
  assert.ok(html.includes('href="privacy.html"'), `${name}: privacy link missing`);
  assert.ok(html.includes('href="support.html"'), `${name}: support link missing`);
  assert.ok(!/fonts\.googleapis|fonts\.gstatic|<script\b/i.test(html), `${name}: unexpected remote dependency or script`);
  assert.ok(index.includes(`href="${name}.html"`), `${name}: footer link missing`);
}
const privacy = await readFile(new URL('privacy.html', root), 'utf8');
for (const text of ['Keychain', 'Forget Mac', 'TestFlight', 'GitHub Pages', 'Tailscale', 'Camera']) {
  assert.ok(privacy.includes(text), `privacy: missing ${text}`);
}
const css = await readFile(new URL('legal.css', root), 'utf8');
assert.ok(!/@import|https?:\/\//i.test(css), 'legal styles must be self-contained');
console.log('PASS: privacy/support content, navigation, contact and local dependencies');
