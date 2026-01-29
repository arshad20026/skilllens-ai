// This line tells Next.js to skip the static check that's causing the error
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <p>Dashboard loaded successfully</p>
    </div>
  );
}