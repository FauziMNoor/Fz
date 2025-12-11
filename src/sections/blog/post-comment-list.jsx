import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { PostCommentItem } from './post-comment-item';

// ----------------------------------------------------------------------

export function PostCommentList({ comments = [] }) {
  if (comments.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 3 }}>
        No comments yet. Be the first to comment!
      </Typography>
    );
  }

  return (
    <>
      {comments.map((comment) => (
        <Box key={comment.id}>
          <PostCommentItem
            name={comment.user_name || comment.guest_name || 'Anonymous'}
            message={comment.message}
            postedAt={comment.created_at}
            avatarUrl={comment.user_avatar || '/assets/images/avatar/avatar-default.webp'}
          />
        </Box>
      ))}
    </>
  );
}
