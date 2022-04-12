import { ListrTask } from 'listr2';



type ChainableTask = ListrTask & {
  /*
    If true, ensure that
  */
  modifiesContext?: boolean;
}

// A task, in, as used in a task chain, performs a transformation on the context.

// A task chain is a list of tasks.
type TaskChain = ChainableTask[];
type TaskTable = TaskChain[];
// A task table is a list of task chains.
// It can be visualised in table form as follows, where each row is a task chain, and each column is a task.
//      | 1 | 2 | 3 | 4 | 5 | 6 | (task positions)
//      |---|---|---|---|---|---|
//  | 1 | A | B | D | O |   |   | (task chain 1)
//  | 2 | A | C | E | G | O |   | (task chain 2)
//  | 3 | A | B | F | O |   |   | (task chain 3)
//  | 4 | A | B | F | G | O |   | (task chain 4)
// Each cell is a task. The letters represent the tasks. Each letter indicates a transformation run on the context.
// As the table shows, some task chains are identical with others up to a certain point.
// This means that up until that point, any transformations they perform on the context are identical.
// It would be a waste of time and processing power to run the same transformations on the same initial context, as the result would be the same.
// To solve this, we can reduce the task table to a task tree.
// A task tree produced from the above example would look like this:
//         A
//       ↙   ↘
//     B       C
//   ↙   ↘     ↓
// D       F   E
// ↓      ↙ ↘  ↓
// O     O   G G
//           ↓ ↓
//           O O
// Each separate branch of the tree is a new task chain, which should be fed a clone of the context which it can use independently.
// Using Listr's subtasking feature, we can run the task tree in parallel.
// This means that we can run task chains which would result in the same output only once, and at each divergence point, we can split the task tree into two subtrees, and run them in parallel.
// If we do this recursively, we will eventually have run the entire table with minimal processing power.

type TableSlice = (ChainableTask | undefined)[] & { position: number };

function slice(table: TaskTable, position: number): TableSlice {
  return Object.assign(table.map(chain => position < chain.length ? chain[position] : undefined), { position });
}