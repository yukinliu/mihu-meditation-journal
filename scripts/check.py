"""Validate the dependency-free release using Python's standard library."""
from html.parser import HTMLParser
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'

class PageCheck(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack, self.ids, self.refs = [], [], []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        for key in ('href', 'src'):
            if key in attrs:
                self.refs.append(attrs[key])
        if tag not in {'meta', 'link', 'br', 'img', 'hr', 'input', 'source', 'wbr'}:
            self.stack.append(tag)
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
    def handle_endtag(self, tag):
        assert self.stack and self.stack.pop() == tag, f'Invalid nesting: {tag}'

html = (DIST / 'index.html').read_text()
css = (DIST / 'style.css').read_text()
page = PageCheck()
page.feed(html)
assert not page.stack, page.stack
assert len(page.ids) == len(set(page.ids)), 'Duplicate IDs'
for chapter in ('about', 'group', 'individual', 'life', 'training'):
    assert chapter in page.ids, chapter
for ref in page.refs:
    if ref.startswith('#'):
        assert ref[1:] in page.ids or ref in {'#cover', '#meditation'}, ref
    elif not re.match(r'\w+:|//', ref):
        assert (DIST / ref.split("?", 1)[0]).is_file(), ref
for ref in re.findall(r'url\([\'\"]?([^\)\'\"]+)', css):
    if not ref.startswith('data:'):
        assert (DIST / ref.split("?", 1)[0]).is_file(), ref
assert len(re.findall(r'class="album-slide"', html)) == 14, 'Expected fourteen album images'
assert len(re.findall(r'data-page="', html)) == 4, 'Expected four tabs'
for file in DIST.rglob('*'):
    if file.is_file():
        assert file.suffix in {'.html', '.css', '.js', '.svg', '.png', '.jpg', '.woff2'}, file
assert not list(DIST.glob('*-v[23].*')), 'Experimental pages in release'
print('PASS: HTML, four tabs, fourteen images, links, CSS resources and release allowlist')
