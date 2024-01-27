import Heading from "@/components/Heading";
import ShareLinkButton from "@/components/ShareLinkButton";
import { getReview, getSlugs } from '@/lib/reviews';
import { Metadata } from "next";

interface ReviewPageParams {
  slug: string;
}

interface ReviewPageProps {
  params: ReviewPageParams;
}

export async function generateStaticParams(): Promise<ReviewPageParams[]> {
  const slugs = await getSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params: { slug } }: ReviewPageProps): Promise<Metadata> {
  const review = await getReview(slug);
  return {
    title: review.title,
  };
}

export default async function ReviewPage({ params: { slug } }: ReviewPageProps) {
  // const text = await readFile('./content/reviews/stardew-valley.md', 'utf8');
  // // const html = marked(text);
  // const { content, data: { title, date, image } } = matter(text);
  // const html = marked(content);
  const review = await getReview(slug);

  return (
    <>
      <Heading>{review.title}</Heading>
      {/* <p className="italic pb-2">{review.date}</p> */}
      <div className="flex gap-3 items-baseline">
        <p className="italic pb-2">{review.date}</p>
        <ShareLinkButton />
      </div>
      <img src={review.image} alt={review.title}
        width="640" height="360" className="mb-2 rounded"
      />
      {/* <p>Here will be the review fro Stardev valley.{text}</p> */}
      {/* <article dangerouslySetInnerHTML={{ __html: html }} /> */}
      <article dangerouslySetInnerHTML={{ __html: review.body }}
        className="max-w-screen-sm prose prose-slate"
      />
    </>
  );
};