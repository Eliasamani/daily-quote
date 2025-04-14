export interface Tag {
    id: string;
    name: string;
  }
  
  export interface Author {
    id: string;
    name: string;
    slug: string;
    description?: string;
    bio?: string;
    link?: string;
  }
  
  export interface Quote {
    id: string;
    content: string;
    tags: Tag[];
    author: Author;
  }
  
  interface SearchParams {
    query?: string;
    tag?: string;
    author?: string;
    minLength?: number;
    maxLength?: number;
  }