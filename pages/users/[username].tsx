import { GetStaticPropsContext, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { octokit } from '@/utils/fetcher'
type Props = InferGetServerSidePropsType<typeof getStaticProps>

export async function getStaticPaths() {
  return {
    paths: [],
    // fallback: 'blocking', //ISR
    fallback: true, //ISG
  }
}

const Pages = ({ repos, error, generatedAt }: Props) => {
  const router = useRouter()
  if (!repos && error && !generatedAt) {
    return <p>{error.message}</p>
  }
  if (!repos || !generatedAt) {
    return <p>loading....</p>
  }
  const redirect = () => {
    router.push('/').then()
  }

  return (
    <>
      <p onClick={redirect}>ホーム</p>
      <h1>SSG(ISG/ISR)</h1>
      <p> generatedAt :{generatedAt}</p>
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
export async function getStaticProps(context: GetStaticPropsContext) {
  const username = context.params?.username
  if (typeof username !== 'string') {
    return {
      props: { repos: null, error: { message: 'Bad Request' } },
    }
  }
  try {
    const { data } = await octokit.request('GET /users/{username}/repos', {
      username,
    })
    return {
      props: { repos: data, error: { message: '' }, generatedAt: new Date().toString() },
    }
  } catch (e) {
    return {
      props: {
        repos: null,
        error: { message: 'cannot fetch data' },
        generatedAt: new Date().toString(),
      },
    }
  }
}

export default Pages
