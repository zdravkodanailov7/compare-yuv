export type Post = {
    id: string;
    created_at: string;
    user_id: string;
    before_image_url: string;
    after_image_url: string;
    caption?: string;
    is_favorite?: boolean;
    is_shared?: boolean;
  };