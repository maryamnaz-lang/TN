#!/usr/bin/env python3
"""
THE COMPONENT FUNNEL — "is there anything new worth sharing?"

Maryam's ask, Aug 24 2026: do not interrupt every response to argue about
whether a thing is a new component. Batch it. So this answers the question in
one shot, on demand or on a timer, and stays quiet when the answer is no.

WHAT IT LOOKS FOR, in order of how much it costs to miss:

  1. A LAYER ON DISK THAT `build-ds.py` DOES NOT READ. The worst failure of
     the lot and completely silent: add `39-gauge.css` to `build.py`'s list,
     forget `build-ds.py`'s, and the design system simply never sees it. No
     warning anywhere, because from `build-ds.py`'s point of view the file
     does not exist.

  2. CLASS NAMES NEW SINCE THE LAST REVIEW. Under include-by-default these
     are already IN the design system — nothing is lost by not answering. The
     reason to look is narrower and still worth it: to decide whether one
     deserves a markup recipe in gallery.html. A component whose internal
     structure nobody wrote down is one the next portal will guess at, and a
     guessed `.plate` or `.ring` looks broken rather than absent.

  3. A LAYER WHOSE CONTENT CHANGED since the last review, when git can tell
     us. A rule edited inside an existing class will not show up as a new
     name, but it can still change a shared component.

It keeps a small state file, `.funnel-state.json`, holding the names already
seen, so the same list is not re-offered every two hours. That is the whole
point: silence unless something actually changed.

    python3 funnel.py              # the digest
    python3 funnel.py --accept-all # record everything current as reviewed
                                   # (use once, to set the baseline)
    python3 funnel.py --quiet      # print nothing when there is nothing new
                                   # (exit 0 = nothing new, 1 = something new)
"""
import collections
import importlib.util
import json
import pathlib
import re
import subprocess
import sys

HERE = pathlib.Path(__file__).parent
SRC = HERE.parent / 'hifi' / 'build'
STATE = HERE / '.funnel-state.json'

# reuse build-ds.py's vocabulary rather than restating it — a second copy of
# the SYSTEM list would drift the first time someone added a component
_spec = importlib.util.spec_from_file_location('bds', str((HERE / 'build-ds.py').resolve()))
bds = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(bds)

CLASS_RE = re.compile(r'\.(-?[A-Za-z_][A-Za-z0-9_-]*)')


def load_state():
    if STATE.exists():
        return json.loads(STATE.read_text())
    return {'reviewed': [], 'layer_hashes': {}}


def save_state(state):
    STATE.write_text(json.dumps(state, indent=1, sort_keys=True) + '\n')


def scan():
    """-> ({cls: {'layers': [...], 'rules': n}} for every non-core class,
    missing_layers)"""
    found = collections.defaultdict(lambda: {'layers': [], 'rules': 0})
    on_disk = sorted(p.name for p in SRC.glob('*.css'))
    missing = [n for n in on_disk if n not in bds.LAYERS]

    # read every layer on disk, INCLUDING ones build-ds.py does not list —
    # those are exactly the ones whose components are invisible today
    # SINCE THE POLICY BECAME INCLUDE-BY-DEFAULT, "unclassified" no longer
    # exists — a new component is in the design system the moment it is built.
    # So this collects every class name that is NOT part of the documented core
    # and not excluded: the things that shipped without anyone looking at them.
    # The digest is now FYI plus a nudge to document, not a gate.
    for name in on_disk:
        text = re.sub(r'/\*[\s\S]*?\*/', '', (SRC / name).read_text())
        for sel in re.findall(r'([^{}]+)\{', text):
            if sel.strip().startswith('@'):
                continue
            for cls in set(CLASS_RE.findall(sel)):
                if bds.classify(cls) != 'included':
                    continue          # 'core' is documented, 'excluded' is out
                rec = found[cls]
                rec['rules'] += 1
                if name not in rec['layers']:
                    rec['layers'].append(name)
    return dict(found), missing


def changed_layers(state):
    """Layers whose git blob changed since the last accepted review. Silent if
    this is not a git tree — the funnel still works, it just cannot report
    edits inside existing classes."""
    try:
        out = subprocess.run(['git', 'hash-object'] + [str(SRC / n) for n in bds.LAYERS
                                                       if (SRC / n).exists()],
                             capture_output=True, text=True, cwd=str(HERE), timeout=20)
        if out.returncode:
            return {}, {}
    except Exception:
        return {}, {}
    names = [n for n in bds.LAYERS if (SRC / n).exists()]
    now = dict(zip(names, out.stdout.split()))
    was = state.get('layer_hashes', {})
    diff = {n: h for n, h in now.items() if was.get(n) and was[n] != h}
    return diff, now


def looks_like_a_component(cls, rec, all_names):
    """A cheap signal so the digest can be read in ten seconds rather than
    forty. A real component tends to bring children with its own prefix and
    to be styled more than once; a one-off leaf does neither."""
    kids = [n for n in all_names if n != cls and n.startswith(cls + '-')]
    if kids:
        return f'{len(kids)} child class(es): ' + ' '.join('.' + k for k in kids[:4])
    if rec['rules'] >= 6:
        return f"{rec['rules']} rules — styled like a component"
    if len(rec['layers']) > 1:
        return f"touched by {len(rec['layers'])} layers"
    return ''


def main():
    quiet = '--quiet' in sys.argv
    accept = '--accept-all' in sys.argv
    state = load_state()
    reviewed = set(state.get('reviewed', []))

    unclassified, missing = scan()
    edits, now_hashes = changed_layers(state)

    fresh = {c: r for c, r in unclassified.items() if c not in reviewed}

    if accept:
        state['reviewed'] = sorted(reviewed | set(unclassified))
        state['layer_hashes'] = now_hashes
        save_state(state)
        print(f'baseline set: {len(state["reviewed"])} name(s) recorded as reviewed, '
              f'{len(now_hashes)} layer hash(es) stored.')
        return 0

    if not fresh and not missing and not edits:
        if not quiet:
            print('Component funnel: nothing new. '
                  f'({len(bds.LAYERS)} layers, {len(bds.SYSTEM)} shared class names.)')
        return 0

    print('=' * 72)
    print('COMPONENT FUNNEL — something new since the last review')
    print('=' * 72)

    if missing:
        print('\n!! LAYER(S) ON DISK THAT build-ds.py DOES NOT READ.')
        print('   The design system cannot see anything in these. Add them to')
        print('   LAYERS in build-ds.py, in the same position build.py gives them:')
        for n in missing:
            print(f'     {n}')

    if fresh:
        by_layer = collections.defaultdict(list)
        for cls, rec in fresh.items():
            by_layer[rec['layers'][0]].append((cls, rec))
        print(f'\n{len(fresh)} class name(s) new since the last review. These are')
        print('ALREADY in the design system — include-by-default means nothing is')
        print('lost. Worth a look only to decide whether any deserves a markup')
        print('recipe in gallery.html, which is what stops the next portal from')
        print('guessing its structure and getting it wrong.\n')
        all_names = set(unclassified)
        for layer in sorted(by_layer):
            print(f'  {layer}')
            for cls, rec in sorted(by_layer[layer]):
                hint = looks_like_a_component(cls, rec, all_names)
                print(f'     .{cls:<22s} {rec["rules"]:>3} rule(s)'
                      + (f'  <- {hint}' if hint else ''))

    if edits:
        print(f'\n{len(edits)} layer(s) edited since the last review — a rule changed')
        print('  inside an existing class, which will not show up as a new name:')
        for n in sorted(edits):
            print(f'     {n}')

    print('\n' + '-' * 72)
    print('Nothing here is urgent, and nothing is lost. Record the baseline:')
    print('    cd design-system && python3 funnel.py --accept-all')
    print('and rebuild so the new layers are picked up:')
    print('    python3 build-ds.py')
    print('-' * 72)
    return 1


if __name__ == '__main__':
    sys.exit(main())
