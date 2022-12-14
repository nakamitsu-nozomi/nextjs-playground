import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
if (typeof process.env.GITHUB_OAUTH_CLIENT_ID !== 'string') {
  throw new Error('Undefined GITHUB_OAUTH_CLIENT_ID')
}
if (typeof process.env.GITHUB_OAUTH_CLIENT_SECRET !== 'string') {
  throw new Error('Undefined GITHUB_OAUTH_CLIENT_SECRET')
}
if (typeof process.env.NEXTAUTH_SECRET !== 'string') {
  throw new Error('Undefined NEXTAUTH_SECRET')
}
export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_OAUTH_CLIENT_ID,
      clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token
      }

      return token
    },
    async session({ session, token }) {
      console.log(" token.accessToken___", token.accessToken )
      return Promise.resolve({
        ...session,
        accessToken: token.accessToken,
      })

    },
  },
})
