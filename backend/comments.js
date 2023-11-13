class Comments {
  constructor(
    comment_id,
    post_id,
    commenter_id,
    comment_text,
    comment_upvotes,
    comment_downvotes,
    time_created
  ) {
    this.comment_id = comment_id;
    this.post_id = post_id;
    this.commenter_id = commenter_id;
    this.comment_text = comment_text;
    this.comment_upvotes = comment_upvotes || 0; // default to 0 if undefined
    this.comment_downvotes = comment_downvotes || 0; // default to 0 if undefined
    this.time_created = time_created || new Date(); // default to current time if undefined
  }

  // Method to update comment text
  updateText(newText) {
    this.comment_text = newText;
  }

  // Method to update upvotes
  setUpvotes(upvotes) {
    this.comment_upvotes = upvotes;
  }

  // Method to update downvotes
  setDownvotes(downvotes) {
    this.comment_downvotes = downvotes;
  }

  // Method to get a plain object representation of the comment
  toObject() {
    return {
      comment_id: this.comment_id,
      post_id: this.post_id,
      commenter_id: this.commenter_id,
      comment_text: this.comment_text,
      comment_upvotes: this.comment_upvotes,
      comment_downvotes: this.comment_downvotes,
      time_created: this.time_created,
    };
  }
}

module.exports = Comments;