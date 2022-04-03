/*
  A task is a function that returns a promise.
  Each task has an output stream.
  Tasks can wrap other tasks.
  Tasks can be chained.
  When multiple tasks are chained, They can be accessed as a single task, with a single output stream, which returns a promise that resolves when all tasks have completed.
  If one of the tasks in the chain fails, the whole chain fails and further tasks are not executed.
  A process spawned using child_proccess.exec can be run as a task.
  When a process is ran as a task, the stdout and stderr streams are piped to the output stream.
  The process is run in a child process.
  If the process exits with a non-zero exit code, the task fails.
  Each task has a name.
  If the name is not set, and the task does not wrap a process, it is derived from the function name (e.g. 'foo' for 'foo()').
  If the name is not set, and the task wraps a process, it is derived from the command name (e.g. 'foo' for 'foo --help').
*/
