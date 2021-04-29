export default class Category {


  /**
   * Use this to identify this category. It is a random key or ObjectId if this category exists as is known
   */
  public id: string
  public _id: string
  public name: string
  public parents: string[] = []
  public children: string[] = []
  public keywords: string[] = []
  public official: boolean = false
  public translations: any = {}
  public images: string[] = []

  constructor(data: any) {
    this.id = data.id
    this._id = data._id
    this.name = data.name
    this.parents = data.parents || []
    this.children = data.children || []
    this.keywords = data.keywords || []
    this.official = data.official || false
    this.translations = data.translations || {}
    this.images = data.images || []
  }

  toRequestObject() {
    // id is just a displayed id
    // if the category was fetched from the server (exists) it will have "_id" attribute
    // backend uses it to identify whether a new category should be created
    const { id, ...result } = this;
    return result;
  }
}
