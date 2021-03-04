import { useRouter } from 'next/router';
import Image from 'next/image';
import Head from 'next/head';
import DefaultErrorPage from 'next/error';
import {
  getSite,
  postBySlugService,
  postsService,
} from '@/services/serversideApi';

import { Post as PostModel, PostType } from '@/models/post.model';
import renderToString from 'next-mdx-remote/render-to-string';
import { Source } from 'next-mdx-remote/hydrate';
import PostLayout from '@/components/PostLayout';
import Layout from '@/layout/Layout';
import { Site } from '@/models/site.model';
import AJPrimary from '@/components/global/icons/AJPrimary';

export default function Post({
  site,
  post,
  source,
}: {
  site: Site | null;
  post: PostModel;
  source: Source | null;
}): JSX.Element {
  const router = useRouter();
  if (router.isFallback) {
    return <h2>Loading ...</h2>;
  }

  if (!post) {
    return (
      <Layout site={site}>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <DefaultErrorPage statusCode={404} />
      </Layout>
    );
  }

  return (
    <Layout site={site}>
      <section className="grid grid-cols-1">
        <section className="relative grid items-start content-start grid-cols-1 gap-4">
          {post.type === PostType.course && (
            <section className="z-10 grid max-w-md grid-cols-1 gap-2 p-2 mx-auto mt-4 lg:p-4 bg-basics-50 lg:absolute lg:right-0 lg:top-20">
              {post.coverPhoto?.path ? (
                <>
                  <Image
                    src={post.coverPhoto?.path}
                    alt={post.title}
                    width="1920"
                    height="1080"
                    layout="responsive"
                    className=""
                  />
                </>
              ) : (
                <div className="flex items-center flex-auto rounded-t-md bg-primary-900 dark:bg-primary-900">
                  <AJPrimary className="max-w-full p-4 mx-auto max-h-32 2xl:max-h-64" />
                </div>
              )}
              {/* Beginner/Intermediate/Advanced descriptor */}
              <p className="p-2 rounded-full text-basics-50 dark:text-basics-50 bg-secondary-600 dark:bg-secondary-600">
                Beginner
              </p>
              <div className="flex items-center justify-center space-x-4 flex-nowrap">
                <button className="btn-secondary">Buy Now</button>
                <button className="btn-primary">Become a Member</button>
              </div>
            </section>
          )}
          <section className="grid content-center p-4 pt-6 bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50">
            {/* Title */}
            <div className="grid grid-cols-1 gap-4 mx-auto">
              <h1 className="text-4xl lg:text-7xl">{post.title}</h1>
              {/* Course Description */}
              <p className="max-w-sm">{post.content}</p>
              {/* Instructor */}
              <div className="p-2 xl:p-4 bg-secondary-600 rounded-t-md dark:bg-secondary-600">
                <div className="flex gap-4 ">
                  <img
                    src="https://avatars0.githubusercontent.com/u/45889730?s=460&u=74587a01abf2a7f33ae964c69856f3fe71b175b6&v=4"
                    alt="instructor"
                    className="w-20 h-20 border-2 rounded-full border-primary-900"
                  />

                  <div className="flex flex-col justify-center">
                    <h3 className="m-0 text-base font-light">Instructor</h3>
                    <h4 className="m-0 text-xl">Instructor Name</h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Instructor Page with List of Instructors and their Bios */}
            {/* <p className="p-2 xl:p-4">
          Instructor description: Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Sint ad iusto nobis excepturi deserunt
          exercitationem ex aspernatur sit culpa fugit porro, facere eaque.
          Harum consequuntur corrupti odio blanditiis, culpa officia!
        </p> */}
          </section>
        </section>
      </section>

      {post.sections?.map((section) => {
        <section>
          <h3>{section.title}</h3>
          <ul>
            {section.lessons?.map((lesson) => {
              <li>
                <h4>{lesson.title}</h4>
              </li>;
            })}
          </ul>
        </section>;
      })}

      <style jsx>{`
        p {
          width: fit-content;
        }
      `}</style>
    </Layout>
    // <PostLayout
    //   site={site}
    //   router={router}
    //   post={post}
    //   course={post}
    //   source={source}
    // />
  );
}

export async function getStaticPaths(): Promise<{
  paths: { params: { type: PostType; slug: string } }[];
  fallback: boolean;
}> {
  const paths: { params: { type: PostType; slug: string } }[] = [];
  [PostType.course].forEach(async (postType) => {
    const docData = await postsService(postType);
    for (const doc of docData) {
      paths.push({
        params: {
          type: doc.type,
          slug: doc.slug,
        },
      });
    }
  });
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({
  params,
}: {
  params: { coursePath: string };
}): Promise<
  | {
      props: {
        site: Site | null;
        post: PostModel | null;
        source: Source | null;
      };
      revalidate: number;
    }
  | { redirect: { destination: string; permanent: boolean } }
> {
  const { coursePath } = params;

  if (!coursePath) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  const site = await getSite();
  const posts = await postBySlugService(PostType.course, coursePath);
  const post = posts.length > 0 ? posts[0] : null;

  const source: Source | null =
    post && post.content
      ? await renderToString(post.content, {
          mdxOptions: {
            // remarkPlugins: [parse, mdx],
          },
        })
      : null;

  return {
    props: {
      site,
      post,
      source,
    },
    revalidate: 60,
  };
}
