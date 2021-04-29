import Category from "../categories/Category"

export default class Product {

  public id: string
  public name: string
  public description: string = ""
  public price: string = ""
  public categories: Category[] = []

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.categories = data.categories || [];
  }

  toRequestObject() {
    const res = { ...this, categories: this.categories.map(c => c.id) };
    delete res.id;
    return res;
  }
}
