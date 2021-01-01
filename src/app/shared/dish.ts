export class Dish {
    id: string;
    name: string;
    image: string;
    category: string;
    featured: boolean;
    label: string;
    price: string;
    description: string;

    constructor(id: string, name: string, image: string, category: string, featured: boolean, label: string, 
        price: string, description: string){
            this.id = id;
            this.name = name;
            this.image = image;
            this.category = category;
            this.featured = featured;
            this.label = label;
            this.price = price;
            this.description = description;
        }
}
