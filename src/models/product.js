class Product {
   constructor(name, price, category_uuid, description, size, is_new, discount, stock, image) {
       this.name = name;
       this.price = price;
       this.category_uuid = category_uuid;
       this.description = description;
       this.size = size;
       this.is_new = is_new;
       this.discount = discount;
       this.stock = stock;
       this.image = image;
   }  
}
export default Product;