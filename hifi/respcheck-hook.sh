#!/bin/sh
# =========================================================================
# THE RESPONSIVE CHECK, WIRED TO THE REBUILD.
#
# Maryam's standing ask, 31 Aug 2026: a new design has to work on mobile and
# tablet in the same task it was built in. CLAUDE.md states the rule and every
# session in this repo reads it — but a rule depends on the session honouring
# it, and several sessions work here at once. This is the half that does not
# depend on anyone remembering.
#
# It is a PostToolUse hook on Bash. It reads the tool call on stdin, does
# nothing at all unless the command that just ran was a `build.py`, and then
# runs `respcheck.mjs --quick --quiet`:
#
#   clean  -> silent, exit 0. The rebuild looks like a rebuild.
#   broken -> the report on stderr and exit 2, which is the code that feeds
#             stderr back to the model rather than only to the transcript.
#
# WHY THE QUICK SET AND NOT THE SWEEP. The full run is 197 screens at four
# widths, about 90 seconds; blocking every rebuild for that long would get the
# hook switched off inside a day. The quick set is ~30 screens in ~15s — every
# dashboard, all seven auth screens, one of each sub-page — and it is a TRIAGE.
# The message on a clean run says nothing, and the message on a broken one says
# what to run next.
#
# `--quiet` also skips entirely when the built file's hash is one a previous
# clean run of the same mode already measured, so a rebuild that changed no
# output costs nothing.
# =========================================================================
set -u

# The hook's stdin is the tool call as JSON. Anything other than a build is not
# our business — including a `build.py` inside a longer command line, which is
# still a build.
cmd=$(jq -r '.tool_input.command // ""' 2>/dev/null || echo '')
case "$cmd" in
  *build.py*) ;;
  *) exit 0 ;;
esac

root="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/.." && pwd)}"
cd "$root/hifi" 2>/dev/null || exit 0
[ -f respcheck.mjs ] || exit 0

out=$(node respcheck.mjs --quick --quiet 2>&1)
code=$?

[ "$code" -eq 0 ] && exit 0

# 2 is a hard failure of the checker itself (no browser, no built file). Say so
# once, on stderr, but do NOT block: a missing Chrome is not a broken layout,
# and treating it as one would put a false finding in front of every rebuild.
if [ "$code" -eq 2 ]; then
  printf '%s\n' "$out" >&2
  exit 0
fi

printf '%s\n' "$out" >&2
printf '%s\n' "respcheck (quick, ~30 screens) found the above at mobile/tablet widths.
Per CLAUDE.md the responsive pass is part of this task, not a follow-up. Fix the
layer that states the rule, rebuild, and confirm with the full sweep:

    cd hifi && node respcheck.mjs --edge" >&2
exit 2
