import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useUser } from './hooks/use-user'
import { GetPostsResponse } from './database.types'
import { supaClient } from './supa-client'

type MyVotes = Record<string, 'up' | 'down' | undefined>

const AllPosts = () => {
  const { session } = useUser()
  const { pageNumber } = useParams()
  const [bumper, setBumper] = useState(0)
  const [posts, setPosts] = useState<GetPostsResponse[]>([])
  const [myVotes, setMyVotes] = useState<MyVotes>({})

  useEffect(() => {
    const queryPageNumber = pageNumber ? +pageNumber : 1

    supaClient
      .rpc('get_posts', { page_number: queryPageNumber })
      .select('*')
      .then(({ data }) => {
        setPosts(data as GetPostsResponse[])

        if (session?.user) {
          supaClient
            .from('post_votes')
            .select('*')
            .eq('user_id', session.user.id)
            .then(({ data: votesData }) => {
              if (!votesData) return

              const votes = votesData.reduce((acc, vote) => {
                acc[vote.post_id] = vote.vote_type as any
                return acc
              }, {} as MyVotes)

              setMyVotes(votes)
            })
        }
      })
  }, [session, bumper, pageNumber])

  return (
    <>
      {session && (
        <CreatePost
          newPostCreated={() => {
            setBumper((prev) => prev + 1)
          }}
        />
      )}

      <div className="posts-container">
        {posts?.map((post, i) => (
          <Post
            key={post.id}
            postDate={post}
            myVote={myVotes?.[post.id] || undefined}
            onVoteSuccess={() => {
              setBumper((prev) => prev + 1)
            }}
          />
        ))}
      </div>
    </>
  )
}

export default AllPosts
