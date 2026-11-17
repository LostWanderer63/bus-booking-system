const BASE_URL = process.env.API_URL || `http://localhost:${process.env.PORT || 3000}`;

async function call(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  console.log(`${method} ${path} -> ${res.status}`, data);
  return { status: res.status, data };
}

async function main() {
  const created = await call('POST', '/users', { name: 'Virat Kohli', email: 'virat.kohli@example.com' });
  if (created.status !== 201) throw new Error('Insert failed');
  const { id } = created.data;

  await call('PUT', `/users/${id}`, { name: 'King Kohli', email: 'king.kohli@example.com' });
  await call('GET', `/users/${id}`);
  await call('DELETE', `/users/${id}`);

  await call('GET', `/users/${id}`);
  await call('PUT', `/users/${id}`, { name: 'Ghost' });
  await call('DELETE', `/users/${id}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
