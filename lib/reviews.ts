import { readdir } from 'node:fs/promises';
import { marked } from 'marked';
import qs from 'qs';
import { log } from 'node:console';

const CMS_URL = 'http://localhost:1337';

interface CmsItem {
    id: number;
    attributes: any;
}

export interface Review {
    slug: string;
    title: string;
    date: string;
    image: string;
}

export interface FullReview extends Review {
    body: string | Promise<string>;
}

export async function getFeaturedReview(): Promise<Review> {
    const reviews = await getReviews();
    return reviews[0];
}

export async function getReview(slug: string): Promise<FullReview> {
    const url = `${CMS_URL}/api/reviews?`
        + qs.stringify({
            filters: { slug: { $eq: slug } },
            fields: ['slug', 'title', 'subtitle', 'publishedAt', 'body'],
            populate: { image: { fields: ['url'] } },
            pagination: { pageSize: 1, withCount: false },
        }, { encodeValuesOnly: true });
    log('getReview:', url);
    const response = await fetch(url);
    const { data } = await response.json();
    const { attributes } = data[0];
    return {
        slug: attributes.slug,
        title: attributes.title,
        date: attributes.publishedAt.slice(0, 'yyyy-mm-dd'.length),
        image: CMS_URL + attributes.image.data.attributes.url,
        body: marked(attributes.body),
    };
}

/*
    slug: 'hellblade',
    title: 'Hellblade',
    date: '2023-05-06',
    image: '/images/hellblade.jpg',
*/
export async function getReviews(): Promise<Review[]> {
    const url = `${CMS_URL}/api/reviews?`
        + qs.stringify({
            fields: ['slug', 'title', 'subtitle', 'publishedAt'],
            populate: { image: { fields: ['url'] } },
            sort: ['publishedAt:desc'],
            pagination: { pageSize: 6 },
        }, { encodeValuesOnly: true });
    log('getReviews:', url);
    const response = await fetch(url);
    const { data } = await response.json();
    return data.map(({ attributes }) => ({
        slug: attributes.slug,
        title: attributes.title,
        date: attributes.publishedAt.slice(0, 'yyyy-mm-dd'.length),
        image: CMS_URL + attributes.image.data.attributes.url,
    }));
}
