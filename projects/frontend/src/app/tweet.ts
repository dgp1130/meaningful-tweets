/** Immutable data class representing a tweet message. */
export interface Tweet {
  readonly author: Author;
  readonly content: string;
}

/** Immutable data class representing the author of a tweet. */
export interface Author {
  readonly handle: string;
  readonly avatar?: string;
}
