import pytest
from backend.app.core.security import (
    sanitize_username,
    is_safe_target_url,
    build_safe_check_url,
)


def test_sanitize_username_valid():
    assert sanitize_username("alexdev") == "alexdev"
    assert sanitize_username("user_123") == "user_123"
    assert sanitize_username("john.doe-42") == "john.doe-42"


def test_sanitize_username_invalid():
    with pytest.raises(ValueError):
        sanitize_username("")
    with pytest.raises(ValueError):
        sanitize_username("   ")
    with pytest.raises(ValueError):
        sanitize_username("user<script>")
    with pytest.raises(ValueError):
        sanitize_username("user;rm -rf")
    with pytest.raises(ValueError):
        sanitize_username("a" * 65)  # Exceeds max length


def test_is_safe_target_url():
    # Safe URLs
    assert is_safe_target_url("https://github.com/alexdev") is True
    assert is_safe_target_url("https://api.example.org/users/test") is True

    # Dangerous / SSRF URLs
    assert is_safe_target_url("http://127.0.0.1/admin") is False
    assert is_safe_target_url("http://localhost:8080") is False
    assert is_safe_target_url("http://169.254.169.254/latest/meta-data/") is False
    assert is_safe_target_url("http://0.0.0.0") is False
    assert is_safe_target_url("file:///etc/passwd") is False
    assert is_safe_target_url("ftp://ftp.example.com") is False


def test_build_safe_check_url():
    url = build_safe_check_url("https://github.com/{account}", "alexdev")
    assert url == "https://github.com/alexdev"

    url_with_strip = build_safe_check_url("https://example.com/{account}", "@alexdev", strip_chars="@")
    assert url_with_strip == "https://example.com/alexdev"
