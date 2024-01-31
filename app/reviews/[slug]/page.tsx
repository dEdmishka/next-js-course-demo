import React from 'react';
import Heading from '@/components/Heading';
import ShareLinkButton from '@/components/ShareLinkButton';
import { getReview, getSlugs } from '@/lib/reviews';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface ReviewPageParams {
  slug: string;
}

interface ReviewPageProps {
  params: ReviewPageParams;
}

// export const dynamic = 'force-dynamic';

// export const dynamicParams = true;

// Let's assume that we only add and publish new reviews, but NOT edit or delete them
export async function generateStaticParams(): Promise<ReviewPageParams[]> {
  const slugs = await getSlugs();

  // console.log('[ReviewPage] generateStaticParams:', slugs);

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params: { slug },
}: ReviewPageProps): Promise<Metadata> {
  const review = await getReview(slug);
  if (!review) {
    notFound();
  }
  return {
    title: review.title,
  };
}

export default async function ReviewPage({
  params: { slug },
}: ReviewPageProps) {
  const review = await getReview(slug);
  if (!review) {
    notFound();
  }
  return (
    <>
      <Heading>{review.title}</Heading>
      <p className="font-semibold pb-3">
        {review.subtitle}
      </p>
      <div className="flex gap-3 items-baseline">
        <p className="italic pb-2">{review.date}</p>
        <ShareLinkButton />
      </div>
      <Image
        priority
        src={review.image}
        alt={review.title}
        width="640"
        height="360"
        className="mb-2 rounded"
      />
      {/* <p>Here will be the review fro Stardev valley.{text}</p> */}
      {/* <article dangerouslySetInnerHTML={{ __html: html }} /> */}
      <article
        dangerouslySetInnerHTML={{ __html: review.body }}
        className="max-w-screen-sm prose prose-slate"
      />
    </>
  );
}
