/**
 * Row and column edits that respect merged cells.
 *
 * The table commands used to count cells: "column 2" meant the second cell of each row, and a new row got as many
 * cells as the first row had. Once a cell spans two columns those counts no longer match the columns you see: a
 * new row came out a cell short, a new column went in at different places in different rows, and deleting a
 * column deleted a merged cell outright, its text included. These functions work on the grid instead: which cell
 * covers each row and column.
 */

export interface CellPlace {
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
}

const spanOf = (cell: HTMLTableCellElement, attribute: 'colspan' | 'rowspan'): number => {
  const parsed = parseInt(cell.getAttribute(attribute) || '1', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

const setSpan = (cell: HTMLTableCellElement, attribute: 'colspan' | 'rowspan', value: number): void => {
  if (value > 1) cell.setAttribute(attribute, String(value));
  else cell.removeAttribute(attribute);
};

/** The rows of this table, not of a table nested in one of its cells. */
export function tableRows(table: HTMLTableElement): HTMLTableRowElement[] {
  return Array.from(table.rows).filter((row) => row.closest('table') === table);
}

/** `grid[row][col]` is the cell that covers that place; `places` says where each cell starts and how far it reaches. */
export function buildGrid(table: HTMLTableElement): {
  grid: HTMLTableCellElement[][];
  places: Map<HTMLTableCellElement, CellPlace>;
  width: number;
} {
  const rows = tableRows(table);
  const grid: HTMLTableCellElement[][] = rows.map(() => []);
  const places = new Map<HTMLTableCellElement, CellPlace>();
  rows.forEach((row, r) => {
    let col = 0;
    Array.from(row.cells).forEach((cell) => {
      while (grid[r][col]) col++;
      const rowSpan = Math.min(spanOf(cell, 'rowspan'), rows.length - r);
      const colSpan = spanOf(cell, 'colspan');
      places.set(cell, { row: r, col, rowSpan, colSpan });
      for (let dr = 0; dr < rowSpan; dr++) {
        for (let dc = 0; dc < colSpan; dc++) grid[r + dr][col + dc] = cell;
      }
      col += colSpan;
    });
  });
  const width = grid.reduce((max, line) => Math.max(max, line.length), 0);
  return { grid, places, width };
}

/** Where a new cell goes: the section of its row, and the cell next to it on the side it was added from. */
export interface NewCellContext {
  adding: 'row' | 'column';
  section: Element | null;
  /** For a new row, the cell in the same column of the row it was added beside; for a new column, the cell beside it. */
  neighbour: HTMLTableCellElement | null;
}

export type CellFactory = (context: NewCellContext) => HTMLTableCellElement;

/** Puts `cell` into `row` at grid column `col`: before the first cell of that row that starts at or after it. */
function placeInRow(row: HTMLTableRowElement, cell: HTMLTableCellElement, col: number, places: Map<HTMLTableCellElement, CellPlace>): void {
  const next = Array.from(row.cells).find((candidate) => (places.get(candidate)?.col ?? Infinity) >= col);
  row.insertBefore(cell, next ?? null);
}

/**
 * Adds a row above or below the rows `cell` covers. A merged cell that reaches across the new row grows by one row
 * instead of getting a new cell beside it.
 */
export function insertRow(table: HTMLTableElement, cell: HTMLTableCellElement, where: 'above' | 'below', makeCell: CellFactory): HTMLTableRowElement | null {
  const rows = tableRows(table);
  const { grid, places, width } = buildGrid(table);
  const place = places.get(cell);
  if (!place) return null;

  // The new row goes in front of row `at` (or at the end).
  const at = where === 'above' ? place.row : place.row + place.rowSpan;
  const reference = rows[where === 'above' ? at : at - 1];
  const newRow = document.createElement('tr');
  const section = rows[at]?.parentElement ?? reference.parentElement;
  const grown = new Set<HTMLTableCellElement>();
  for (let col = 0; col < width; col++) {
    const before = at > 0 ? grid[at - 1]?.[col] : undefined;
    const after = grid[at]?.[col];
    if (before && before === after) {
      // A cell from a row above reaches across the new row: it covers that place too.
      if (!grown.has(before)) {
        setSpan(before, 'rowspan', (places.get(before)?.rowSpan ?? 1) + 1);
        grown.add(before);
      }
      continue;
    }
    newRow.appendChild(makeCell({ adding: 'row', section, neighbour: grid[where === 'above' ? at : at - 1]?.[col] ?? null }));
  }

  // In front of the row that follows, in that row's section: a row added below the header row is a body row.
  const following = rows[at];
  if (following) {
    following.parentElement?.insertBefore(newRow, following);
  } else {
    reference.parentElement?.appendChild(newRow);
  }
  return newRow;
}

/**
 * Adds a column left or right of the columns `cell` covers. A merged cell that reaches across the new column grows
 * by one column instead.
 */
export function insertColumn(table: HTMLTableElement, cell: HTMLTableCellElement, where: 'left' | 'right', makeCell: CellFactory): void {
  const rows = tableRows(table);
  const { grid, places } = buildGrid(table);
  const place = places.get(cell);
  if (!place) return;

  // The new column goes in front of grid column `at`.
  const at = where === 'left' ? place.col : place.col + place.colSpan;
  const grown = new Set<HTMLTableCellElement>();
  const additions: Array<{ row: HTMLTableRowElement; cell: HTMLTableCellElement }> = [];
  rows.forEach((row, r) => {
    const before = at > 0 ? grid[r][at - 1] : undefined;
    const after = grid[r][at];
    if (before && before === after) {
      if (!grown.has(before)) {
        setSpan(before, 'colspan', (places.get(before)?.colSpan ?? 1) + 1);
        grown.add(before);
      }
      return;
    }
    additions.push({ row, cell: makeCell({ adding: 'column', section: row.parentElement, neighbour: grid[r][where === 'left' ? at : at - 1] ?? null }) });
  });
  // Inserted once every place is known, so the positions above are not thrown off by the new cells.
  additions.forEach(({ row, cell: added }) => placeInRow(row, added, at, places));
}

/** Deletes the grid column `cell` starts in. A merged cell that covers more columns just gets narrower. */
export function deleteColumn(table: HTMLTableElement, cell: HTMLTableCellElement): boolean {
  const { grid, places, width } = buildGrid(table);
  const place = places.get(cell);
  if (!place || width <= 1) return false;

  const col = place.col;
  const seen = new Set<HTMLTableCellElement>();
  grid.forEach((line) => {
    const covering = line[col];
    if (!covering || seen.has(covering)) return;
    seen.add(covering);
    const span = places.get(covering)?.colSpan ?? 1;
    if (span > 1) setSpan(covering, 'colspan', span - 1);
    else covering.remove();
  });
  // A row whose every cell was in that column is left empty.
  tableRows(table).forEach((row) => {
    if (row.cells.length === 0) row.remove();
  });
  return true;
}

/**
 * Deletes the row `cell` starts in. A merged cell from a row above that reaches into it gets shorter; one that
 * starts in it and reaches further down moves to the next row, so its text is kept.
 */
export function deleteRow(table: HTMLTableElement, cell: HTMLTableCellElement): boolean {
  const rows = tableRows(table);
  const { grid, places, width } = buildGrid(table);
  const place = places.get(cell);
  if (!place || rows.length <= 1) return false;

  const r = place.row;
  const row = rows[r];
  const next = rows[r + 1];
  const seen = new Set<HTMLTableCellElement>();
  for (let col = 0; col < width; col++) {
    const covering = grid[r][col];
    if (!covering || seen.has(covering)) continue;
    seen.add(covering);
    const coveringPlace = places.get(covering)!;
    if (coveringPlace.rowSpan <= 1) continue;
    setSpan(covering, 'rowspan', coveringPlace.rowSpan - 1);
    if (coveringPlace.row === r && next) {
      // Starts here and reaches down: it carries on from the next row.
      placeInRow(next, covering, coveringPlace.col, places);
    }
  }
  row.remove();
  return true;
}

/** Every cell that covers part of the grid column `cell` starts in. */
export function cellsInColumnOf(table: HTMLTableElement, cell: HTMLTableCellElement): HTMLTableCellElement[] {
  const { grid, places } = buildGrid(table);
  const place = places.get(cell);
  if (!place) return [];
  const cells = new Set<HTMLTableCellElement>();
  grid.forEach((line) => {
    if (line[place.col]) cells.add(line[place.col]);
  });
  return Array.from(cells);
}
