import { signIn, signOut, useSession } from 'next-auth/react'
export const Header = () => {
  const { data: session } = useSession()
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '50px',
        background: 'salmon',
        alignItems: 'center',
        padding: '8px',
      }}
    >
      <div style={{ width: '40px', height: '40px' }}>
        {session?.user && typeof session.user.image === 'string' && (
          <img
            src={session.user.image}
            alt='アイコン'
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </div>
      <p>{session?.user?.name ? session.user.name : 'Guest User'}</p>

      <div style={{ marginLeft: 'auto' }}>
        {session ? (
          <button onClick={() => signOut()}>SIGN OUT</button>
        ) : (
          <button onClick={() => signIn()}>SIGN IN</button>
        )}
      </div>
    </div>
  )
}
