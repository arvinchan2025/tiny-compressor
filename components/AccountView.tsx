

export default function AccountView() {
  return (
    <button
      className={"rounded-lg border border-gray-200 p-2 hover:bg-gray-50"}
      onClick={() => {
        window.location.href = '/auth/sign-in'
      }}
    >Login In</button>
  )
}