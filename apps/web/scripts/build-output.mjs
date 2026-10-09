import { lstat, realpath } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';

export function strictlyWithin(parent, child, paths = { relative, isAbsolute, sep }) {
  const path = paths.relative(parent, child);
  return path !== '' && !paths.isAbsolute(path) && path !== '..' && !path.startsWith('..' + paths.sep);
}

// Vite empties the output directory. Reject links before permitting that operation.
export async function assertBuildOutput(web, output) {
  web = await realpath(web);
  output = resolve(output);
  const target = resolve(web, '../server/target');
  if (output !== resolve(web, 'dist') && !strictlyWithin(target, output)) {
    throw new Error('Build output must be Web dist or a generated Server target child');
  }
  for (let current = output; ; current = dirname(current)) {
    try {
      if ((await lstat(current)).isSymbolicLink()) throw new Error('Build output ancestry must not contain a symlink/junction');
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
    if (dirname(current) === current) break;
  }
  return output;
}
