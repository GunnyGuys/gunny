class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      // Agr: this.constructor meaning the stack ignore this frame
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;

// Operational errors represent runtime problems.
// These errors are expected in the Node.js runtime and should be dealt with
// in a proper way. This does not mean the application itself has bugs.
// It means they need to be handled properly.
// Here’s a list of common operational errors:

// failed to connect to server
// failed to resolve hostname
// invalid user input
// request timeout
// server returned a 500 response
// socket hang-up
// system is out of memory
