

export default function PricingView() {
  return (
    <button
      className={"rounded-lg p-2 hover:bg-gray-50"}
      onClick={() => {
        window.location.href = '/pricing'
      }}
    >Pricing</button>
  )
}