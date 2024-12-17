export interface Expense {
    _id: string;
    name: string;
    amount: number;
    date: string;
    category: string;
}

export interface CategoryForm {
    name: string;
    color: string;
}

export interface Category {
    _id: string;
    name: string;
    color: string;
}