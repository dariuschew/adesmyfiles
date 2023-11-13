class Tag {
  constructor(tag_id, tag_name) {
    this.tag_id = tag_id;
    this.tag_name = tag_name;
  }

  // Method to update tag name
  updateTagName(newName) {
    this.tag_name = newName;
  }

  // Method to get a plain object representation of the tag
  toObject() {
    return {
      tag_id: this.tag_id,
      tag_name: this.tag_name,
    };
  }
}

module.exports = Tag;