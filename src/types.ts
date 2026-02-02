export type Recipe = {
    id: string;
    name: string;
    description?: string;
    image_url: string;
    instructions?: string;
    category?: string;
    published?: boolean;
    created_by?: string;
    calories?: number;
    cost?: number;
    prep_time?: number;
    cook_time?: number;
    servings?: number;
    disclaimer?: string;
    when_to_eat?: string;
    created_at?: string;
}

export type Ingredient = {
    id: string;
    name: string;
    description?: string;
    category?: string;
    default_unit?: string;
    available_all_year?: boolean;
    created_at?: string;
    available_jan?: boolean;
    available_feb?: boolean;
    available_mar?: boolean;
    available_apr?: boolean;
    available_may?: boolean;
    available_jun?: boolean;
    available_jul?: boolean;
    available_aug?: boolean;
    available_sep?: boolean;
    available_oct?: boolean;
    available_nov?: boolean;
    available_dec?: boolean;
}

export type User = {
    email: string;
    username: string;
    full_name: string;
}