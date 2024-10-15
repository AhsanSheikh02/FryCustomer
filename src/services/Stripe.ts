// TypeScript

const REQM = ' is required';
const STRIPE_URL = 'https://api.stripe.com/v1/';

// Define types for card information and Stripe response
export interface CardInfo {
  number: string;
  exp_month: string | number;
  exp_year: string | number;
  cvc: string;
  address_city?: string;
  address_country?: string;
  address_line1?: string;
  address_line2?: string;
  address_state?: string;
  address_zip?: string;
  currency?: string;
}

export interface StripeTokenResponse {
  id: string;
  object: string;
  card: {
    id: string;
    brand: string;
    country: string;
    exp_month: number;
    exp_year: number;
    last4: string;
  };
  created: number;
  type: string;
  used: boolean;
}

export default class Stripe {
  private stripePublicKey: string;

  constructor(apiKey: string) {
    this.stripePublicKey = apiKey;
  }

  /**
   * Return the default header entries : Accept and Authorization
   * @returns {Object} Default headers with Accept and Authorization
   */
  private defaultHeader(): Record<string, string> {
    return {
      Accept: 'application/json',
      Authorization: `Bearer ${this.stripePublicKey}`,
    };
  }

  /**
   * Generic method to post to Stripe REST API
   * @param resource : REST API resource, e.g., tokens, charges, etc.
   * @param properties : Object, key by form param
   */
  private async stripePostRequest(
    resource: string,
    properties: Record<string, any>
  ): Promise<any> {
    const body = Object.entries(properties)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    const response = await fetch(`${STRIPE_URL}${resource}`, {
      method: 'POST',
      headers: {
        ...this.defaultHeader(),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    return response.json();
  }

  /**
   * Only operation allowed from client, using only public token
   * @param info : Card information including number, exp_month, exp_year, and cvc
   */
  public createToken(info: CardInfo): Promise<StripeTokenResponse> {
    if (!info) throw new Error(`info${REQM}`);
    if (!info.number) throw new Error(`cardNumber${REQM}`);
    if (!info.exp_month) throw new Error(`expMonth${REQM}`);
    if (!info.exp_year) throw new Error(`expYear${REQM}`);
    if (!info.cvc) throw new Error(`cvc${REQM}`);

    const card: Record<string, string | number> = {};
    Object.keys(info).forEach((key) => {
      card[`card[${key}]`] = info[key as keyof CardInfo]!;
    });

    return this.stripePostRequest('tokens', card);
  }
}
