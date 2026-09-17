#!/usr/bin/env python3
"""Static server for the TN portals, honouring vercel.json's rewrites.

Run by the launchd job com.talentnext.tn-static (KeepAlive), so it is
expected to stay up; if it exits for any reason launchd restarts it.
"""
import http.server
import json
import os
import socketserver
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(os.environ.get("TN_PORT", "8090"))
HOST = os.environ.get("TN_HOST", "127.0.0.1")


def load_rewrites():
    """Read vercel.json so local paths match production."""
    try:
        with open(os.path.join(ROOT, "vercel.json")) as fh:
            cfg = json.load(fh)
    except (OSError, ValueError):
        return {}
    return {r["source"]: r["destination"] for r in cfg.get("rewrites", [])}


REWRITES = load_rewrites()


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def translate_path(self, path):
        clean = path.split("?", 1)[0].split("#", 1)[0].rstrip("/") or "/"
        if clean in REWRITES:
            path = REWRITES[clean]
        return super().translate_path(path)

    def end_headers(self):
        # Design iteration: always serve the file on disk, never a cached copy.
        self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()

    def log_message(self, fmt, *args):
        sys.stderr.write("%s %s\n" % (self.log_date_time_string(), fmt % args))


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


if __name__ == "__main__":
    os.chdir(ROOT)
    with Server((HOST, PORT), Handler) as httpd:
        sys.stderr.write("serving %s at http://%s:%d/\n" % (ROOT, HOST, PORT))
        sys.stderr.flush()
        httpd.serve_forever()
