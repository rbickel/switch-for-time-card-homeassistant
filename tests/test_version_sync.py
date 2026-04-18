"""Tests for repository metadata and renamed integration paths."""

import json
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
MANIFEST = json.loads(
    (REPO_ROOT / "custom_components" / "switch_timer" / "manifest.json").read_text()
)


def test_version_files_are_kept_in_sync() -> None:
    """Package metadata versions should match the integration version."""
    hacs_version = json.loads((REPO_ROOT / "hacs.json").read_text())["version"]
    package = json.loads((REPO_ROOT / "package.json").read_text())

    assert hacs_version == MANIFEST["version"]
    assert package["version"] == MANIFEST["version"]
    assert package["name"] == "switch-timer-homeassistant"


def test_metadata_uses_renamed_integration() -> None:
    """Integration metadata should point at the renamed integration and repository."""
    hacs = json.loads((REPO_ROOT / "hacs.json").read_text())

    assert MANIFEST["domain"] == "switch_timer"
    assert MANIFEST["name"] == "Switch Timer"
    assert MANIFEST["documentation"] == "https://github.com/rbickel/switch-timer-homeassistant"
    assert (
        MANIFEST["issue_tracker"]
        == "https://github.com/rbickel/switch-timer-homeassistant/issues"
    )
    assert hacs["name"] == "Switch Timer"


def test_frontend_card_artifacts_are_removed() -> None:
    """The repository should no longer include custom card assets."""
    removed_paths = (
        REPO_ROOT / "src",
        REPO_ROOT / "dist",
        REPO_ROOT / "packages",
        REPO_ROOT / "custom_components" / "switch_timer" / "www",
    )

    for removed_path in removed_paths:
        assert not removed_path.exists()
