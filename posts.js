class Posts {
  constructor(
    post_id,
    poster_id,
    tag_id,
    post_title,
    post_desc,
    image_url,
    comment_count,
    post_upvotes,
    post_downvotes,
    time_created
  ) {
    this.post_id = post_id;
    this.poster_id = poster_id;
    this.tag_id = tag_id;
    this.post_title = post_title;
    this.post_desc = post_desc;
    this.image_url = image_url;
    this.comment_count = comment_count || 0; // default to 0 if undefined
    this.post_upvotes = post_upvotes || 0; // default to 0 if undefined
    this.post_downvotes = post_downvotes || 0; // default to 0 if undefined
    this.time_created = time_created || new Date(); // default to current time if undefined
  }

  // Method to update post title
  updateTitle(newTitle) {
    this.post_title = newTitle;
  }

  // Method to update post description
  updateDescription(newDesc) {
    this.post_desc = newDesc;
  }

  // Method to increment comment count
  incrementCommentCount() {
    this.comment_count++;
  }

  // Method to update upvotes
  setUpvotes(upvotes) {
    this.post_upvotes = upvotes;
  }

  // Method to update downvotes
  setDownvotes(downvotes) {
    this.post_downvotes = downvotes;
  }

  // Method to update image URL
  updateImageURL(newURL) {
    this.image_url = newURL;
  }

  // Method to get a plain object representation of the post
  toObject() {
    return {
      post_id: this.post_id,
      poster_id: this.poster_id,
      tag_id: this.tag_id,
      post_title: this.post_title,
      post_desc: this.post_desc,
      image_url: this.image_url,
      comment_count: this.comment_count,
      post_upvotes: this.post_upvotes,
      post_downvotes: this.post_downvotes,
      time_created: this.time_created,
    };
  }
}

module.exports = Posts;
