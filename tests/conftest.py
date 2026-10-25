"""The engine package is imported directly so its tests run without Home Assistant."""

import sys
from pathlib import Path

# Appended, not prepended: the integration has select.py and time.py, which must not shadow the standard library.
sys.path.append(str(Path(__file__).resolve().parents[1] / "custom_components" / "raincast"))
