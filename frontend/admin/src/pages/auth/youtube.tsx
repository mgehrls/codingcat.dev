import Head from 'next/head';
import { NextRouter, withRouter } from 'next/router';
import Layout from '@/layout/Layout';
import { take } from 'rxjs/operators';
import { makeStyles, createStyles, Button, Box } from '@material-ui/core';
import YouTubeIcon from '@material-ui/icons/YouTube';
import StorageIcon from '@material-ui/icons/Storage';
import { red, grey } from '@material-ui/core/colors';
import {
  createAndSaveTokens,
  deleteUserYouTubeApiToken,
  getAuthURL,
  userYouTubeApiToken,
} from '@/services/api';
import { UserInfoExtended } from '@/models/user.model';
import { useUser } from '@/utils/auth/useUser';
import { useEffect, useState } from 'react';
import { Observable } from 'rxjs';

const useStyles = makeStyles(() =>
  createStyles({
    youtube: {
      backgroundColor: red[500],
      '&:hover': {
        backgroundColor: red[300],
      },
    },
    storage: {
      backgroundColor: grey[500],
      '&:hover': {
        backgroundColor: grey[300],
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
  const classes = useStyles();

  const [code, setCode] = useState('');
  const [token, setToken] = useState<{ refresh_token: string } | null>(null);
  const [userToken$, setUserToken$] = useState<Observable<{
    refresh_token: string;
  }> | null>(null);

  useEffect(() => {
    if (user && user.uid) {
      setUserToken$(userYouTubeApiToken(user));
      const c = router.query.code as string;
      if (c) setCode(c);
    }
  }, [user]);

  useEffect(() => {
    if (!userToken$) {
      return;
    }
    const sub = userToken$.subscribe((t) => {
      if (t && t.refresh_token) {
        setToken(t);
      } else {
        setToken(null);
      }
    });
    return () => {
      if (sub) sub.unsubscribe();
    };
  }, [userToken$]);

  return (
    <Layout handleThemeChange={handleThemeChange} darkMode={darkMode}>
      <Head>
        <title>YouTube Auth | CodingCatDev</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div>
        {user && user.uid && code && !token?.refresh_token ? (
          <div>
            <h2>Store YouTube Authorization</h2>
            <h3>This is step 2 of 2.</h3>
            <p>{code}</p>
            <>
              <Button
                variant="contained"
                className={classes.storage}
                onClick={() =>
                  createAndSaveTokens({
                    code,
                    redirectUri: 'http://localhost:3001/auth/youtube',
                  })
                    .pipe(take(1))
                    .subscribe(() => router.replace('/'))
                }
              >
                <Box
                  sx={{
                    paddingRight: '0.5rem',
                  }}
                >
                  Store YouTube Key
                </Box>
                <StorageIcon />
              </Button>
            </>
          </div>
        ) : (
          <>
            {token ? (
              <div>
                <h2>You have YouTube access already set.</h2>
                <p>Would you like to remove access?</p>
                <Button
                  variant="contained"
                  className={classes.youtube}
                  onClick={() => {
                    if (user) {
                      deleteUserYouTubeApiToken(user)
                        .pipe(take(1))
                        .subscribe((t) => {
                          router.replace('/');
                        });
                    }
                  }}
                >
                  <Box
                    sx={{
                      paddingRight: '0.5rem',
                    }}
                  >
                    Remove YouTube Access
                  </Box>
                  <YouTubeIcon />
                </Button>
              </div>
            ) : (
              <div>
                <h2>
                  Authorize YouTube access to associate with your account.
                </h2>
                <h3>
                  This is step 1 of 2. You will need to also store the key when
                  you are redirected to this page.
                </h3>
                <Button
                  variant="contained"
                  className={classes.youtube}
                  onClick={() =>
                    getAuthURL({
                      redirectUri: 'http://localhost:3001/auth/youtube',
                    })
                      .pipe(take(1))
                      .subscribe((r) => {
                        window.location.href = r as string;
                      })
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
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default withRouter(AdminDashboard);
