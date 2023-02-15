import { useContext } from 'react'
import { Link } from 'react-router-dom'

import { GetPostsResponse } from '../database.types'
import { useUser } from '../hooks/use-user'

const Post = ({
  postData,
  myVote,
  onVoteSuccess,
}: {
  postData: GetPostsResponse
  myVote: 'up' | 'down' | undefined
  onVoteSuccess: () => void
}) => {
  const score = usePostScore(postData.id, postData.score)
  const { session } = useUser()

  return (
    <div className="post-container">
      <div className="post-upvote-container">
        <UpVote
          direction="up"
          filled={myVote === 'up'}
          enabled={!!session}
          onClick={async () => {
            await castVote({
              postId: postData.id,
              userId: session?.user.id as string,
              voteType: 'up',
              onSuccess: () => {
                onVoteSuccess()
              },
            })
          }}
        />
        <p className="text-center" data-e2e="upvote-count">
          {score}
        </p>
        <UpVote
          direction="down"
          filled={myVote === 'down'}
          enabled={!!session}
          onClick={async () => {
            await castVote({
              postId: postData.id,
              userId: session?.user.id as string,
              voteType: 'down',
              onSuccess: () => {
                onVoteSuccess()
              },
            })
          }}
        />
      </div>
      <Link to={`/post/${postData.id}`} className="flex-auto">
        <p className="mt-4">
          Posted By {postData.username} {timeAgo((postData as any).created_at)} ago
        </p>
        <h3 className="text-2xl">{postData.title}</h3>
      </Link>
    </div>
  )
}
