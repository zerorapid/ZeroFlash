export interface PostListItem {
  id: string;
  title: string;
  date: string;
  category: string;
  author: string;
  excerpt: string;
  readTime: string;
}

export interface Post extends PostListItem {
  content: string;
  seoMetaTitle?: string;
  seoMetaDesc?: string;
  seoImageAlt?: string;
  geoTarget?: string;
  aeoSummary?: string;
  faqQuestion1?: string;
  faqAnswer1?: string;
  faqQuestion2?: string;
  faqAnswer2?: string;
  faqQuestion3?: string;
  faqAnswer3?: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}
