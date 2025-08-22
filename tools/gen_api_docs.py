#!/usr/bin/env python3
"""
Generate API docs (Markdown) by introspecting the FastAPI app.
Writes to docs/API_ROUTES.md
"""
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from typing import List

def main() -> int:
    from server.main import app  # FastAPI app

    lines: List[str] = []
    lines.append("# API Routes\n")
    lines.append("Base URL: `/api`\n")

    # Group routes by first path segment
    groups = {}
    for route in app.routes:
        path = getattr(route, 'path', '')
        methods = sorted(getattr(route, 'methods', []) - {"HEAD", "OPTIONS"}) if hasattr(route, 'methods') else []
        if not path.startswith('/') or not methods:
            continue
        # Skip docs and redoc and openapi
        if path.startswith('/docs') or path.startswith('/openapi') or path.startswith('/redoc'):
            continue
        seg = path.split('/')
        base = '/' + (seg[1] if len(seg) > 1 else '')
        groups.setdefault(base, []).append((path, methods))

    # Stable order: auth, users, jobs, assessment, ai, others
    order = ['/api/auth', '/api/users', '/api/jobs', '/api/assessment', '/api/ai']
    for base in sorted(groups.keys(), key=lambda x: (order.index(x) if x in order else 999, x)):
        header = base.replace('/api/', '').strip('/') or 'root'
        title = header.capitalize() if header != 'root' else 'Misc'
        lines.append(f"- __{title}__ (`{base}`)\n")
        for path, methods in sorted(groups[base], key=lambda x: x[0]):
            for m in methods:
                lines.append(f"  - {m} `{path.replace(base, '') or '/'}`\n")
        lines.append("")

    out = ROOT / 'docs' / 'API_ROUTES.md'
    out.write_text('\n'.join(lines).strip() + '\n', encoding='utf-8')
    print(f"Wrote {out}")
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
