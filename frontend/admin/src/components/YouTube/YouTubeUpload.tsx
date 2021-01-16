import { makeStyles, createStyles, Button, Box } from '@material-ui/core';
import { red } from '@material-ui/core/colors';

import YouTubeIcon from '@material-ui/icons/YouTube';
import { getAuthURL } from '@/services/api';
import { take } from 'rxjs/operators';
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

export default function YouTubeUpload(): JSX.Element {
  const { user }: { user: UserInfoExtended | null | undefined } = useUser();

  const classes = useStyles();
  return (
    <>
      <Button
        variant="contained"
        className={classes.video}
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
    </>
  );
}
