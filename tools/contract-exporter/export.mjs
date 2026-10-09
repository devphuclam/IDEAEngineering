import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { checkContract, sourceHashes, json, stableJSON } from './contract.mjs';

const tool = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(tool, '../..');
const args = new Set(process.argv.slice(2));
const allowed = new Set(['--check','--json','--update','-u','--open','-o','--data-only','--print-source-hashes']);

async function main() {
  for (const arg of args) if (!allowed.has(arg)) throw Error('Unknown argument: ' + arg);
  if (args.has('--print-source-hashes')) {
    console.log(stableJSON(sourceHashes(root,json(path.join(tool,'contract-config.json')))));
    return;
  }
  const update = args.has('--update') || args.has('-u');
  if (args.has('--check') && update) throw Error('--check is read-only; do not combine with --update');
  if (args.has('--data-only') && !update) throw Error('--data-only requires --update');
  const packet = checkContract(root,{checkCatalog:!update});
  const summary = {status:packet.errors.length?'FAIL':'PASS',routes:packet.routes.length,
    operations:packet.operations.length,errors:packet.errors,
    limits:'Static supported-route discovery + reviewed source drift + bounded OpenAPI checks; not runtime/security qualification.'};
  if (args.has('--json')) console.log(stableJSON(summary));
  else { console.log('API CONTRACT CHECK = ' + summary.status + '; routes=' + summary.routes + '; operations=' + summary.operations);
    for (const error of summary.errors) console.error(error); }
  if (packet.errors.length) { process.exitCode=1; return; }
  if (args.has('--check')) return;
  if (update) {
    const target = path.join(tool,'data/api-catalog.json');
    const text = stableJSON(packet.catalog);
    if (!fs.existsSync(target) || fs.readFileSync(target,'utf8').replace(/\r\n/g,'\n') !== text) {
      fs.writeFileSync(target+'.tmp',text); fs.renameSync(target+'.tmp',target);
    }
  }
  if (args.has('--data-only')) { console.log('Generated catalogue updated; document rendering intentionally omitted.'); return; }
  // Check is dependency-free. Only actual rendering loads the existing Word/Excel tools.
  const {renderContract} = await import('./render.mjs');
  const outputs = await renderContract(packet.catalog,tool,path.join(tool,'output'));
  for (const output of outputs) console.log('EXPORTED ' + output);
  if (args.has('--open') || args.has('-o')) {
    if (process.platform !== 'win32') throw Error('--open is Windows-only; open the HTML path manually');
    const child = spawnSync('cmd.exe',['/d','/c','start','',outputs[2]],{shell:false});
    if (child.status !== 0) throw Error('Browser open failed');
  }
}
main().catch(error => { console.error('API CONTRACT ERROR: ' + error.message); process.exitCode=1; });
