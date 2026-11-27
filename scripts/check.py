"""Validate the dependency-free release using Python's standard library."""
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys

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
for ref in re.findall(r'url\([\'\"]?([^\)\'\"]+)', css):
    if not ref.startswith('data:'):
        assert (DIST / ref.split("?", 1)[0]).is_file(), ref
assert len(re.findall(r'class="album-slide"', html)) == 14, 'Expected fourteen album images'
assert len(re.findall(r'data-page="', html)) == 4, 'Expected four tabs'

def validate_recommendation():
    activity = json.loads((DIST / 'current-recommendation.json').read_text(encoding='utf-8'))
    assert isinstance(activity, dict), 'Recommendation must be an object'
    for field in ('title', 'summary'):
        assert isinstance(activity.get(field), str) and activity[field].strip(), field
    for field in ('image', 'qrImage', 'actionText'):
        assert isinstance(activity.get(field, ''), str), field
    sections = activity.get('sections')
    assert isinstance(sections, list) and sections, 'Missing recommendation sections'
    for section in sections:
        assert isinstance(section, dict), section
        assert isinstance(section.get('title'), str) and section['title'].strip(), section
        paragraphs = section.get('paragraphs')
        assert isinstance(paragraphs, list) and paragraphs, section
        assert all(isinstance(p, str) and p.strip() for p in paragraphs), section
    target = activity.get('target', {'page': 'life'})
    assert isinstance(target, dict), 'Invalid recommendation target'
    chapter_routes = {'about', 'origin', 'practice', 'pause', 'research', 'meditation', 'meditation-design', 'life', 'training'}
    assert target.get('page') in chapter_routes, 'Unknown recommendation page'
    if 'section' in target:
        assert isinstance(target['section'], str) and re.fullmatch(r'[\w-]+', target['section']), 'Invalid recommendation section'
    snapshot = {'title': activity['title'], 'target': target}
    expected = '// Generated from current-recommendation.json by scripts/check.py.\n'
    expected += 'window.journalRecommendation = ' + json.dumps(snapshot, ensure_ascii=False, indent=2) + ';\n'
    local = DIST / 'current-recommendation-local.js'
    if '--sync-recommendation' in sys.argv:
        local.write_text(expected, encoding='utf-8')
    assert local.is_file() and local.read_text(encoding='utf-8') == expected, 'Run scripts/check.py --sync-recommendation'

validate_recommendation()
for ref in page.refs:
    if ref.startswith('#'):
        assert ref[1:] in page.ids or ref in {'#cover', '#meditation', '#jianji'}, ref
    elif not re.match(r'\w+:|//', ref):
        assert (DIST / ref.split("?", 1)[0]).is_file(), ref
for file in DIST.rglob('*'):
    if file.is_file():
        assert file.suffix in {'.html', '.css', '.js', '.json', '.svg', '.png', '.jpg', '.woff2', '.mp3'}, file
assert not list(DIST.glob('*-v[23].*')), 'Experimental pages in release'
print('PASS: HTML, tabs, images, links, CSS resources, current activity and release allowlist')
