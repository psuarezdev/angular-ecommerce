export interface StripeLineItem {
  price_data: {
    currency: 'eur';
    product_data: {
      name: string;
      images?: string[];
    };
    unit_amount: number;
  };
  quantity: number;
}

