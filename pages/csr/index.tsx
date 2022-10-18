
import { Octokit } from "@octokit/core";
import { Session, } from "next-auth";
import { getSession, } from "next-auth/react";
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

type SessionWithAccessToken = Session & {
  accessToken: string;
}
export const Pages = () => {
const [repos,setRepos]=useState<any>([])
  const [isLoading,setIsLoading]=useState<boolean>(false)
  useEffect(() => {
    (async() => {
      try {
        setIsLoading(true)
        const session  = await getSession()  as SessionWithAccessToken;
        const octokit = new Octokit({
          auth:session.accessToken
        });
        const { data } = await octokit.request("GET /user/repos", {
          username: "nakamitsu-nozomi"
        })
        setRepos([...data])
      } catch (e) {
        console.log("errorやで",e)
      }
      finally {
        setIsLoading(false)
      }
    })()
  }, []);

  const router = useRouter()
  if (isLoading) {
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
      <h1 style={{background:'lightcyan'}}>CSR</h1>
      <ul>
        {repos.map((repo :any) => (
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