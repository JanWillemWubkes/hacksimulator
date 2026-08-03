#!/usr/bin/env python3
"""Statische server die ELKE respons als no-store markeert.

Bestaat omdat submodules geen ?v= dragen: een warme browser serveert dan oude
modules naast een verse entry (zie .claude/rules/architecture-patterns.md).
Met no-store is elke meting gegarandeerd tegen de code op schijf.
"""
import http.server, socketserver, sys, os

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8899
ROOT = sys.argv[2] if len(sys.argv) > 2 else os.getcwd()

class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    def log_message(self, *a):
        pass

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("127.0.0.1", PORT), H) as httpd:
    print(f"no-store server op http://127.0.0.1:{PORT} (root={ROOT})", flush=True)
    httpd.serve_forever()
