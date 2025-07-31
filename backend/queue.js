// Simple in-memory queue for malware scan jobs

const queue = [];

module.exports = {
  // Add a file scan job to the queue
  enqueue: (job) => queue.push(job),

  // Remove the next job from the queue
  dequeue: () => queue.shift(),

  // Check if the queue is empty
  isEmpty: () => queue.length === 0
};
