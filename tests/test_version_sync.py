"""Tests for frontend version synchronization."""
import json
import re
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
MANIFEST_VERSION = json.loads(
    (REPO_ROOT / "custom_components" / "switch_for_time" / "manifest.json").read_text()
)["version"]


def test_version_files_are_kept_in_sync():
    """Package metadata and source version should match the integration version."""
    package_version = json.loads((REPO_ROOT / "package.json").read_text())["version"]
    types_source = (REPO_ROOT / "src" / "types.ts").read_text()
    types_version = re.search(
        r"export const CARD_VERSION = '([^']+)';",
        types_source,
    )

    assert package_version == MANIFEST_VERSION
    assert types_version is not None
    assert types_version.group(1) == MANIFEST_VERSION


def test_built_frontend_assets_log_current_version():
    """Generated frontend assets should contain the current card version."""
    expected_log = f"SWITCH-FOR-TIME-CARD %c {MANIFEST_VERSION} "

    for asset_path in (
        REPO_ROOT / "dist" / "switch-for-time-card.js",
        REPO_ROOT
        / "custom_components"
        / "switch_for_time"
        / "www"
        / "switch-for-time-card.js",
    ):
        assert expected_log in asset_path.read_text()


def test_built_frontend_assets_support_lovelace_fire_dom_event():
    """Generated frontend assets should handle Lovelace fire-dom-event payloads."""
    for asset_path in (
        REPO_ROOT / "dist" / "switch-for-time-card.js",
        REPO_ROOT
        / "custom_components"
        / "switch_for_time"
        / "www"
        / "switch-for-time-card.js",
    ):
        contents = asset_path.read_text()
        assert 'll-custom' in contents
        assert 'switch-for-time-action' in contents
