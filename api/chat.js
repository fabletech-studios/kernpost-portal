// api/chat.js — Vercel Serverless Function
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, customerId, deskNumber, agentName } = req.body;

  if (!message || !customerId) {
    return res.status(400).json({ error: 'Missing message or customerId' });
  }

  // 1. Look up customer's active KernBox endpoint
  const { data: installation, error } = await supabase
    .from('installations')
    .select('kernbox_endpoint, openclaw_token, endpoint_active, tier')
    .eq('customer_id', customerId)
    .eq('endpoint_active', true)
    .single();

  if (error || !installation) {
    // No active KernBox found — return demo response
    return res.status(200).json({
      reply: getDemoResponse(agentName),
      source: 'demo'
    });
  }

  // 2. Forward to KernBox OpenClaw via Tailscale Funnel
  try {
    const kernboxResponse = await fetch(
      `${installation.kernbox_endpoint}/chat`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-openclaw-token': installation.openclaw_token,
          'x-kernpost-desk': String(deskNumber || 1)
        },
        body: JSON.stringify({
          message,
          agentName,
          customerId,
          deskNumber
        }),
        signal: AbortSignal.timeout(15000)
      }
    );

    if (!kernboxResponse.ok) {
      throw new Error(`KernBox returned ${kernboxResponse.status}`);
    }

    const data = await kernboxResponse.json();

    // 3. Log message to Supabase agent_messages table
    await supabase.from('agent_messages').insert({
      customer_id: customerId,
      desk_number: deskNumber || 1,
      role: 'user',
      content: message
    });
    await supabase.from('agent_messages').insert({
      customer_id: customerId,
      desk_number: deskNumber || 1,
      role: 'agent',
      content: data.reply
    });

    return res.status(200).json({
      reply: data.reply,
      source: 'kernbox'
    });

  } catch (err) {
    console.error('KernBox unreachable:', err.message);
    return res.status(200).json({
      reply: `Connection to your KernBox timed out. Is it powered on? (${agentName} will respond when reconnected.)`,
      source: 'offline'
    });
  }
}

function getDemoResponse(agentName) {
  const responses = [
    'Understood. Processing your request.',
    'On it. I\'ll flag anything that needs your attention.',
    'Got it. Running that in the background.',
    'Confirmed. I\'ll update the mission board when complete.',
    'Received. Executing now.'
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}
