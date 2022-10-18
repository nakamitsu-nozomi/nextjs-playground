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
  const redirect = (path :string) => {
    router.push(path).then()
  }
  return (
    <>
      <p onClick={()=>redirect("/")}>ホーム</p>
      <p onClick={()=>redirect("/users/nakamitsu-nozomi")}>SSG</p>
      <p onClick={()=>redirect("/my")}>SSR</p>
      <p onClick={()=>redirect("/csr")}>CSR</p>
      <h1 style={{background:'pink'}}>SSG(ISG/ISR)</h1>
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
      props: { repos: null, error: { message: 'Bad Request' }, revalidate: 10 },
    }
  }
  try {
    const { data } = await octokit.request('GET /users/{username}/repos', {
      username,
    })
    return {
      props: {
        repos: data,
        error: { message: '' },
        generatedAt: new Date().toString(),
        revalidate: 10,
      },
    }
  } catch (e) {
    return {
      props: {
        repos: null,
        error: { message: 'cannot fetch data' },
        generatedAt: new Date().toString(),
        revalidate: 10,
      },
    }
  }
}

export default Pages
