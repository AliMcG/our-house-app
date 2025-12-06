export default function InviteErrorPage({ params }: { params: { slug: string } }) {
  return (
    <div>
      <h1>Invite Invalid</h1>
      <p>The invite token <strong>{params.slug}</strong> is no longer valid.</p>
    </div>
  )
}