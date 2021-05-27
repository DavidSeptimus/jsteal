import { TealBlock } from "../ir/TealBlock";

/**
 * Topologically sort the graph which starts with the input TealBlock.
 *
 * based on Kahn's algorithm from https://en.wikipedia.org/wiki/Topological_sorting
 *
 * @param {TealBlock} start The starting point of the graph to sort.
 * @return {Array<TealBlock>}  An ordered list of TealBlocks
 * that is sorted such that every block is guaranteed to appear in the list
 * before all of its outgoing blocks.
 */
export function sortBlocks(start: TealBlock): Array<TealBlock> {
  const s = [start];
  const order = [];

  while (s.length !== 0) {
    const n = s.shift() as TealBlock;
    order.push(n);

    for (const m of n.getOutgoing()) {
      let i;
      for (const [i2, block] of m.incoming.entries()) {
        i = i2;
        if (n === block) {
          m.incoming.splice(i2, 1);
          break;
        }
      }
      if (m.incoming.length === 0) {
        if (i === 0) {
          s.unshift(m);
        } else {
          s.push(m);
        }
      }
    }
  }
  return order;
}
