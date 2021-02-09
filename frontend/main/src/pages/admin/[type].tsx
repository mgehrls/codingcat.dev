import Head from 'next/head';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';

import AdminLayout from '@/layout/admin/AdminLayout';

import { PostType } from '@/models/post.model';
import { useState, useEffect } from 'react';
import { Site } from '@/models/site.model';
import { getSite } from '@/services/serversideApi';
const EditPosts = dynamic(() => import('@/components/admin/EditPosts'), {
  ssr: false,
  loading: () => <p>Loading EditPosts...</p>,
});

const CreatePost = dynamic(() => import('@/components/admin/CreatePost'), {
  ssr: false,
});

export default function AdminDashboard({
  type,
  site,
}: {
  type: PostType | null;
  site: Site | null;
}): JSX.Element {
  return (
    <AdminLayout site={site}>
      <Head>
        <title>{`${type} | CodingCatDev`}</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="flex">
        {!type ? (
          <div>
            <h1>Dashboard</h1>
            <p>Show some welcoming things here.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col p-2">
              <div className="flex my-4">
                <CreatePost type={type} />
              </div>
              <EditPosts type={type} />
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps({
  params,
}: {
  params: { type: PostType };
}): Promise<{
  props: {
    type: PostType | null;
    site: Site | null;
  };
}> {
  const site = await getSite();
  const { type } = params;
  return {
    props: {
      type,
      site,
    },
  };
}
