# Legacy SVG XML repair — 2026-09-14

This is the **historical** 23-view package from `IE-VEV-ARCH-VIEW-001`, not the current
architecture baseline. Seven original Mermaid SVG files contained HTML `<br>` elements. The
browser's standalone SVG XML parser rejected those files even though the 2026-09-10 review
reported successful Mermaid rendering. On 2026-09-14, only the literal void-element spelling
`<br>` was changed to XML-compatible `<br/>` in the seven named files below. No labels, paths,
geometry, product rule or PNG contact sheet were changed.

| SVG | Replaced elements | Original SHA-256 at `43c14ba` | XML-repaired SHA-256 |
|---|---:|---|---|
| `01-ARCH-VIEW-CTX-001.svg` | 5 | `5b357b5f3dac35997c6c16ed7960ea65dc3e19e9315e8b6601e842def006e74a` | `9a4ddbfea96eb75a01f6ed6d43f3dfecbafe0a599b5a665905548a23a96af189` |
| `02-ARCH-VIEW-CON-001.svg` | 9 | `94865218631aec28d445ac818273eb7f2e22af66711555db2d0231b057731b43` | `a85a9208c961c52c02356df78d0bff2dc116738f9073ebc5841c2f37fd4f8d1f` |
| `03-ARCH-VIEW-DEP-001.svg` | 6 | `1079b78f79d28cf7ef9677af123bc4f7460f3ff325016d366b56bb2c34143506` | `0ea63e6f5250576307e1d9698ffdb999a9ce9d2b54c63f327459e7a927efbcde` |
| `04-ARCH-VIEW-MOD-001.svg` | 10 | `6dbe71daed289133d50b39181ca5a33b8b9d33097801dac30551f71e4e368366` | `ede5d240b4da24f0648695a0e58d8bc0558e9e865cd3006e887f8aa37284f465` |
| `06-ARCH-VIEW-MOD-002.svg` | 13 | `f33a3f12b8b82609e9db4a82e26266cdf59067b0e3c985077d962de36aef4ee0` | `5fc1432de9db3fb9953dec6667800492098cc8b2329edfde98f9b1fae5a9950f` |
| `09-ARCH-VIEW-STATE-003.svg` | 6 | `609124d9c7edff32147690544e012a6dff522fa5677c9eb86d8434adce236002` | `783efdec084c076d6cf42dd0aeac21fbd225cca614a9d536dca8611b0d175780` |
| `12-ARCH-VIEW-STATE-004.svg` | 6 | `a6f765cb58927e248c1a64ce0bc1173ab87a2b06ee26aafd4e3911662596678a` | `887bd21155aeea591b60ef8305be977966408e0448e063157b105e0ea630e29d` |

The seven repaired files parsed as XML after the substitution. Original bytes remain recoverable
from Git commit `43c14ba4375ccf1e56f2dca85fcb1d3793f23a9e`; the historical
`render-results.json` and its original assertions were **not** rewritten. It must not be used to
claim the repaired SVG hashes or a fresh browser-open result. The repair is recorded in
[IE-CHG-DOC-REVIEW-001](../../registers/CHG-2026-09-14-post-pull-document-review-corrections.md).
The current source-linked gallery is [IE-VEV-ARCH-CORR-004](../IE-VEV-ARCH-CORR-004/index.html).
