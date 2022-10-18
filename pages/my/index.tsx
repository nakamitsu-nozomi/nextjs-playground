import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getSession} from 'next-auth/react'
import { useRouter } from 'next/router'
import { octokit } from '@/utils/fetcher'

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

export  const getServerSideProps = async (context :GetServerSidePropsContext)=> {
  const session  = await getSession(context)
  if (!session) {
    return {
      props: {
        repos: null,
        error: { message: 'Unauthorized' },
        generatedAt: new Date().toString(),
      },
    }
  }
  try {
    const { data: user } = await octokit.request('GET /user')
    if (!user) {
      return {
        props: {
          repos: null,
          error: { message: 'invalid user' },
          generatedAt: new Date().toString(),
        },
      }
    }
    const { data } = await octokit.request("GET /user/repos", {
      username: session.user?.name,
    })
    return {
      props: {
        repos: data,
        error: { message: '' },
        generatedAt: new Date().toString(),
      },
    }
  } catch (e) {
    return {
      props: {
        user:null,
        repos: null,
        error: { message: 'cannot fetch data' },
        generatedAt: new Date().toString(),
      },
    }

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
      <h1 style={{background:'lavender'}}>SSR</h1>
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
export default Pages