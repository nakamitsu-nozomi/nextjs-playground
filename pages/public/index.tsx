import { InferGetServerSidePropsType } from 'next'
import { octokit } from '@/utils/fetcher'

type Props = InferGetServerSidePropsType<typeof getStaticProps>
const Pages = ({ repos }: Props) => {
  return (
    <>
      <h1>SSG</h1>
      <ul>
        {repos.map((repo) => (
          <div key={repo.id}>
            <p>
              {repo.name}:{repo.language}
            </p>
          </div>
        ))}
      </ul>
    </>
  )
}
export async function getStaticProps() {
  const { data } = await octokit.request('GET /users/{username}/repos', {
    username: 'nakamitsu-nozomi',
  })
  return {
    props: { repos: data }, // will be passed to the page component as props
  }
}

export default Pages
