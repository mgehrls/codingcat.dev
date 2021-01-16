import Head from 'next/head';
import { NextRouter, withRouter } from 'next/router';
import Layout from '@/layout/Layout';
import { take } from 'rxjs/operators';
import { makeStyles, createStyles, Button, Box } from '@material-ui/core';
import YouTubeIcon from '@material-ui/icons/YouTube';
import { red } from '@material-ui/core/colors';
import { createAndSaveTokens } from '@/services/api';
import { UserInfoExtended } from '@/models/user.model';
import { useUser } from '@/utils/auth/useUser';

const useStyles = makeStyles(() =>
  createStyles({
    video: {
      backgroundColor: red[500],
      '&:hover': {
        backgroundColor: red[300],
      },
    },
  })
);

function AdminDashboard({
  router,
  handleThemeChange,
  darkMode,
}: {
  router: NextRouter;
  handleThemeChange: any;
  darkMode: boolean;
}) {
  const { user }: { user: UserInfoExtended | null | undefined } = useUser();
  const code = router.query.code;
  const classes = useStyles();
  return (
    <Layout handleThemeChange={handleThemeChange} darkMode={darkMode}>
      <Head>
        <title>YouTube Auth | CodingCatDev</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div>
        {user && user.uid && code ? (
          <div>
            <h1>Store YouTube Authorization</h1>
            <p>{code}</p>
            <>
              <Button
                variant="contained"
                className={classes.video}
                onClick={() =>
                  createAndSaveTokens({
                    code,
                    redirectUri: 'http://localhost:3001/auth/youtube',
                  })
                    .pipe(take(1))
                    .subscribe()
                }
              >
                <Box
                  sx={{
                    paddingRight: '0.5rem',
                  }}
                >
                  Authorize YouTube
                </Box>
                <YouTubeIcon />
              </Button>
            </>
          </div>
        ) : (
          <div>
            <h2>
              You must be logged in and receiving a YouTube code for this page.
            </h2>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default withRouter(AdminDashboard);
