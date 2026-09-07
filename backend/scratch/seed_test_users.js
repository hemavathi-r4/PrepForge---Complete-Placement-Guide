/**
 * Seed two test users for Stage 5 API testing:
 *  - test@example.com / test123
 *  - userb@example.com / test123
 */
const BASE_URL = 'http://localhost:5005/api';

async function seed() {
  const users = [
    { name: 'Test User A', email: 'test@example.com', password: 'test123' },
    { name: 'Test User B', email: 'userb@example.com', password: 'test123' }
  ];

  for (const user of users) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    const data = await res.json();
    if (res.status === 201 && data.token) {
      console.log(`✓ Registered ${user.email}`);
    } else if (data.message?.toLowerCase().includes('already')) {
      console.log(`- ${user.email} already exists.`);
    } else {
      console.log(`✗ ${user.email}: ${data.message}`);
    }
  }
  process.exit(0);
}
seed();
