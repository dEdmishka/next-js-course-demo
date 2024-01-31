import { marked } from 'marked';
import { notFound } from 'next/navigation';
import qs from 'qs';

// const CMS_URL = 'http://localhost:1337';
const CMS_URL = 'http://127.0.0.1:1337';

interface CmsItem {
  id: number;
  attributes: any;
}

export interface Review {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  image: string;
}

export interface FullReview extends Review {
  body: string | Promise<string>;
}

// export async function getFeaturedReview(): Promise<Review> {
//   const reviews = await getReviews();
//   return reviews[0];
// }

/*
    slug: 'hellblade',
    title: 'Hellblade',
    date: '2023-05-06',
    image: '/images/hellblade.jpg',
*/
async function fetchReviews(parameters: any) {
  const url = `${CMS_URL}/api/reviews?${qs.stringify(parameters, {
    encodeValuesOnly: true,
  })}`;
  // console.log('[fetchReviews]:', url);

  try {
    const response = await fetch(url, {
      // cache: 'no-store'
      // next: {
      //   revalidate: 30 // seconds
      // }
    });
    if (!response.ok) {
      throw new Error(`CMS returned ${response.status} for ${url}`);
    }
    return await response.json();
  } catch (error: any | unknown) {
    /* handle error */

    return [];
  }
}

function toReview(item: CmsItem): Review {
  const { attributes } = item;
  return {
    slug: attributes.slug,
    title: attributes.title,
    subtitle: attributes.subtitle,
    date: attributes.publishedAt.slice(0, 'yyyy-mm-dd'.length),
    image: CMS_URL + attributes.image.data.attributes.url,
  };
}

export async function getReviews(pageSize: number): Promise<Review[]> {
  const { data } = await fetchReviews({
    fields: ['slug', 'title', 'subtitle', 'publishedAt'],
    populate: { image: { fields: ['url'] } },
    sort: ['publishedAt:desc'],
    pagination: { pageSize },
  });
  if (!data) {
    notFound();
  }
  return data.map(toReview);
}

export async function getReview(slug: string): Promise<FullReview | null> {
  const { data } = await fetchReviews({
    filters: { slug: { $eq: slug } },
    fields: ['slug', 'title', 'subtitle', 'publishedAt', 'body'],
    populate: { image: { fields: ['url'] } },
    pagination: { pageSize: 1, withCount: false },
  });
  if (data.length === 0) {
    return null;
  }
  const item = data[0];
  return {
    ...toReview(item),
    body: marked(item.attributes.body),
  };
}

export async function getSlugs(): Promise<string[] | null> {
  const { data } = await fetchReviews({
    fields: ['slug'],
    sort: ['publishedAt:desc'],
    pagination: { pageSize: 100 },
  });
  if (!data) {
    return null;
  }
  return data.map((item: CmsItem) => item.attributes.slug);
}
