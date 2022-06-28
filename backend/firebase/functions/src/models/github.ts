export enum Action {
  created = 'created',
  canceled = 'canceled',
  edited = 'edited',
  tier_changed = 'tier_changed',
  pending_cancellation = 'pending_cancellation',
  pending_tier_change = 'pending_tier_change',
}

export interface WebhookPayload {
  action: Action;
  sponsorship: Sponsorship;
  sender: Sender;

  changes?: Changes;
  effective_date?: string;
}

export interface Sponsorship {
  node_id: string;
  created_at: string;
  sponsorable: Sponsorable;
  sponsor: Sponsor;
  privacy_level: string;
  tier: Tier;
}

export interface Sponsorable {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface Sponsor {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface Tier {
  node_id: string;
  created_at: string;
  description: string;
  monthly_price_in_cents: number;
  monthly_price_in_dollars: number;
  name: string;
  is_one_time: boolean;
  is_custom_amount: boolean;
}

export interface Sender {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}
export interface Changes {
  tier?: {
    from?: Tier;
  };
  privacy_level?: {
    from?: Tier;
  };
}
