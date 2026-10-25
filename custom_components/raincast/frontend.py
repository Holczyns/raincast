"""Serve the sidebar panel bundled with the integration."""

from __future__ import annotations

import hashlib
from pathlib import Path

from homeassistant.components.http import StaticPathConfig
from homeassistant.components.panel_custom import async_register_panel
from homeassistant.core import HomeAssistant

from .const import DOMAIN

WWW = Path(__file__).parent / "www"
PANEL_FILE = WWW / "raincast-panel.js"
# Must differ from the panel path, or reloading the panel page hits the folder.
URL_BASE = f"/{DOMAIN}_files"


async def async_register_frontend(hass: HomeAssistant) -> None:
    frontend_loaded = ("frontend" in hass.config.components) and ("http" in hass.config.components)
    if not frontend_loaded:
        return
    panel_exists = await hass.async_add_executor_job(PANEL_FILE.is_file)
    if not panel_exists:
        return
    await hass.http.async_register_static_paths([StaticPathConfig(URL_BASE, str(WWW), cache_headers=True)])
    version = await hass.async_add_executor_job(_content_tag, PANEL_FILE)
    await async_register_panel(
        hass,
        frontend_url_path=DOMAIN,
        webcomponent_name="raincast-panel",
        sidebar_title="RainCast",
        sidebar_icon="mdi:sprinkler-variant",
        module_url=f"{URL_BASE}/{PANEL_FILE.name}{version}",
    )


def _content_tag(path: Path) -> str:
    """Query string that changes with the file, so browsers never keep an outdated copy."""
    digest = hashlib.sha256(path.read_bytes()).hexdigest()[:12]
    return f"?v={digest}"
