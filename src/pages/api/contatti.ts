export const prerender = false;

export async function GET() {
	return new Response(
		JSON.stringify({
			ok: true,
			method: 'GET',
			hint: 'Use POST to send the form'
		}),
		{
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
}

export async function POST({ request }: { request: Request }) {
	// Logica POST esistente (placeholder - da implementare se necessario)
	const data = await request.json().catch(() => ({}));
	
	return new Response(
		JSON.stringify({
			ok: true,
			method: 'POST',
			received: data
		}),
		{
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
}




