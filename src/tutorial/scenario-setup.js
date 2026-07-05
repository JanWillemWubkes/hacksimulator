/**
 * Scenario setup-helpers — normaliseer de VFS-wereld vóór een verse tutorial-start.
 *
 * Tutorials draaien tegen de échte (persistente) VFS en blokkeren commando's niet.
 * Daardoor kan een vorige run of handmatige drift een missie laten stranden:
 *  - een relatief-pad-stap (cd documents) breekt als de cwd elders staat;
 *  - een niet-idempotente stap (mkdir bevindingen) faalt met "File exists";
 *  - een lees-stap (cat ~/.bash_history) faalt als de gebruiker het bestand wiste.
 *
 * Deze helpers zetten de relevante staat terug naar de aanname van de missie.
 * Ze draaien ALLEEN bij een verse start (niet bij resume — daar is de VFS juist
 * consistent met de stap waar de gebruiker gebleven was).
 */

import { initialFilesystem } from '../filesystem/structure.js';

const HOME = '/home/hacker';

// Zoek de originele node voor een absoluut pad in de initiële VFS-boom.
function _initialNode(absPath) {
  var parts = absPath.split('/').filter(Boolean);
  var node = initialFilesystem['/'];
  for (var i = 0; i < parts.length; i++) {
    if (!node || node.type !== 'directory' || !node.children) return null;
    node = node.children[parts[i]];
  }
  return node || null;
}

// Zorg dat alle bovenliggende mappen van een pad bestaan (recreëer ontbrekende).
function _ensureParents(vfs, absPath) {
  var parts = absPath.split('/').filter(Boolean);
  var cur = '';
  for (var i = 0; i < parts.length - 1; i++) {
    cur += '/' + parts[i];
    if (!vfs.exists(cur)) {
      try { vfs.createDirectory(cur); } catch (e) { return false; }
    }
  }
  return true;
}

// Zet de cwd terug naar home zodat relatief-pad-stappen kloppen (fixt cwd-drift).
export function normalizeCwd(vfs) {
  try { vfs.setCwd(HOME); } catch (e) { /* home hoort altijd te bestaan */ }
}

// Herstel een bestand naar zijn originele inhoud als het ontbreekt (gewiste read-target).
// Getrouwe inhoud uit initialFilesystem, zodat stap-feedback die naar de inhoud
// verwijst waar blijft.
export function restoreFile(vfs, absPath) {
  if (vfs.exists(absPath)) return;
  var node = _initialNode(absPath);
  if (!node || node.type !== 'file') return;
  if (!_ensureParents(vfs, absPath)) return;
  try { vfs.createFile(absPath, node.content || ''); } catch (e) { /* race/parent */ }
}

// Verwijder een artefact van een vorige run (bv. de mkdir-doelmap) zodat een
// niet-idempotente stap opnieuw slaagt.
export function removeIfExists(vfs, absPath, recursive) {
  if (!vfs.exists(absPath)) return;
  try { vfs.delete(absPath, !!recursive); } catch (e) { /* al weg */ }
}
