"""Read-only package qualification against the retained accepted Server artifact."""
import hashlib
import sys
import zipfile

candidate, predecessor = sys.argv[1:]
with zipfile.ZipFile(candidate) as new, zipfile.ZipFile(predecessor) as old:
    old_libs = {name for name in old.namelist() if name.startswith("BOOT-INF/lib/") and name.endswith(".jar")}
    new_libs = {name for name in new.namelist() if name.startswith("BOOT-INF/lib/") and name.endswith(".jar")}
    assert new_libs - old_libs == {"BOOT-INF/lib/swagger-ui-5.32.14.jar"}, "Unexpected runtime graph addition"
    assert not old_libs - new_libs, "Unexpected runtime removal"
    assert all(old.read(name) == new.read(name) for name in old_libs), "Existing dependency changed"
    assert hashlib.sha256(new.read("BOOT-INF/lib/swagger-ui-5.32.14.jar")).hexdigest() == "d17ca6b09c60518574c14d4a40318dc58a11ea92a962e94f30e5a286e1efa4a6"
    assert any("log4j-core" in name for name in new_libs)
    assert not any("logback" in name.lower() for name in new_libs)
    for prefix in ("BOOT-INF/classes/db/migration/", "BOOT-INF/classes/static/"):
        names = {name for name in old.namelist() if name.startswith(prefix) and not name.endswith("/")}
        assert names == {name for name in new.namelist() if name.startswith(prefix) and not name.endswith("/")}
        assert all(old.read(name) == new.read(name) for name in names), "Product migration/Web bundle changed"
    for filename, checksum in {
        "LICENSE.txt": "cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30",
        "NOTICE.txt": "0d20d1adef18aee3f40dd258172155521ce702ac445cb5f7b7d60ed32dad2fb2",
    }.items():
        assert hashlib.sha256(new.read("BOOT-INF/classes/third-party/swagger-ui/" + filename)).hexdigest() == checksum
    assert not any(any(tool in name for tool in ("exec-maven-plugin", "plexus", "commons-exec", "maven-resolver-util")) for name in new_libs), "Build tools must not ship"
print("SWAGGER_PACKAGE_GRAPH_NOTICES_WEB_MIGRATIONS=PASS")
