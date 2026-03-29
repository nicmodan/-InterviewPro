const express = require('express');
const path    = require('path');
const crypto  = require('crypto');

const app  = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());

// ── Paystack: Initialise Transaction ─────────────────────────────────────────
// Browser cannot call Paystack directly (CORS on some endpoints).
// This proxy initialises a transaction and returns the authorization_url.
app.post('/api/paystack/init', async (req, res) => {
  const { secretKey, email, amount, reference, metadata, callbackUrl } = req.body;
  if (!secretKey || !email || !amount) {
    return res.status(400).json({ error: 'Missing required fields: secretKey, email, amount' });
  }
  try {
    const psRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${secretKey}`,
      },
      body: JSON.stringify({ email, amount, reference, metadata, callback_url: callbackUrl }),
    });
    const data = await psRes.json();
    return res.status(psRes.status).json(data);
  } catch (err) {
    console.error('[Paystack init] error:', err);
    return res.status(502).json({ error: 'Failed to reach Paystack API', detail: err.message });
  }
});

// ── Paystack: Verify Transaction ─────────────────────────────────────────────
// Called on the return redirect to confirm payment status server-side.
app.get('/api/paystack/verify/:reference', async (req, res) => {
  const { secretKey } = req.query;
  const { reference } = req.params;
  if (!secretKey || !reference) {
    return res.status(400).json({ error: 'Missing secretKey or reference' });
  }
  try {
    const psRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { 'Authorization': `Bearer ${secretKey}` },
    });
    const data = await psRes.json();
    return res.status(psRes.status).json(data);
  } catch (err) {
    console.error('[Paystack verify] error:', err);
    return res.status(502).json({ error: 'Failed to verify with Paystack', detail: err.message });
  }
});

// ── Paystack: Webhook ────────────────────────────────────────────────────────
// Paystack POSTs signed events here. Verify the signature before trusting.
app.post('/api/paystack/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const secret    = process.env.PAYSTACK_SECRET_KEY || '';
  const signature = req.headers['x-paystack-signature'] || '';
  const hash      = crypto.createHmac('sha512', secret).update(req.body).digest('hex');

  if (hash !== signature) {
    console.warn('[Paystack webhook] Invalid signature — rejected');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const event = JSON.parse(req.body);
  console.log('[Paystack webhook] event:', event.event, 'ref:', event.data?.reference);

  // TODO: update your Firestore payment record based on event.event
  // e.g. if (event.event === 'charge.success') { ... }

  res.status(200).json({ received: true });
});

// ── Paystack: Initiate Withdrawal (Transfer) ─────────────────────────────────
// Creates a transfer recipient then initiates a transfer to the admin's bank account.
app.post('/api/paystack/withdraw', async (req, res) => {
  const { secretKey, amount, accountNumber, bankCode, accountName, reason } = req.body;
  if (!secretKey || !amount || !accountNumber || !bankCode) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    // Step 1: Create transfer recipient
    const recipientRes = await fetch('https://api.paystack.co/transferrecipient', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${secretKey}` },
      body: JSON.stringify({
        type: 'nuban', currency: 'NGN',
        account_number: accountNumber,
        bank_code:      bankCode,
        name:           accountName || 'Admin',
      }),
    });
    const recipient = await recipientRes.json();
    if (!recipient.status) {
      return res.status(400).json({ error: 'Failed to create recipient', detail: recipient.message });
    }

    const recipientCode = recipient.data.recipient_code;

    // Step 2: Initiate transfer
    const transferRes = await fetch('https://api.paystack.co/transfer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${secretKey}` },
      body: JSON.stringify({
        source:    'balance',
        amount:    amount * 100,   // Paystack uses kobo
        recipient: recipientCode,
        reason:    reason || 'Admin Withdrawal',
      }),
    });
    const transfer = await transferRes.json();
    return res.status(transferRes.status).json(transfer);
  } catch (err) {
    console.error('[Paystack withdraw] error:', err);
    return res.status(502).json({ error: 'Withdrawal failed', detail: err.message });
  }
});

// ── Paystack: List Banks ──────────────────────────────────────────────────────
app.get('/api/paystack/banks', async (req, res) => {
  const { secretKey } = req.query;
  if (!secretKey) return res.status(400).json({ error: 'Missing secretKey' });
  try {
    const r = await fetch('https://api.paystack.co/bank?country=nigeria&use_cursor=false&perPage=100', {
      headers: { 'Authorization': `Bearer ${secretKey}` },
    });
    const data = await r.json();
    return res.status(r.status).json(data);
  } catch (err) {
    return res.status(502).json({ error: 'Failed to fetch banks', detail: err.message });
  }
});

// ── Paystack: Resolve Account Number ─────────────────────────────────────────
app.get('/api/paystack/resolve-account', async (req, res) => {
  const { secretKey, account_number, bank_code } = req.query;
  if (!secretKey || !account_number || !bank_code) {
    return res.status(400).json({ error: 'Missing params' });
  }
  try {
    const r = await fetch(
      `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
      { headers: { 'Authorization': `Bearer ${secretKey}` } }
    );
    const data = await r.json();
    return res.status(r.status).json(data);
  } catch (err) {
    return res.status(502).json({ error: 'Failed to resolve account', detail: err.message });
  }
});

// ── Static files ──────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

app.all('/api/*', (_req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✦  God's Celebrities running → http://localhost:${PORT}`);
});
